.PHONY: deps dev-api build-api test-api lint

deps:
	go mod tidy
	go mod download

build-api:
	go build -o bin/server ./cmd/server

dev-api:
	air

test-api:
	go test ./...

lint:
	go vet ./...
	govulncheck ./...
