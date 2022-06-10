FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

COPY . /app

RUN npm install --legacy-peer-deps && npm uninstall bcrypt && npm install bcrypt

CMD npm start
