FROM node:latest
RUN mkdir /src
RUN npm install nodemon -g
WORKDIR /src
ADD Torneo/package.json /src/package.json
RUN npm install
ADD Torneo/nodemon.json /src/nodemon.json
EXPOSE 3000
CMD nodemon app.js
