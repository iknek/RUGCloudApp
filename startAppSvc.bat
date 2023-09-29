@echo off

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/my-app

echo Installing MongoDB
helm dependency update ./
helm delete my-app ./
helm install my-app ./

echo Installing RabbitMQ
helm delete rabbit
helm install rabbit --set auth.username=user,auth.password=dmp2qDZ127TBdJON,auth.erlangCookie=secretcookie bitnami/rabbitmq

echo Installing Ingress
minikube addons enable ingress 


echo Done 

pause