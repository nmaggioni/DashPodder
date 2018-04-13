# Build frontend
FROM node:9-alpine AS build

WORKDIR /client
COPY client ./
COPY .eslintrc ./
RUN yarn
RUN yarn run build

# Bundle with backend
FROM node:9-alpine
ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /client/dist ./client/dist
COPY server ./server
WORKDIR /app/server
RUN yarn --production

EXPOSE 3333
CMD ["yarn", "run", "start"]
