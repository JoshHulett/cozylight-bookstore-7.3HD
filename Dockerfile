FROM node:18
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
        sqlite3=3.40.1-2+deb12u2 \
        libsqlite3-dev=3.40.1-2+deb12u2 \
        libxml2=2.9.14+dfsg-1.3~deb12u3 \
        libxml2-dev=2.9.14+dfsg-1.3~deb12u3 && \
        imagemagick=8:6.9.11.60+dfsg-1.6+deb12u4 \
        libmagickcore-dev=8:6.9.11.60+dfsg-1.6+deb12u4 \
        libmagickwand-dev=8:6.9.11.60+dfsg-1.6+deb12u4 && \
    rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/test-results
RUN mkdir -p /app/coverage
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]