FROM nginx:latest

WORKDIR /etc/nginx

RUN mkdir ssl

COPY docker/nginx/nginx_app.conf /nginx.conf

RUN apt-get update -y
RUN apt-get install tcpdump -y

ARG SSL_CERT

ARG SSL_CERT_KEY

RUN echo ${SSL_CERT} >> /ssl/cert.pem
RUN echo ${SSL_CERT_KEY} >> /ssl/cert-key.pem

EXPOSE 443