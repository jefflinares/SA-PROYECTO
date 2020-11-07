FROM node:alpine
WORKDIR /src
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3389
CMD ["npm", "start"]
