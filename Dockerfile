FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV PORT=80
EXPOSE $PORT

CMD [ "npm", "start" ]