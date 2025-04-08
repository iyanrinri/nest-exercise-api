# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app
RUN yarn config set registry https://registry.npmjs.org
ENV NODE_OPTIONS="--max-old-space-size=512"
COPY package*.json ./
RUN yarn install --network-concurrency 2
COPY . .
RUN yarn run build

# Stage 2: Run the app
FROM node:22-alpine

WORKDIR /app
RUN yarn config set registry https://registry.npmjs.org
ENV NODE_OPTIONS="--max-old-space-size=512"
COPY package*.json ./
RUN yarn install --production --network-concurrency 2

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/src/main.js"]
