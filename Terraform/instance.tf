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

# Null_resource to copy files & exec storage commands on control plane
resource "null_resource" "provision_web" {
  depends_on = [openstack_compute_instance_v2.flatcar]

  # Send the cloud.conf file
  provisioner "file" {
    source      = "cloud.conf"
    destination = "/home/core/cloud.conf"
    connection {
      type        = "ssh"
      user        = "core"
      agent       = "false"
      private_key = file("${path.module}/id_rsa")
      host        = openstack_networking_floatingip_v2.float_ip.address
    }
  }

  provisioner "file" {
    source      = "cinder-pv.yaml"
    destination = "/home/core/cinder-pv.yaml"
    connection {
      type        = "ssh"
      user        = "core"
      agent       = "false"
      private_key = file("${path.module}/id_rsa")
      host        = openstack_networking_floatingip_v2.float_ip.address
    }
  }

  provisioner "file" {
    source      = "cinder-pvc.yaml"
    destination = "/home/core/cinder-pvc.yaml"
    connection {
      type        = "ssh"
      user        = "core"
      agent       = "false"
      private_key = file("${path.module}/id_rsa")
      host        = openstack_networking_floatingip_v2.float_ip.address
    }
  }

  # Run the commands
  provisioner "remote-exec" {
    inline = [
      "systemctl start storage-stuff.service"
    ]
    connection {
      type        = "ssh"
      user        = "core"
      agent       = "false"
      private_key = file("${path.module}/id_rsa")
      host        = openstack_networking_floatingip_v2.float_ip.address
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

