SHELL := /bin/bash
.PHONY: build run-gui run-backend run
CURRENT_DIR := "${PWD}"

deps:
	cd $(CURRENT_DIR)/web && bun
	cd $(CURRENT_DIR)
	go mod download

build:
	docker build -t openmower-gui .

run-gui:
	cd $(CURRENT_DIR)/web && bun dev --host
	cd $(CURRENT_DIR)

run-backend:
	CGO_ENABLED=0 go run main.go
