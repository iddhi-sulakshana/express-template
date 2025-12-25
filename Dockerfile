# Use the official Bun image
FROM oven/bun:1.0-alpine

# Set working directory
WORKDIR /app

# Install system dependencies if required by any of the node packages
# RUN apk add --no-cache \
#     python3 \
#     make \
#     g++ \
#     && rm -rf /var/cache/apk/*

# Copy package files
COPY package.json bun.lock ./

# Install Bun globally (if not already available)
RUN bun --version

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Start the application with hot reload
CMD ["bun", "run", "--watch", "src/index.ts"]