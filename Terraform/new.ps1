# Define SSH credentials and target
$SSHKeyPath = "id_rsa"
$SSHUser = "core"
$SSHHost = "195.169.23.74"

# Execute SSH command to fetch K3S Token
$K3S_TOKEN = ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo cat /var/lib/rancher/k3s/server/node-token"

# Execute SSH command to fetch Internal IP
$K3S_IP = ssh -i $SSHKeyPath $SSHUser@$SSHHost "ip a show eth0 | grep 'inet ' | awk '{print `$2}' | cut -d/ -f1"

# Debug print
Write-Host "Token: $K3S_TOKEN"
Write-Host "K3S_IP: $K3S_IP"

# Read the YAML file into a variable
$FileContent = Get-Content -Path "./flatcar_workerOne.yaml" -Raw

# Debug print
Write-Host "Original File Content: $FileContent"

# Find the original token in the file for debugging
$originalToken = [regex]::match($FileContent, 'K3S_TOKEN=(.*::)').Groups[1].Value
Write-Host "Original Token in File: $originalToken"

# Replace K3S_TOKEN and K3S_IP in YAML
$updatedContent = $FileContent -replace "K3S_TOKEN=$originalToken", "K3S_TOKEN=$K3S_TOKEN"
$updatedContent = $updatedContent -replace 'K3S_URL=https://.*:', "K3S_URL=https://${K3S_IP}:"

# Debug print
Write-Host "Updated File Content: $updatedContent"

# Write the updated content back to the file
Set-Content -Path "./flatcar_workerOne.yaml" -Value $updatedContent
