FROM nginx:latest

WORKDIR /etc/nginx

COPY docker/nginx/nginx_app.conf /nginx.conf

RUN apt-get update -y
RUN apt-get install tcpdump -y

ARG SSL_CERT
ENV SSL_CERT=${SSL_CERT}


ARG SSL_CERT_KEY
ENV SSL_CERT_KEY=${SSL_CERT_KEY}

RUN mkdir ssl
RUN cd ssl

RUN echo SSL_CERT >> /cert.pem
RUN echo SSL_CERT_KEY >> /cert-key.pem

EXPOSE 443