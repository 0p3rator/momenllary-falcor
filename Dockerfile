FROM node:8.11.2-alpine

WORKDIR /app

ADD . /app

RUN npm install --global yarn \
&&  yarn install

EXPOSE 3300

ENV NAME World

CMD ["npm", "start"]
