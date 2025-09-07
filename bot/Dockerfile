# build stage
FROM node:16-alpine AS build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm i --only=development
COPY . .
RUN npm run build

# deploy stage
FROM node:16-alpine AS deploy
WORKDIR /usr/src/app
COPY package*.json .
RUN npm i --production
COPY --from=build /usr/app/src/dist ./dist
CMD ["npm", "start"]