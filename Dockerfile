FROM node:16

WORKDIR /usr/src/app

RUN apt install -y curl fontconfig libfontconfig

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV OPENSSL_CONF=/dev/null
ENV PORT=80
EXPOSE $PORT

CMD [ "npm", "start" ]