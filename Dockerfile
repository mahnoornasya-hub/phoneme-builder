FROM node:22-bookworm-slim

WORKDIR /app

# System packages required by Prisma and better-sqlite3
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       openssl \
       ca-certificates \
       python3 \
       make \
       g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./

RUN npm ci

# Copy application files
COPY . .

# SQLite database location inside the container
ENV DATABASE_URL="file:/app/data/dev.db"

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Create directory for SQLite database
RUN mkdir -p /app/data

ENV NODE_ENV="production"

EXPOSE 3000

# Run database migrations, then start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]