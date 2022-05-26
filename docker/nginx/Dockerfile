FROM nginx:latest

COPY docker/nginx/nginx_app.conf /etc/nginx/nginx.conf
COPY docker/nginx/ssl /etc/nginx/ssl

RUN apt-get update -y
RUN apt-get install tcpdump -y

EXPOSE 80
EXPOSE 443
