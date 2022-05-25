FROM couchdb:latest
WORKDIR /opt/couchdb/data
VOLUME [ "/opt/couchdb/data" ]
COPY  docker/couchdb/local.ini /opt/couchdb/etc/ 

EXPOSE 5984

RUN apt-get update -y


RUN apt-get install tcpdump -y

ENV COUCHDB_USER=admin

ENV COUCHDB_PASSWORD=Musazza7

