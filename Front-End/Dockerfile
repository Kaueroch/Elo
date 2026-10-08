# Estágio 1: Build da aplicação Node
FROM node:20-alpine AS build
WORKDIR /app

# Base URL da API usada no build (em producao o nginx faz o proxy de /api).
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Realiza o build do projeto com Vite (gera os arquivos na pasta /app/dist)
RUN npm run build

# Estágio 2: Servidor Web (Nginx) para disponibilizar o site
FROM nginx:alpine

# Limpa o diretório padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos gerados no estágio de build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configura o Nginx para lidar com rotas de Single Page Application (SPA)
# e para fazer o proxy de /api ate o back-end Spring Boot do Elo.
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location /api/ { \
        resolver 127.0.0.11 valid=10s ipv6=off; \
        set $backend_upstream http://backend:8080; \
        proxy_pass $backend_upstream; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
