FROM node:alpine as base

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock nest-cli.json ./
COPY prisma .

///////////////////////////////////////////////////////////////////////////

FROM base as builder
RUN yarn install --non-interactive --frozen-lockfile --ignore-scripts

COPY tsconfig*.json openapitools.json ./
COPY src .

RUN yarn build

///////////////////////////////////////////////////////////////////////////

FROM base
RUN yarn install --non-interactive --frozen-lockfile --ignore-scripts --production

COPY --from=builder /app/dist /app/dist
COPY .env.default .

ENTRYPOINT ["yarn"]
CMD ["start:prod"]
