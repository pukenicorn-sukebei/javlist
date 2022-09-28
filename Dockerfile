FROM node:alpine as base

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock nest-cli.json ./
COPY prisma ./prisma

######################################################################################

FROM base as builder
RUN apk update && apk add --no-cache openjdk17

RUN SKIP_POSTINSTALL=1 yarn install --non-interactive --frozen-lockfile

COPY tsconfig*.json openapitools.json ./
COPY src ./src

RUN ls -la ./node_modules/.bin >&2
RUN yarn generate && yarn build

######################################################################################

FROM base as output
RUN SKIP_POSTINSTALL=1 yarn install --non-interactive --frozen-lockfile  --production
RUN yarn prisma:generate

COPY --from=builder /app/dist /app/dist
COPY .env.default .

ENTRYPOINT ["yarn"]
CMD ["start:prod"]
