# Backend — Rules

## Module

- **Go 1.26** module at `github.com/felipe/FitTrackPro/backend`.
- **Not part of pnpm workspace** — not managed by pnpm or Turborepo.
- All commands go through the `Makefile` or direct `go` CLI.

## Hot-reload

- **air** (`air-verse/air` v1.65+) watches `.go` files and rebuilds on save.
- Config at `backend/.air.toml`. Builds `./cmd/server` → `./tmp/main`.
- Server listens on `:8080` by default.

## Structure

```
backend/
├── cmd/server/main.go  # HTTP server entrypoint
├── Makefile            # dev-api, build-api, test-api targets
├── go.mod              # Go module definition
└── .air.toml           # Air hot-reload config
```

## Conventions

- Binary output goes to `backend/bin/server` (via `build-api`).
- Test files: `go test ./...` (via `test-api`).
- Use `make <target>` from `backend/`, or `pnpm <target>:api` from root.
