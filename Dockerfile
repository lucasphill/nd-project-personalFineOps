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

# Configura o nginx e HTTPS
RUN apt update
RUN apt install nginx -y
RUN apt install certbot python3-certbot-nginx -y
COPY financebot /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/financebot /etc/nginx/sites-enabled/
RUN nginx -t && service nginx reload
# RUN certbot --nginx --non-interactive --agree-tos --email seu-email@exemplo.com -d bot.loadlens.com.br


# Expõe a porta que a aplicação vai usar (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
