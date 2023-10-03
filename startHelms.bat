cd charts

:: Compile & install client chart
cd client
helm package ./
helm install client client-0.1.0.tgz

cd ../server
:: Compile & install server chart
helm package ./
helm install server server-0.1.0.tgz

cd ../worker
:: Compile & install worker chart
helm package ./
helm install worker worker-0.1.0.tgz