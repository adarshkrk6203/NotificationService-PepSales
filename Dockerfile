FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json .env ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]
