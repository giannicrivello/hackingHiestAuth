FROM node:13-slim
ENV NODE_ENV=production

WORKDIR /app

ADD . /app

RUN npm install --production

CMD node authserver.js
