# Backend — Rules

## Module

- **Go 1.26** module at `github.com/felipe/FitTrackPro/backend`.
- **Not part of pnpm workspace** — not managed by pnpm or Turborepo.
- All commands go through the `Makefile` or direct `go` CLI.

## Stack

| Library                                    | Purpose                          |
| ------------------------------------------ | -------------------------------- |
| `github.com/gin-gonic/gin`                 | HTTP server, routing, middleware |
| `gorm.io/gorm` + `gorm.io/driver/postgres` | ORM + PostgreSQL driver          |
| `github.com/golang-jwt/jwt/v5`             | JWT token creation & validation  |
| `golang.org/x/crypto/bcrypt`               | Password hashing                 |
| `github.com/joho/godotenv`                 | Load `.env` into environment     |

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

## Swagger

- All `@Summary`, `@Description`, and `@Param` annotations must be written in **Spanish**.
- Tags (`@Tags`) and Go identifiers (function names, variables) remain in lowercase English.
- Regenerate docs after any handler change: `pnpm swagger:api` or `make swagger` from `backend/`.

## Code style

- After every code change run `pnpm format:api` (`go fmt ./...`).
- After every code change run `pnpm build:api` (verify compilation).
- After changing handlers or annotations run `pnpm swagger:api` (regenerate docs).
- If business logic changed run `pnpm test:api` (execute tests).

## Gotchas

- GORM `AutoMigrate` never drops columns — manual migrations needed for destructive changes.
- `govulncheck` is the Go equivalent of `pnpm audit`. Run before adding dependencies.
- `.env` must exist locally before running — copy from `.env.example` as starting point.

### GORM — boolean `false` in Updates

`gorm.Model` and structs with `bool` fields: **`Updates()` with a struct skips zero-value fields**, including `bool(false)`. An explicit `is_active: false` will be silently ignored, even with `Select("is_active")`.

✅ **Correcta (usar map o SQL directo):**

```go
// Siempre funciona — map mantiene false
db.Model(&User{}).Where("id = ?", id).Updates(map[string]interface{}{
    "is_active": false,
})

// Siempre funciona — SQL directo
db.Exec("UPDATE users SET is_active = ? WHERE id = ?", false, id)
```

❌ **Incorrecta (GORM omite false):**

```go
db.Model(&User{}).Where("id = ?", id).Select("is_active").Updates(&User{IsActive: false})
//                                     ^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^
//                                     Select no sirve           struct — omite false
```

⚠️ **`Save()` sobre modelos con asociaciones (HasOne/BelongsTo) puede cascadear a la tabla relacionada usando struct, sobreescribiendo booleanos.** Preferir updates dirigidos con `Model().Update()` o `Exec()`.

Ver `backend/internal/modules/trainers/repository.go` para un ejemplo real de la solución con `Exec`.
