#!/bin/bash

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential ports
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 9443/tcp    # Common for dashboards (e.g., Portainer, Rancher)
sudo ufw allow 9090/tcp    # Prometheus or admin UI port

# Allow Docker-related ports
# These depend on your Docker setup — here are the common ones:
sudo ufw allow 2375/tcp    # Docker API (insecure, only if needed)
sudo ufw allow 2376/tcp    # Docker API with TLS
sudo ufw allow 4789/udp    # Docker Swarm overlay network
sudo ufw allow 7946/tcp    # Docker Swarm communication
sudo ufw allow 7946/udp    # Docker Swarm communication

sudo ufw allow 5000/tcp    # Docker Swarm communication
sudo ufw allow 5000/udp    # Docker Swarm communication
# Enable UFW
sudo systemctl restart ufw
sudo ufw enable

