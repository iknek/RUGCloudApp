#!/bin/bash

# Deploy MongoDB
helm install mongodb stable/mongodb --set mongodbRootPassword=secret,mongodbUsername=admin

# Deploy RabbitMQ
helm install rabbitmq stable/rabbitmq --set rabbitmq.username=myuser,rabbitmq.password=mypassword

# Deploy custom charts
helm install client ./charts/client
helm install server ./charts/server
helm install worker ./charts/worker
