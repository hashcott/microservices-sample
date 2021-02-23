FROM node:14-alpine

ENV NODE_ENV=production
ENV PORT=3001
ENV CONSUL_HOST=192.168.31.127
ENV CONSUL_PORT=8500
WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "start" ]