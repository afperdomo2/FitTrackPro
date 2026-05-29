# Backend — Architecture

Domain-driven layered architecture. Each module is a self-contained folder under `internal/modules/` with handler, service, repository, and DTO.

## Folder layout

```
backend/
├── cmd/server/main.go         # Entrypoint — wires router, DB, middlewares
├── internal/
│   ├── config/
│   │   └── config.go          # Loads .env into Config struct
│   ├── database/
│   │   └── database.go        # PostgreSQL connection + AutoMigrate
│   ├── middleware/
│   │   ├── auth.go            # JWT token validation
│   │   ├── cors.go            # CORS configuration
│   │   └── logger.go          # Custom request logging
│   ├── models/                # GORM entity definitions
│   │   ├── user.go            # User (email, password_hash, role)
│   │   ├── client.go          # Client profile
│   │   ├── trainer.go         # Trainer profile
│   │   └── ...
│   └── modules/               # Domain modules (one folder per feature)
│       ├── auth/
│       │   ├── handler.go     # POST /login, /register, /forgot-password, /reset-password
│       │   ├── service.go     # Hash password, generate JWT, validate input
│       │   ├── repository.go  # GORM queries: find user, create user
│       │   └── dto.go         # Request/Response structs
│       ├── client/
│       │   ├── handler.go
│       │   ├── service.go
│       │   ├── repository.go
│       │   └── dto.go
│       ├── trainer/
│       │   ├── handler.go
│       │   ├── service.go
│       │   ├── repository.go
│       │   └── dto.go
│       └── workout/           # Example future module
│           ├── handler.go
│           ├── service.go
│           ├── repository.go
│           └── dto.go
├── pkg/                       # Reusable utilities (no business logic)
│   ├── validator/
│   │   └── validator.go       # Input validation helpers
│   └── response/
│       └── response.go        # Standard JSON response format
├── .env.example               # Template — safe to commit
├── .env                       # Local secrets — gitignored
├── go.mod
├── go.sum
├── Makefile
└── .air.toml
```

## Entrypoint flow

1. `cmd/server/main.go` loads config from `.env`
2. Opens PostgreSQL connection via `internal/database`
3. Runs `AutoMigrate` on all GORM models from `internal/models/`
4. Registers global middleware (Logger, Recovery, CORS)
5. Creates route groups per module under `/api/v1/`
6. Attaches auth middleware to protected route groups
7. Listens on `APP_PORT` (default `:8080`)

```
main.go
├── config.Load()
├── database.Connect(cfg)
├── database.AutoMigrate(models...)
├── r := gin.Default()
├── r.Use(middleware.CORS())
├── r.Use(middleware.Logger())
├──
├── public := r.Group("/api/v1")
│   ├── modules/auth/handler.RegisterRoutes(public)
│
├── protected := r.Group("/api/v1")
│   ├── protected.Use(middleware.Auth(cfg.JWTSecret))
│   ├── modules/client/handler.RegisterRoutes(protected)
│   ├── modules/trainer/handler.RegisterRoutes(protected)
│
└── r.Run(":" + cfg.AppPort)
```

## Module contract

Each module registers itself via a public `RegisterRoutes(router *gin.RouterGroup)` function in its handler. The main file only imports and calls that — no coupling between modules.

```go
// internal/modules/auth/handler.go
func RegisterRoutes(rg *gin.RouterGroup) {
    h := newHandler()
    rg.POST("/login", h.Login)
    rg.POST("/register", h.Register)
    rg.POST("/forgot-password", h.ForgotPassword)
}
```

## Conventions

| Type | Location | Example |
|------|----------|---------|
| Binary | `cmd/<name>/main.go` | `cmd/server/main.go` |
| Model | `internal/models/<name>.go` | `internal/models/user.go` |
| Module | `internal/modules/<name>/` | `internal/modules/auth/` |
| Handler | `internal/modules/<name>/handler.go` | HTTP layer only |
| Service | `internal/modules/<name>/service.go` | Business logic, no HTTP |
| Repository | `internal/modules/<name>/repository.go` | GORM queries |
| DTO | `internal/modules/<name>/dto.go` | Request/Response types |
| Middleware | `internal/middleware/` | Global or group-level |
| Config | `internal/config/` | Env loading |
| Util | `pkg/` | Stateless, no domain types |
