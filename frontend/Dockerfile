FROM node:16-alpine AS builder
WORKDIR /app
COPY . ./
RUN npm ci && npm run build

FROM nginx:alpine AS product
WORKDIR /app
COPY --from=builder /app/build/* /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
