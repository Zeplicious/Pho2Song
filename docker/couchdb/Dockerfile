FROM couchdb:latest
WORKDIR /opt/couchdb/data
VOLUME ["/opt/couchdb/data:rw"]

EXPOSE 5984

RUN apt-get update -y
RUN apt-get install tcpdump -y
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG DB_USER
ENV DB_USER=${DB_USER}
ENV COUCHDB_CREATE_DATABASES=yes

