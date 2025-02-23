# === Étape 1: Compilation de l'application Go ===
FROM golang:1.21 AS build-go

WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o openmower-gui

# === Étape 2: Compilation du front-end React avec Bun ===
FROM node:18 AS build-web

WORKDIR /web
COPY ./web .

# Installer Bun correctement
RUN curl -fsSL https://bun.sh/install | bash && \
    echo 'export PATH="/root/.bun/bin:$PATH"' >> /etc/environment


# Installer les dépendances et builder avec Bun
RUN /root/.bun/bin/bun install --frozen-lockfile && /root/.bun/bin/bun run build

# === Étape 3: Installation des dépendances système ===
FROM ubuntu:22.04 AS deps

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    python3 \
    python3-pip \
    python3-venv \
    git \
    libftdi-dev \
    libusb-1.0-0-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pygnssutils

# Installation de PlatformIO
RUN curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core-installer/master/get-platformio.py -o get-platformio.py \
    && python3 get-platformio.py \
    && rm -f get-platformio.py

# Liens symboliques pour PlatformIO
RUN ln -s ~/.platformio/penv/bin/platformio /usr/local/bin/platformio \
    && ln -s ~/.platformio/penv/bin/pio /usr/local/bin/pio \
    && ln -s ~/.platformio/penv/bin/piodebuggdb /usr/local/bin/piodebuggdb

# === Étape 4: Image finale (minimisée) ===
FROM ubuntu:22.04

WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY --from=deps /usr/local/bin/platformio /usr/local/bin/platformio
COPY --from=deps /usr/local/bin/pio /usr/local/bin/pio
COPY --from=deps /usr/local/bin/piodebuggdb /usr/local/bin/piodebuggdb
COPY --from=build-web /web/dist /app/web
COPY --from=build-go /app/openmower-gui /app/openmower-gui
COPY ./setup /app/setup

ENV WEB_DIR=/app/web
ENV DB_PATH=/app/db

EXPOSE 8080

CMD ["/app/openmower-gui"]
