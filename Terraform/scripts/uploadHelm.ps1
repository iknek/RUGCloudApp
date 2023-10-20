# Define SSH key and destination details
$SSHKeyPath = "../id_rsa"
$SSHUser = "core"
$SSHHost = "195.169.23.74"
$DestinationPath = "/home/core"

cd C:\Users\Data\.ssh
rm known_hosts
cd C:\Users\Data\Desktop\byoa-message2\byoa4\Terraform\scripts

# Copy .env file
scp -i $SSHKeyPath ..\..\.env "${SSHUser}@${SSHHost}:${DestinationPath}/.env"
scp -i $SSHKeyPath script.sh "${SSHUser}@${SSHHost}:${DestinationPath}/script.sh"
ssh -i $SSHKeyPath "$SSHUser@$SSHHost" ". ./script.sh"

# Copy Kubernetes configs
scp -i $SSHKeyPath ..\..\charts\configFiles\configmap.yaml "${SSHUser}@${SSHHost}:${DestinationPath}/configmap.yaml"
scp -i $SSHKeyPath ..\..\charts\configFiles\secrets.yaml "${SSHUser}@${SSHHost}:${DestinationPath}/secrets.yaml"

# Copy Zip Helm
scp -i $SSHKeyPath ..\..\charts\client\client-0.1.0.tgz "${SSHUser}@${SSHHost}:${DestinationPath}/client-0.1.0.tgz"
scp -i $SSHKeyPath ..\..\charts\worker\worker-0.1.0.tgz  "${SSHUser}@${SSHHost}:${DestinationPath}/worker-0.1.0.tgz"
scp -i $SSHKeyPath ..\..\charts\server\server-0.1.0.tgz  "${SSHUser}@${SSHHost}:${DestinationPath}/server-0.1.0.tgz"

# Add helm repos needed
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm repo add bitnami https://charts.bitnami.com/bitnami --kubeconfig=/etc/rancher/k3s/k3s.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx --kubeconfig=/etc/rancher/k3s/k3s.yaml"

# Update & start helm repos
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm repo update"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install my-mongodb bitnami/mongodb --set auth.rootPassword=$MONGO_PASS --kubeconfig=/etc/rancher/k3s/k3s.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install rabbit --set auth.username=$RABBITMQ_DEFAULT_USER,auth.password=$RABBITMQ_DEFAULT_PASS,auth.erlangCookie=secretcookie bitnami/rabbitmq --kubeconfig=/etc/rancher/k3s/k3s.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install ingress-nginx ingress-nginx/ingress-nginx --kubeconfig=/etc/rancher/k3s/k3s.yaml && sudo helm install client client-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml && sudo helm install server server-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml && sudo helm install worker worker-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml"

# Update & start helm for app
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo kubectl apply -f secrets.yaml && sudo kubectl apply -f configmap.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install client client-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install server server-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml"
ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo helm install worker worker-0.1.0.tgz --kubeconfig=/etc/rancher/k3s/k3s.yaml"