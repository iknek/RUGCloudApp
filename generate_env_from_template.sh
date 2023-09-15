#!/bin/bash

# Use the CI/CD variables, if they are not set, default to what's currently in the .env.template
DATABASE_USER=${CI_DATABASE_USER:-$(grep 'DATABASE_USER' .env.template | cut -d'=' -f2)}
DATABASE_PASSWORD=${CI_DATABASE_PASSWORD:-$(grep 'DATABASE_PASSWORD' .env.template | cut -d'=' -f2)}
DATABASE_CLUSTER=${CI_DATABASE_CLUSTER:-$(grep 'DATABASE_CLUSTER' .env.template | cut -d'=' -f2)}
DATABASE_NAME=${CI_DATABASE_NAME:-$(grep 'DATABASE_NAME' .env.template | cut -d'=' -f2)}
CLIENT_PORT=${CI_CLIENT_PORT:-$(grep 'CLIENT_PORT' .env.template | cut -d'=' -f2)}
SERVER_PORT=${CI_SERVER_PORT:-$(grep 'SERVER_PORT' .env.template | cut -d'=' -f2)}

# Now write these values into a new .env file
cat <<EOL > .env
DATABASE_USER=$DATABASE_USER
DATABASE_PASSWORD=$DATABASE_PASSWORD
DATABASE_CLUSTER=$DATABASE_CLUSTER
DATABASE_NAME=$DATABASE_NAME
CLIENT_PORT=$CLIENT_PORT
SERVER_PORT=$SERVER_PORT
EOL

# Print out the .env file (optional, for debugging purposes)
cat .env
