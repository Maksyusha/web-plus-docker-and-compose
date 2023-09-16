FROM node:18-alpine AS builder
WORKDIR /var/www/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
FROM node:16-alpine as production
WORKDIR /var/www/app
COPY --from=builder /var/www/app/package*.json ./
RUN npm i --omit=dev
COPY --from=builder /var/www/app/dist ./dist/
CMD ["node", "./dist/src/main.js"]

