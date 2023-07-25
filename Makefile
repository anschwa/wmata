# GNUmakefile
SHELL := bash
.ONESHELL:
.DELETE_ON_ERROR:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables

.PHONY: help
help: ## Display this help section
	@echo -e "Usage: make <command>\n\nAvailable commands are:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "  %-38s %s\n", $$1, $$2}' ${MAKEFILE_LIST}
.DEFAULT_GOAL := help

DOCKER := podman
IMAGE := node:latest
MOUNT := .:/opt/app:z
DIR := /opt/app
PORT := 8080:8080

.PHONY: shell
shell: ## Start a dev shell in a docker/podman container
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) -p $(PORT) $(IMAGE) bash

.PHONY: start
start: ## Start dev server
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) -p $(PORT) $(IMAGE) npm run dev

.PHONY: lint
lint: ## Lint project
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) $(IMAGE) npm run lint

.PHONY: test
test: ## Run tests
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) $(IMAGE) npm run test

.PHONY: build
build: ## Build app for production
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) $(IMAGE) npm run build

.PHONY: preview
preview: ## Preview production app locally
	$(DOCKER) run --rm -it -v $(MOUNT) -w $(DIR) -p $(PORT) $(IMAGE) npm run preview
