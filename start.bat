:: Start all services/components
.\startAppSvc.bat
.\startHelms.bat

echo Client URL:
minikube service client-service --url

echo Server URL:
minikube service server-service --url

echo: All Done!

pause