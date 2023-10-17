# cloud-app

To use this app, install Docker, Minikube, & Terraform on your system, and then clone the directory. Either build the Docker images yourself and first:
- In the root project folder, set your desired variables in the .env, following the .env.template file.
- Set secrets.yaml files as neccessary in the /charts dir. 
Or download them by doing:
`
docker pull iknek/serverone 
docker pull iknek/clientone
docker pull iknek/workerone
` 
- Then run start.bat!

# Terraform
- Run `init.sh` in /terraform to initialise your local copy of the repository.
- Update the secrets.auto.tfvars.json file to include your credentials.
- Run `terraform init`
- Run `terraform plan`
- Run `terraform apply`