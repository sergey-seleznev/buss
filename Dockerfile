FROM node:alpine
WORKDIR /app

RUN apk --no-cache add curl

COPY package.json ./
COPY package-lock.json ./
RUN npm i

CMD ["node", "index.js"]
