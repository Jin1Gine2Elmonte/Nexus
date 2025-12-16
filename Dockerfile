FROM node:20-alpine

WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json* ./

RUN npm install --omit=dev

# Copy the rest of the source
COPY . .

# Fly will inject PORT, but default to 8080
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/nexus_server.js"]
