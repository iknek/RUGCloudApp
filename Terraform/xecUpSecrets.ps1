# Step 1: Initialize only control-plane
Invoke-Expression "terraform apply -auto-approve -target=openstack_compute_instance_v2.flatcar"

# Step 2: Run PS script to fetch token and IP, and update worker node YAML
Invoke-Expression ".\new.ps1"

# Step 3: Initialize remaining resources (i.e., worker nodes)
Invoke-Expression "terraform apply -auto-approve"