$SSHKeyPath = "id_rsa"
$SSHUser = "core"
$SSHHost = "195.169.23.74"
$DestinationPath = "/home/core"

# Copy .env file
scp -i $SSHKeyPath cinder-pvc.yaml "${SSHUser}@${SSHHost}:${DestinationPath}/cinder-pvc.yaml"
scp -i $SSHKeyPath cinder-pv.yaml "${SSHUser}@${SSHHost}:${DestinationPath}/cinder-pv.yaml"
ssh -i $SSHKeyPath "$SSHUser@$SSHHost" "sudo kubectl apply -f cinder-pv.yaml"
ssh -i $SSHKeyPath "$SSHUser@$SSHHost" "sudo kubectl apply -f cinder-pvc.yaml"

