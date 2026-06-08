FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Run the development server and bind to all network interfaces so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
