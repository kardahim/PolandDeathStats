FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && apt-get install -y nodejs npm;
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps

CMD npm run dev