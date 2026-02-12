# Estágio de Build
FROM node:20-alpine as builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./
RUN npm install

# Copia código fonte
COPY . .

# Build do React
RUN npm run build

# Estágio de Produção (Node.js Server)
FROM node:20-alpine

WORKDIR /app

# Copia dependências e arquivo do servidor
COPY package*.json ./
RUN npm install --production

# Copia o servidor e o build do React
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Cria diretório de dados para volume persistente
RUN mkdir -p /app/data

ENV PORT=80
EXPOSE 80

CMD ["node", "server.js"]