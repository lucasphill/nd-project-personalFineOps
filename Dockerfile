# Usa a imagem oficial do Node.js como base
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências para instalar primeiro (melhora cache)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que a aplicação vai usar (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
