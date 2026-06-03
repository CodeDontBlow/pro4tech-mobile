# build simples para testar o deploy do mobile sem multi-stage
FROM node:22-alpine

WORKDIR /app

# Ferramentas nativas exigidas por alguns pacotes Expo
RUN apk add --no-cache python3 make g++

COPY . .
RUN npm install
RUN npm install -g serve

ARG EXPO_PUBLIC_API_URL_WEB
ARG EXPO_PUBLIC_API_URL_ANDROID
ENV EXPO_PUBLIC_API_URL_WEB=$EXPO_PUBLIC_API_URL_WEB
ENV EXPO_PUBLIC_API_URL_ANDROID=$EXPO_PUBLIC_API_URL_ANDROID

RUN npx expo export --platform web

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
 
