::@echo off

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/client/templates

:: Delete existing Kubernetes resources
kubectl delete -f client-ingress.yaml
kubectl delete -f client-service.yaml
kubectl delete -f client-deployment.yaml

:: Apply new configurations for Kubernetes resources
kubectl apply -f client-ingress.yaml
kubectl apply -f client-service.yaml
kubectl apply -f client-deployment.yaml

:: Print a message indicating successful execution
echo Kubernetes resources have been updated.

:: Pause to keep the command window open (optional)
pause