FROM node:20.5-bullseye-slim AS base

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma

FROM base AS builder

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install --force

COPY . .

RUN npx prisma generate

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

USER node

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist 
COPY --from=builder --chown=node:node /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]
