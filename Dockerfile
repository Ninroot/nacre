FROM node:18-bullseye

WORKDIR /app

RUN npm install -g nacre

ENTRYPOINT [ "nacre" ]