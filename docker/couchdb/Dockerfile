FROM couchdb:latest
WORKDIR /opt/couchdb/data
VOLUME ["/opt/couchdb/data:rw"]

EXPOSE 5984

RUN apt-get update -y
RUN apt-get install tcpdump -y

ENV COUCHDB_CREATE_DATABASES=yes

