# Use official Node.js LTS
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the port Fly will use
EXPOSE 3333

# Start Nexus
CMD ["node", "nexus_server.js"]
