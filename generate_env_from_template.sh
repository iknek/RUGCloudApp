#!/bin/bash

# Use the CI/CD variables
DATABASE_USER=${CI_MONGO_INITDB_ROOT_USERNAME}
DATABASE_PASSWORD=${CI_MONGO_INITDB_ROOT_PASSWORD}
CLIENT_PORT=${CI_CLIENT_PORT}
MONGO_PORT=${CI_MONGO_PORT}
SERVER_PORT=${CI_SERVER_PORT}
WORKER_PORT=${CI_WORKER_PORT}

# Now writes these values into new .env file
cat <<EOL > .env

MONGO_INITDB_ROOT_USERNAME = $DATABASE_USER
MONGO_INITDB_ROOT_PASSWORD = $DATABASE_PASSWORD
CLIENT_PORT=$CLIENT_PORT
MONGO_PORT =$MONGO_PORT
SERVER_PORT=$SERVER_PORT
WORKER_PORT=$WORKER_PORT

EOL

# Print out the .env file
cat .env
