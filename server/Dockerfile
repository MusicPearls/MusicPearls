# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (ensure your app listens on this)
EXPOSE 8080

# Start the server
CMD [ "node", "index.js" ]
