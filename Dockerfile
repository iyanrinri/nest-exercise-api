# Stage 1: Build the app
FROM node:22-alpine as builder

WORKDIR /app
RUN yarn config set registry https://registry.npmjs.org
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

# Stage 2: Run the app
FROM node:22-alpine

WORKDIR /app
RUN yarn config set registry https://registry.npmjs.org
COPY package*.json ./
RUN yarn install --production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
