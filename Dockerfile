FROM node

COPY config/ config/
COPY src/ src/
COPY package.json .
RUN npm i

CMD [ "node", "src/app.js"]