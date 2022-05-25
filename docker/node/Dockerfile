FROM node:latest

WORKDIR /app

COPY ../../app/package*.json ./

RUN npm install

RUN apt-get update -y

RUN apt-get install tcpdump -y

COPY ../../app .

ENV PORT=8888

EXPOSE 8888

CMD ["npm", "start"]