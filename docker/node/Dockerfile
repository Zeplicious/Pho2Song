FROM node:latest

WORKDIR /app

#../../app
COPY package*.json ./

RUN npm install

RUN apt-get update -y

RUN apt-get install tcpdump -y

#../../app
COPY ./ ./

ENV PORT=8888
ENV COUCHDB_HOST="couchdb"
EXPOSE 8888

CMD ["npm", "start"]