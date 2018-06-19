FROM node:8.9.4
EXPOSE 8080
COPY *.js ./
COPY *.json ./
RUN npm install
CMD npm run setup-db & npm start