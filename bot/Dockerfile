# build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY tsconfig.json .
COPY src ./src
RUN npm run build

# deploy stage
FROM node:20-alpine AS deploy
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --production
COPY --from=build /usr/app/src/dist ./dist
CMD ["node", "start"]
