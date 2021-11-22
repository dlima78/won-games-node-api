FROM node:14.18.1
WORKDIR /usr/src/wongames-node-api
COPY ./package.json .
RUN npm install --only=prod