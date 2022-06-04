FROM node:latest

WORKDIR /app

#../../app
COPY /app/package*.json ./

RUN npm install

#../../app
COPY /app ./

ENV PORT=8888
ENV COUCHDB_HOST="couchdb"

EXPOSE 8888

CMD ["npm", "start"]