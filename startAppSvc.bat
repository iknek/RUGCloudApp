@echo off
setlocal enabledelayedexpansion

:: Load Environment Variables from .env file
for /f "tokens=1,2 delims==" %%i in (.env) do (
    set %%i=%%j
)

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/my-app

:: MongoDB Setup
echo Installing MongoDB
helm dependency update ./
helm delete my-app-mongodb ./
helm install my-app-mongodb ./ -f secrets.yaml

:: RabbitMQ
echo Installing RabbitMQ
helm delete rabbit 
helm install rabbit --set auth.username=%RABBITMQ_DEFAULT_USER%,auth.password=%RABBITMQ_DEFAULT_PASS%,auth.erlangCookie=secretcookie bitnami/rabbitmq

:: Secrets and ConfigMap
cd ../my-app/configFiles
sops -d secrets.enc.yaml > secrets.yaml
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml

:: Ingress/Nginx Setup
echo Installing & Setup Ingress
cd ../charts/my-app
helm install ingress-nginx ingress-nginx/ingress-nginx
minikube addons enable ingress 
minikube tunnel

echo Done 

pause
