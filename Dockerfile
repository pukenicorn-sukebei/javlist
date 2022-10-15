FROM node:alpine as base

ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

COPY package.json yarn.lock nest-cli.json ./

######################################################################################

FROM base as dependencies
ENV PATH=/app/prod_modules/.bin:$PATH

RUN SKIP_POSTINSTALL=1 yarn install --non-interactive --immutable --prod --modules-folder=prod_modules
RUN SKIP_POSTINSTALL=1 yarn install --non-interactive --immutable --prod=false

######################################################################################

FROM base as builder
RUN apk update && apk add --no-cache openjdk17

COPY tsconfig*.json openapitools.json ./

COPY --from=dependencies /app/node_modules /app/node_modules

COPY prisma ./prisma
COPY src ./src

RUN yarn generate && yarn build

######################################################################################

FROM base as output

COPY .env.default .
COPY --from=dependencies /app/prod_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

ENTRYPOINT ["yarn"]
CMD ["start:prod"]
