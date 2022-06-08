#FROM node:10-alpine
FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY . /app

RUN npm install --legacy-peer-deps

CMD ["npm", "start"]