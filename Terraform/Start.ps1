# Step 1: Initialize only control-plane
Invoke-Expression "terraform apply -auto-approve"

# Step 2: Run PS script to fetch token and IP & update worker node YAML
Invoke-Expression "cd scripts"
Invoke-Expression ".\new.ps1"

# Apply changes & onitialize remaining resources (i.e., worker nodes)
Invoke-Expression "cd ../"
Invoke-Expression "terraform apply -auto-approve"

# Upload and start scripts
Invoke-Expression "cd scripts"
Invoke-Expression ".\uploadHelm.ps1"