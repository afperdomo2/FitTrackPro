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
│   │   ├── user.go            # User (ID, Email, Name, PasswordHash, Role, MustChangePassword)
│   │   ├── client.go          # Client profile
│   │   ├── trainer.go         # Trainer profile
│   │   └── ...
│   └── modules/               # Domain modules (one folder per feature)
│       ├── auth/
│       │   ├── handler.go     # Register, Login (public) + ChangePassword (protected)
│       │   ├── service.go     # Register(), Login(), ChangePassword()
│       │   ├── repository.go  # CountAdmins, FindByEmail, FindByID, CreateUser, UpdateUser
│       │   └── dto.go         # RegisterRequest, LoginRequest, ChangePasswordRequest
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
│       └── users/              # CRUD + pagination
│           ├── handler.go     # POST/GET/PUT/DELETE /users, GET /users
│           ├── service.go     # List, Get, Create, Update, Delete
│           ├── repository.go  # FindAll, FindByID, FindByEmail, Create, Update, Delete
│           └── dto.go         # UserResponse, CreateUserRequest, UpdateUserRequest
├── pkg/                       # Reusable utilities (no business logic)
│   ├── jwt/
│   │   └── jwt.go             # GenerateToken, ParseToken, Claims
│   ├── pagination/
│   │   └── pagination.go      # ParseParams, BuildMeta, Params, Meta, Response
│   └── response/
│       └── response.go        # Standard JSON response format
├── docs/                       # Generated Swagger docs (by swag init)
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
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
├── database.Connect(cfg.Database.DSN())
├── db.AutoMigrate(&models.User{})           # creates/updates users table
├── r := gin.Default()
├── r.GET("/swagger/*any", ginSwagger)          # Swagger UI at /swagger/index.html
├──
├── public := r.Group("/api/v1")
│   ├── health.RegisterRoutes(public)           # GET /api/v1/health
│   ├── auth.RegisterPublicRoutes(public)       # POST /auth/register, /auth/login
│
├── protected := r.Group("/api/v1")
│   ├── protected.Use(middleware.AuthRequired()) # JWT Bearer token validation
│   ├── auth.RegisterProtectedRoutes(protected)  # PUT /auth/change-password
│   ├── users.RegisterRoutes(protected)          # CRUD /users
│   ├── modules/client/RegisterRoutes(protected) # planned
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

## Pagination

All list endpoints use `pkg/pagination` for consistent pagination. Import it from any module.

### Request

```
GET /api/v1/users?page=1&per_page=20
```

| Query param | Type | Default | Max |
| ----------- | ---- | ------- | --- |
| `page`      | int  | 1       | —   |
| `per_page`  | int  | 20      | 100 |

### Response

```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

### Usage in a module

```go
// handler.go
params := pagination.ParseParams(c)
items, total, err := svc.ListItems(params)
meta := pagination.BuildMeta(params, total)
c.JSON(200, pagination.NewResponse(items, meta))
```

```go
// repository.go
func (r *Repo) FindAll(p pagination.Params) ([]Model, int64, error) {
    var items []Model
    var total int64
    r.db.Model(&Model{}).Count(&total)
    r.db.Offset(p.Offset()).Limit(p.PerPage).Find(&items)
    return items, total, nil
}
```

## Conventions

| Type       | Location                                | Example                                                             |
| ---------- | --------------------------------------- | ------------------------------------------------------------------- |
| Binary     | `cmd/<name>/main.go`                    | `cmd/server/main.go`                                                |
| Model      | `internal/models/<name>.go`             | `internal/models/user.go`                                           |
| Module     | `internal/modules/<name>/`              | `internal/modules/auth/`                                            |
| Handler    | `internal/modules/<name>/handler.go`    | HTTP layer only                                                     |
| Service    | `internal/modules/<name>/service.go`    | Business logic, no HTTP                                             |
| Repository | `internal/modules/<name>/repository.go` | GORM queries                                                        |
| DTO        | `internal/modules/<name>/dto.go`        | Request/Response types                                              |
| Middleware | `internal/middleware/`                  | Global or group-level                                               |
| Config     | `internal/config/`                      | Env loading                                                         |
| Util       | `pkg/`                                  | Stateless, no domain types                                          |
| Pagination | `pkg/pagination/`                       | Parsed via `ParseParams(c)`, rendered via `NewResponse(data, meta)` |
