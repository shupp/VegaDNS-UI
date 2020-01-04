build:
	docker build --no-cache -t vegadns/ui .

run:
	npm run-script watch
