FROM node:8.9.4
EXPOSE 8080
COPY package*.json ./
COPY main.js ./
COPY setup-db.js ./
COPY transaction.json ./
RUN npm install
CMD npm run setup-db & npm start