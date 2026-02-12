# Estágio de Build
FROM node:20-alpine as builder

WORKDIR /app

# Copia arquivos de dependência primeiro para aproveitar cache do Docker
COPY package*.json ./

# Instala dependências (npm ci é mais rápido e seguro para builds)
RUN npm ci

# Copia o restante do código fonte
COPY . .

# Executa o build do Vite
RUN npm run build

# Estágio de Produção (Nginx)
FROM nginx:alpine

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos gerados no estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração básica de cache para arquivos estáticos (opcional, mas recomendado)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]