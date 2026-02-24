FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

RUN chmod +x start.sh

EXPOSE 4000

CMD ["sh", "start.sh"]
