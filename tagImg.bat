docker tag byoa4-worker iknek/workerone
docker push iknek/workerone

docker tag byoa4-server iknek/serverone
docker push iknek/serverone

docker tag byoa4-client iknek/clientone
docker push iknek/clientone

echo Tagged and pushed

pause
