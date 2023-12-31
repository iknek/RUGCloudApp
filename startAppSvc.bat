@echo off
setlocal enabledelayedexpansion

:: Load Environment Variables from .env file
for /f "tokens=1,2 delims==" %%i in (.env) do (
    set %%i=%%j
)

:: MongoDB Setup
helm install my-mongodb bitnami/mongodb --set auth.rootPassword=%MONGO_PASS%
:: RabbitMQ
echo Installing RabbitMQ
helm delete rabbit 
helm install rabbit --set auth.username=%RABBITMQ_DEFAULT_USER%,auth.password=%RABBITMQ_DEFAULT_PASS%,auth.erlangCookie=secretcookie bitnami/rabbitmq

:: Secrets and ConfigMap
cd charts/configFiles
sops -d secrets.enc.yaml > secrets.yaml
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml

:: Ingress/Nginx Setup
echo Installing & Setup Ingress
helm install ingress-nginx ingress-nginx/ingress-nginx
minikube addons enable ingress 

echo Done 

pause
