FROM node:18
WORKDIR /app
RUN mkdir -p /app/test-results
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]