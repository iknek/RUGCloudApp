# Use an official Node.js runtime as the base image
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run your application
CMD ["npm", "start"]
