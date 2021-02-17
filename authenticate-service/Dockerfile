FROM node:14-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "start" ]