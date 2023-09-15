# ----- Build Stage -----
FROM node:18.17.1 AS build

# Sets working directory in build stage container
WORKDIR /server-build

# Copys package files and install dependencies
COPY package*.json ./
RUN npm install

# Copys rest of code to build container
COPY . .

# ----- Production Stage -----
FROM node:18.17.1

# Set the working directory in the production stage container
WORKDIR /server

# Copy necessary files from the build stage
COPY --from=build /server-build/node_modules ./node_modules/
COPY --from=build /server-build/package*.json ./
COPY --from=build /server-build/ ./

# Expose the port app runs on
EXPOSE 3001

# Runs application
CMD ["npm", "start"]
