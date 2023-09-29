@echo off

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/my-app

helm dependency update ./
helm delete my-app ./
helm install my-app ./

helm delete rabbit
helm install rabbit --set auth.username=admin,auth.password=secretpassword,auth.erlangCookie=secretcookie bitnami/rabbitmq

echo Done 

pause