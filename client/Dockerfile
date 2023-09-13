# ----- Build Stage -----
FROM node:18.17.1 AS build

# Set working dir in build stage container
WORKDIR /client-build

# Copys package files and install dependencies
COPY package*.json ./
RUN npm install

# Copys rest of code to build container
COPY . .

# ----- Production Stage -----
FROM node:18.17.1

# Set working directory in prod stage container
WORKDIR /client

# Copy only necessary files from the build stage
COPY --from=build /client-build/node_modules ./node_modules/
COPY --from=build /client-build/package*.json ./
COPY --from=build /client-build/ ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]