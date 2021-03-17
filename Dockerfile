FROM alpine

RUN apk update && apk upgrade && apk add git nodejs npm

COPY config/ config/
COPY src/ src/
COPY package.json .
RUN npm i

CMD [ "node", "src/app.js"]