FROM node:18
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
        sqlite3 libsqlite3-dev \
        libxml2 libxml2-dev \
        imagemagick libmagickcore-dev libmagickwand-dev && \
    rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/test-results
RUN mkdir -p /app/coverage
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]