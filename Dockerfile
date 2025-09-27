FROM node:18
WORKDIR /app
RUN mkdir -p /app/test-results
RUN mkdir -p /app/coverage
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]