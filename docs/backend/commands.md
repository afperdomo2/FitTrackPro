# Backend — Commands

## Setup

```bash
# First time: copy env template
cp .env.example .env

# Install Go dependencies
cd backend && go mod tidy && go mod download
```

## Development (hot-reload)

```bash
pnpm dev:api            # air hot-reload on :8080
cd backend && make dev-api
cd backend && air
```

## Build

```bash
pnpm build:api          # go build → backend/bin/server
cd backend && make build-api
cd backend && go build -o bin/server ./cmd/server
```

## Test

```bash
pnpm test:api           # go test ./...
cd backend && make test-api
cd backend && go test ./...
cd backend && go test ./internal/modules/auth/...  # single module
```

## Database

```bash
# GORM AutoMigrate runs on server startup — no separate migrate command needed.
# To reset: drop tables in PostgreSQL, then restart server.
```

## Lint & security

```bash
cd backend && govulncheck ./...   # vulnerability scan
cd backend && go vet ./...        # static analysis
```

## Format

```bash
pnpm format:api         # go fmt ./...
cd backend && go fmt ./...
```

## Swagger

```bash
cd backend && make swagger        # regenerate docs/
swag init -g cmd/server/main.go -o docs/
```

Swagger UI available at: http://localhost:8080/swagger/index.html
