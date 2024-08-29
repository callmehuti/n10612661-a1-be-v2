# Use Node.js 20.11.1 base image
FROM node:20.11.1-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN apk update && apk add ffmpeg


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on, here, I was using port 3333
EXPOSE 3000 5500

# Command to run the app
CMD [  "npm", "run", "start" ]