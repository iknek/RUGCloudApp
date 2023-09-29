@echo off

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/server/templates

:: Delete existing Kubernetes resources
kubectl delete -f server-service.yaml
kubectl delete -f server-deployment.yaml

:: Apply new configurations for Kubernetes resources
kubectl apply -f server-service.yaml
kubectl apply -f server-deployment.yaml

:: Print a message indicating successful execution
echo Kubernetes server updated.

:: Pause to keep the command window open (optional)
pause