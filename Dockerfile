FROM node:lts as builder

WORKDIR /app
COPY . .
RUN apt update && apt install -y make g++ python3
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
RUN pnpm build
RUN npm pkg delete scripts.prepare && rm -rf node_modules && pnpm i --prod

FROM node:lts as production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

CMD ["node", "dist/index.mjs"]
