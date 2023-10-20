# The actual Virtual Machine instance running Flatcar
resource "openstack_compute_instance_v2" "flatcar" {
    name = "Flatcar VM"
    image_id = openstack_images_image_v2.flatcar.id
    flavor_name = var.flavor_name
    security_groups = ["default", openstack_networking_secgroup_v2.basic.name]
    
    user_data = data.ct_config.flatcar.rendered

    network {
        uuid = openstack_networking_network_v2.internal.id
    }
}

resource "openstack_compute_instance_v2" "worker" {
  name = "Worker VM"
  image_id = openstack_images_image_v2.flatcar.id
  flavor_name = var.flavor_name
  security_groups = ["default", openstack_networking_secgroup_v2.basic.name]
  depends_on = [openstack_compute_instance_v2.flatcar]

  user_data = data.ct_config.worker.rendered

  network {
    uuid = openstack_networking_network_v2.internal.id
  }
}

resource "openstack_compute_instance_v2" "workerTwo" {
  name = "Worker Two VM"
  image_id = openstack_images_image_v2.flatcar.id
  flavor_name = var.flavor_name
  security_groups = ["default", openstack_networking_secgroup_v2.basic.name]
  depends_on = [openstack_compute_instance_v2.flatcar]

  user_data = data.ct_config.worker.rendered

  network {
    uuid = openstack_networking_network_v2.internal.id
  }
}

# Null_resource to copy kubeconfig from master node
resource "null_resource" "copy_kubeconfig" {
  depends_on = [openstack_compute_instance_v2.flatcar]

  provisioner "remote-exec" {
    inline = [
      "scp /etc/rancher/k3s/k3s.yaml C:/Users/Data/Desktop/byoa-message2/byoa4/Terraform/k3s.yaml"
    ]
    connection {
      type        = "ssh"
      user        = "core"
      private_key = file("${path.module}/id_rsa")
      host        = openstack_compute_instance_v2.flatcar.access_ip_v4
      
    }
  }
}

resource "openstack_blockstorage_volume_v3" "volume_1" {
  name = "volume_1"
  size = 10
}

resource "openstack_compute_volume_attach_v2" "attach_1" {
  instance_id = openstack_compute_instance_v2.flatcar.id
  volume_id   = openstack_blockstorage_volume_v3.volume_1.id
}

