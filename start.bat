:: Start minikube
:: minikube start 

:: Start all services/components
.\startAppSvc.bat
.\startClient.bat
.\startWorker.bat
.\startServer.bat

echo Client URL:
minikube service client-service --url

echo Server URL:
minikube service server-service --url

pause