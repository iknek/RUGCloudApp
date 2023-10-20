# Define SSH credentials and target
$SSHKeyPath = "../id_rsa"
$SSHUser = "core"
$SSHHost = "195.169.23.74"

cd C:\Users\Data\.ssh
rm known_hosts
cd C:\Users\Data\Desktop\byoa-message2\byoa4\Terraform\scripts

# Execute SSH command to fetch K3S Token
$K3S_TOKEN = ssh -i $SSHKeyPath $SSHUser@$SSHHost "sudo cat /var/lib/rancher/k3s/server/node-token"

# Execute SSH command to fetch Internal IP
$K3S_IP = ssh -i $SSHKeyPath $SSHUser@$SSHHost "ip a show eth0 | grep 'inet ' | awk '{print `$2}' | cut -d/ -f1"

# Debug print
Write-Host "Token: $K3S_TOKEN"
Write-Host "K3S_IP: $K3S_IP"

# Initialize an empty array to hold the updated lines
$updatedYamlLines = @()

# Read the YAML file line by line
Get-Content -Path "../flatcar_workerOne.yaml" | ForEach-Object {
    $line = $_

    if ($line -match 'Environment="K3S_TOKEN=') {
        $line = "        Environment=`"K3S_TOKEN=$K3S_TOKEN`""
    }

    if ($line -match 'Environment="K3S_URL=') {
        $line = "        Environment=`"K3S_URL=https://${K3S_IP}:6443`""
        
    }

    $updatedYamlLines += $line
}

# Join the updated lines back into a single string with newlines
$updatedYamlContent = $updatedYamlLines -join [Environment]::NewLine

# Write the updated content back to the original file
Set-Content -Path "../flatcar_workerOne.yaml" -Value $updatedYamlContent
