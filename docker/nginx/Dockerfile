FROM nginx:latest

COPY docker/nginx/nginx_app.conf etc/nginx/nginx.conf

RUN apt-get update -y
RUN apt-get install apt-utils -y
RUN apt-get install tcpdump -y

ARG SSL_CERT

ARG SSL_CERT_KEY

RUN cd etc/nginx
RUN mkdir ssl
RUN cd ssl

RUN echo ${SSL_CERT} | base64 --decode >> /cert.pem
RUN echo ${SSL_CERT_KEY} | base64 --decode >> /cert-key.pem

RUN cd ../../..

EXPOSE 443