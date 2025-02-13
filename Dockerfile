ARG NODE_VERSION=18.12-alpine
ARG NGINX_VERSION=1.26.3-alpine

# Stage build

FROM node:${NODE_VERSION} AS cloud_ui_builder

WORKDIR /app

COPY package*.json /app/
COPY .env.dist /app/.env
COPY VERSION /app/VERSION

RUN npm i -g pnpm

RUN pnpm install

COPY ./ /app/

RUN pnpm run build

# Stage run

FROM nginx:${NGINX_VERSION} AS cloud_ui

COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY .docker/nginx/docker-entrypoint.sh /docker-entrypoint.sh

COPY --from=cloud_ui_builder /app/build/ /usr/share/nginx/html

COPY --from=cloud_ui_builder /app/manifest.json /usr/share/nginx/html/manifest.json

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD [ "nginx", "-g","daemon off;" ]
