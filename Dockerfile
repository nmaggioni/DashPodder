# Build frontend
FROM node:9-alpine AS build

WORKDIR /client
COPY client ./
COPY .eslintrc ./
RUN yarn
RUN yarn run build

# Bundle with backend
FROM node:9-alpine
VOLUME /opt/build
ENV NODE_ENV=production

WORKDIR /dashpodder
COPY --from=build /client/dist ./client/dist
COPY server ./server
WORKDIR /dashpodder/server
RUN yarn --production

# Export bundle
WORKDIR /
CMD ["tar", "-czf", "./opt/build/dashpodder.tar.gz", "./dashpodder/client", "./dashpodder/server"]

### docker run -v /tmp/dashpodder-build:/opt/build dashpodder
