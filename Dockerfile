# -------------------
# Étape 1 : Build du backend (Go)
# -------------------
    FROM --platform=$BUILDPLATFORM golang:1.21 as build-go

    WORKDIR /app
    COPY go.mod go.sum ./
    RUN go mod tidy && go mod download
    
    COPY . .
    RUN CGO_ENABLED=0 GOOS=linux GOARCH=$(go env GOARCH) go build -o openmower-gui
    
    # -------------------
    # Étape 2 : Build du frontend (Bun)
    # -------------------
    FROM --platform=$BUILDPLATFORM node:18 as build-web
    
    WORKDIR /web
    COPY ./web/package.json ./web/bun.lockb ./
    RUN bun install --frozen-lockfile  # ✅ Install avant de copier tout le code pour profiter du cache Docker
    
    COPY ./web .
    RUN bun run build
    
    # -------------------
    # Étape 3 : Dépendances (compilées pour l'arch cible)
    # -------------------
    FROM --platform=$BUILDPLATFORM ubuntu:22.04 as deps
    
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl python3 python3-pip python3-venv git \
        build-essential unzip wget autoconf automake pkg-config \
        texinfo libtool libftdi-dev libusb-1.0-0-dev && \
        apt-get install -y rpi.gpio-common || true
    
    # Compilation de OpenOCD (uniquement si ARM)
    RUN git clone https://github.com/raspberrypi/openocd.git --recursive --branch rp2040 --depth=1 && \
        cd openocd && \
        ./bootstrap && \
        ./configure --enable-ftdi --enable-sysfsgpio --enable-bcm2835gpio && \
        make -j$(nproc) && make install && \
        cd .. && rm -rf openocd
    
    # Installation de PlatformIO et nettoyage du cache
    RUN curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core-installer/master/get-platformio.py -o get-platformio.py && \
        python3 get-platformio.py && \
        python3 -m pip install --upgrade pygnssutils && \
        rm -rf /var/lib/apt/lists/* ~/.cache/*
    
    # -------------------
    # Étape 4 : Image finale d'exécution (léger et rapide)
    # -------------------
    FROM --platform=$TARGETPLATFORM alpine:latest
    
    WORKDIR /app
    
    # Création d'un utilisateur non-root pour des raisons de sécurité
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    # Copie des fichiers nécessaires depuis les étapes précédentes
    COPY --from=deps /usr/local/bin /usr/local/bin
    COPY --from=build-web /web/dist /app/web
    COPY --from=build-go /app/openmower-gui /app/openmower-gui
    COPY ./setup /app/setup
    
    # Définition des variables d'environnement
    ENV WEB_DIR=/app/web
    ENV DB_PATH=/app/db
    
    # Définition de la commande de démarrage
    CMD ["/app/openmower-gui"]
    