# instala dep e build para estatico
FROM node:22-alpine AS builder
WORKDIR /app
 
# Ferramentas nativas exigidas por alguns pacotes Expo
RUN apk add --no-cache python3 make g++
 
COPY package*.json ./
RUN npm ci
 
COPY . .
 
ARG EXPO_PUBLIC_API_URL_WEB
ARG EXPO_PUBLIC_API_URL_ANDROID
ENV EXPO_PUBLIC_API_URL_WEB=$EXPO_PUBLIC_API_URL_WEB
ENV EXPO_PUBLIC_API_URL_ANDROID=$EXPO_PUBLIC_API_URL_ANDROID
 
# exporta o build estático para a pasta dist
RUN npx expo export --platform web
 
# usa o nginx para serviro os arquivos estaticos
FROM nginx:alpine AS runner
 
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
 
