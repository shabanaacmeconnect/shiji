FROM node:10-alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g nodemon
RUN npm install

ENTRYPOINT ["nodemon", "/usr/src/app/index.js"]