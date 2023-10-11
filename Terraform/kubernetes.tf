provider "kubernetes" {
  host     = "your_k8s_api_server_url"
  token    = "your_access_token"
  cluster_ca_certificate = "your_ca_cert"
}

resource "kubernetes_deployment" "example" {
  # your deployment specification here
}