FROM node:14-buster

WORKDIR /usr/src/web-desktop-environment

COPY . .

RUN npm install -g npm@latest

RUN npm install --unsafe-perm

EXPOSE 5000
EXPOSE 3000
EXPOSE 9200-9400

CMD ["npm", "run", "dev:dev"]