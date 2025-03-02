FROM node:18

# Définition du mode non interactif pour éviter les prompts
ENV DEBIAN_FRONTEND=noninteractive

# Installation des outils de développement essentiels
RUN apt update && apt install -y \
    sudo wget bash build-essential curl git \
    && rm -rf /var/lib/apt/lists/*

# Installation de Go
RUN wget https://go.dev/dl/go1.22.4.linux-amd64.tar.gz \
    && rm -rf /usr/local/go \
    && tar -C /usr/local -xzf go1.22.4.linux-amd64.tar.gz \
    && rm -f go1.22.4.linux-amd64.tar.gz

# Ajout de Go dans le PATH
ENV PATH="/usr/local/go/bin:${PATH}"

# Ajout des permissions sudo pour l'utilisateur `node`
ARG USERNAME=node
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Définition d'une variable d’environnement pour identifier le devcontainer
ENV DEVCONTAINER=true

# Définit un répertoire de travail par défaut
WORKDIR /workspace
