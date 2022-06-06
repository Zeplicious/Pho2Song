FROM nginx:latest

COPY docker/nginx/nginx_app.conf /etc/nginx/nginx.conf

RUN apt-get update -y
RUN apt-get install tcpdump -y


ARG SSL_CERT

ARG SSL_CERT_KEY

RUN mkdir /etc/nginx/ssl
RUN touch /etc/nginx/ssl/cert.pem
RUN touch /etc/nginx/ssl/cert-key.pem

RUN echo ${SSL_CERT} | base64 --decode > /etc/nginx/ssl/cert.pem
RUN echo ${SSL_CERT_KEY} | base64 --decode > /etc/nginx/ssl/cert-key.pem

EXPOSE 443