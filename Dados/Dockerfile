FROM node:latest
RUN mkdir /src
RUN npm install nodemon -g
WORKDIR /src
ADD ms_dado/package.json /src/package.json
RUN npm install
ADD ms_dado/nodemon.json /src/nodemon.json
EXPOSE 3000
CMD nodemon app.js