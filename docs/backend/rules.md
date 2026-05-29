# Backend — Rules

## Module

- **Go 1.26** module at `github.com/felipe/FitTrackPro/backend`.
- **Not part of pnpm workspace** — not managed by pnpm or Turborepo.
- All commands go through the `Makefile` or direct `go` CLI.

## Stack

| Library | Purpose |
|---------|---------|
| `github.com/gin-gonic/gin` | HTTP server, routing, middleware |
| `gorm.io/gorm` + `gorm.io/driver/postgres` | ORM + PostgreSQL driver |
| `github.com/golang-jwt/jwt/v5` | JWT token creation & validation |
| `golang.org/x/crypto/bcrypt` | Password hashing |
| `github.com/joho/godotenv` | Load `.env` into environment |

## Environment

- `.env` — local secrets, **gitignored** (see `.gitignore`).
- `.env.example` — template with placeholder values, committed to repo.
- All config loaded via `internal/config/config.go` at startup.

```env
# .env.example
APP_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fittrackpro
DB_SSLMODE=disable
JWT_SECRET=change-me-in-production
JWT_EXPIRATION_HOURS=24
```

## Architecture

See `docs/backend/architecture.md` for full folder layout, entrypoint flow, and module conventions.

## Conventions

- **Domain-driven modules** — each feature lives in `internal/modules/<name>/`.
- Each module has exactly 4 files: `handler.go`, `service.go`, `repository.go`, `dto.go`.
- Handlers only parse HTTP and call services. Services contain business logic. Repositories contain GORM calls.
- Models (GORM entities) live in `internal/models/`, shared across modules.
- Middleware lives in `internal/middleware/`. Attach globally or per route group.
- Public routes: `/api/v1/auth/*`. Protected routes: `/api/v1/*` (require JWT).
- JSON responses standardized via `pkg/response/`.
- Binary output: `bin/server` (via `make build-api`).

## Gotchas

- GORM `AutoMigrate` never drops columns — manual migrations needed for destructive changes.
- `govulncheck` is the Go equivalent of `pnpm audit`. Run before adding dependencies.
- `.env` must exist locally before running — copy from `.env.example` as starting point.
