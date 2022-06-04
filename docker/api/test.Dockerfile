FROM node:latest

WORKDIR /app

#../../api
COPY /api/package*.json ./

RUN npm install

#../../api
COPY /api ./

COPY /app/utils/spotifyUtils.js ./utils/
COPY /app/utils/getColors.js ./utils/

ENV PORT=8888
ENV COUCHDB_HOST="couchdb"
ENV UTILS_PATH="./utils"

EXPOSE 8888

CMD ["npm", "start"]