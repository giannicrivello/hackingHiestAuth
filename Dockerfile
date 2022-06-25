FROM node:13-slim

WORKDIR /app

ADD . /app

RUN npm install 

CMD node authserver.js
