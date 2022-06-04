FROM couchdb:latest
VOLUME ["/opt/couchdb/data"]
COPY "docker/couchdb/local.ini" "/opt/couchdb/etc/"
WORKDIR /opt/couchdb

ENV COUCHDB_USER=*******
ENV COUCHDB_PASSWORD=*******

EXPOSE 5984


ENV COUCHDB_CREATE_DATABASES=yes

