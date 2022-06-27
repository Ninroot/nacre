FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install -g nacre

ENTRYPOINT [ "nacre" ]