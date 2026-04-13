FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

ARG VITE_API_URL

CMD ["npm", "run", "dev", "--", "--host"]