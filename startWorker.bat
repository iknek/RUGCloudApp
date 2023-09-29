@echo off

:: Navigate to the directory containing the Kubernetes YAML files
cd charts/worker/templates

:: Delete existing Kubernetes resources
kubectl delete -f worker-service.yaml
kubectl delete -f worker-deployment.yaml

:: Apply new configurations for Kubernetes resources
kubectl apply -f worker-service.yaml
kubectl apply -f worker-deployment.yaml

:: Print a message indicating successful execution
echo Kubernetes worker updated.

:: Pause to keep the command window open (optional)
pause