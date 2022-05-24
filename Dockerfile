FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update -y

RUN apt-get install tcpdump -y

COPY . .

ENV PORT=8888

EXPOSE 8888

CMD ["npm", "start"]