FROM node:14
WORKDIR /usr/src/wongames-node-api
COPY ./package.json .
RUN npm install --only=prod