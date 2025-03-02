SHELL := /bin/bash
.PHONY: deps build build-multiarch run-gui run-backend run
CURRENT_DIR := "${PWD}"

# 🔹 Installation des dépendances (frontend + backend)
deps:
	cd $(CURRENT_DIR)/web && bun install
	cd $(CURRENT_DIR)
	go mod download

# 🔹 Build Docker pour une architecture spécifique
build:
	docker build -t openmower-gui .

# 🔹 Build Docker compatible multi-architecture (AMD64 + ARM64)
build-multiarch:
	docker buildx build --platform linux/amd64,linux/arm64 -t openmower-gui .

# 🔹 Lance uniquement le frontend
run-gui:
	cd $(CURRENT_DIR)/web && bun dev --host

# 🔹 Lance uniquement le backend Go
run-backend:
	CGO_ENABLED=0 go run main.go

# 🔹 Lance à la fois le frontend et le backend
run: run-backend run-gui
