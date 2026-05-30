# 🏋️ FitTrackPro

Monorepo para seguimiento de fitness con **Go**, **Next.js 16** y **React Native (Expo SDK 56)**.

## 📦 Stack

| Capa            | Tecnología                        |
| --------------- | --------------------------------- |
| Orquestador     | Turborepo 2.9                     |
| Package manager | pnpm                              |
| Backend         | Go 1.26 + Gin + GORM + PostgreSQL |
| Web             | Next.js 16 + React 19 + Tailwind  |
| Mobile          | Expo SDK 56 + RN 0.85             |

## 📁 Estructura

```
FitTrackPro/
├── apps/
│   ├── web/          Next.js App Router + Tailwind
│   └── mobile/       Expo + React Native
├── backend/          Go API + Makefile
├── packages/         Shared code (próximamente)
├── turbo.json        Pipeline de build
├── pnpm-workspace.yaml
└── package.json
```

## ⚡ Scripts

### ⚙️ Backend (Go)

```bash
pnpm dev:api          # Go + air (hot-reload en :8080)
pnpm build:api        # go build → backend/bin/server
pnpm test:api         # go test ./...
pnpm lint:api         # go vet + govulncheck
pnpm format:api       # go fmt ./...
pnpm swagger:api      # regenera docs/ de Swagger
pnpm deps:api         # go mod tidy + download
```

**Swagger UI**: <http://localhost:8080/swagger/index.html>

### 🌐 Web (Next.js)

```bash
pnpm dev:web          # Next.js (Turbopack)
pnpm build:web        # next build
pnpm deploy:web       # next build (producción)
```

### 📱 Mobile (Expo)

```bash
pnpm dev:mobile       # Expo dev server
pnpm build:mobile     # expo build (native)
pnpm deploy:mobile    # expo export --platform web

# Nativo (dentro de apps/mobile/)
cd apps/mobile && npx expo start --ios
cd apps/mobile && npx expo start --android
```

### 🔧 Global (Turborepo)

```bash
pnpm dev              # todos los proyectos en paralelo
pnpm build            # todos los builds
pnpm lint             # lint de todos los proyectos
pnpm clean            # limpia artefactos
pnpm format           # Prettier (ts, tsx, js, json, md)
```

## 🚀 Primeros pasos

```bash
pnpm install                # instala dependencias
go install github.com/air-verse/air@latest  # hot-reload para Go
pnpm dev:api                # arranca API
pnpm dev:web                # arranca frontend
```

**Requisitos**: Node ≥ 22, Go ≥ 1.22, pnpm

---

> ⚠️ `packages/` está reservado para código compartido entre apps (UI components, types, utils). El backend Go no se gestiona vía pnpm pero se integra vía scripts y Makefile.
