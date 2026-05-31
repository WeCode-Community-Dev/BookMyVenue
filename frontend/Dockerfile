# Use Node 20 alpine as the base image for rapid, lightweight building
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency configuration files
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]
