#!/bin/bash

# Check if this node should act as the master
if [ "$ROLE" == "master" ]; then
  # Install K3s as master
  curl -sfL https://get.k3s.io | sh -s - --disable=traefik --disable=local-storage
else
  # Install K3s as a worker node
  curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
fi
