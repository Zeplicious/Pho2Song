FROM node:latest

WORKDIR /app

#../../api
COPY /api/package*.json ./

RUN npm install

RUN apt-get update -y

RUN apt-get install tcpdump -y

#../../api
COPY /api ./

COPY /app/utils/spotifyUtils.js ./utils/
COPY /app/utils/getColors.js ./utils/

ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_USER
ENV DB_USER=${DB_USER}

ARG IMAGGA_CLIENT_ID
ENV IMAGGA_CLIENT_ID=${IMAGGA_CLIENT_ID}

ARG IMAGGA_CLIENT_SECRET
ENV IMAGGA_CLIENT_SECRET=${IMAGGA_CLIENT_SECRET}

ARG SPOTIFY_CLIENT_ID
ENV SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}

ARG SPOTIFY_CLIENT_SECRET
ENV SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}

ENV PORT=8888
ENV COUCHDB_HOST="couchdb"
ENV UTILS_PATH="./utils"

EXPOSE 8888

CMD ["npm", "start"]