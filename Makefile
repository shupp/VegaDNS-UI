.PHONY: help

help:
	@# Helper for listing available targets
	@echo "\nAvailable targets: \n"
	@grep -oE '^[a-zA-Z0-9_.%-]+:([^=]|$$)' Makefile | grep -v '.PHONY' | sed -e 's/:.*$$//' | sort

build:
	docker build --no-cache -t vegadns/ui .

run:
	npm run-script watch
