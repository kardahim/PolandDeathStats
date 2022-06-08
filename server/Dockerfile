FROM node:17-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

COPY . /app

#RUN npm cache clean --force && rm -rf node_modules && npm install --legacy-peer-deps

RUN npm install && npm uninstall bcrypt && npm install bcrypt

#RUN npm install --legacy-peer-deps

CMD ["npm", "start"]
