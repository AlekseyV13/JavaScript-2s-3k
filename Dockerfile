FROM node:20-alpine

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts 2>/dev/null || true

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]