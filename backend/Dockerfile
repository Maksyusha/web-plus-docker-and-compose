FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm i -g pm2 & npm i --omit=dev
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
CMD [ "pm2-runtime", "start", "ecosystem.config.js"]

