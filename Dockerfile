FROM node:14

WORKDIR /usr/src/app

RUN apt install -y curl fontconfig libfontconfig

ENV ACCEPT_HIGHCHARTS_LICENSE=YES

COPY package*.json ./
RUN npm ci --only=production
RUN node node_modules/highcharts-export-server/build.js
RUN node node_modules/highcharts-export-server/build.js
RUN node node_modules/highcharts-export-server/build.js
RUN node node_modules/highcharts-export-server/build.js
RUN node node_modules/highcharts-export-server/build.js
# DEBUG: cat /usr/src/app/node_modules/highcharts-export-server/phantom/export.html
# RUN node node_modules/highcharts-export-server/bin/cli.js --enableServer 1

COPY . .

ENV OPENSSL_CONF=/dev/null
ENV PORT=80
EXPOSE $PORT

CMD [ "npm", "start" ]