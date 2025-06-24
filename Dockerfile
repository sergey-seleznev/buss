FROM node:alpine AS frontend
WORKDIR /app
COPY .env ./
COPY src/frontend ./
RUN npm install
RUN npm run build

FROM node:alpine
WORKDIR /app
RUN apk --no-cache add curl
COPY src/package.json ./
COPY src/package-lock.json ./
RUN npm i
COPY src/index.js ./
COPY --from=frontend /app/dist ./public
CMD ["node", "index.js"]
