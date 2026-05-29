# Backend — Commands

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
```
