FROM alpine

EXPOSE 5000

RUN apk add --no-cache caddy

RUN mkdir -p /var/app

WORKDIR /var/app

COPY . .

RUN mkdir -p /var/www/html
RUN chown caddy:caddy /var/www/html
WORKDIR /var/www/html

COPY pages/ /var/www/html/
RUN ls -R

# serve static files + redirects
CMD [ "caddy", "run", "--config", "/var/app/caddy-config/Caddyfile", "--adapter", "caddyfile" ]
