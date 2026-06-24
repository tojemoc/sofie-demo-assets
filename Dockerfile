# syntax=docker/dockerfile:experimental
# BUILD IMAGE
FROM node:22-alpine as build
WORKDIR /assets
COPY . .
RUN --mount=type=cache,target=/assets/node_modules yarn && yarn build

# DEPLOY IMAGE
FROM alpine
RUN apk add --no-cache rsync
COPY --from=build /assets/deploy/template-path /caspar/sofie-demo-template
COPY --from=build /assets/deploy/media-path /caspar/sofie-demo-media
COPY docker-entrypoint.sh /
WORKDIR /caspar

ENTRYPOINT ["/docker-entrypoint.sh"]
