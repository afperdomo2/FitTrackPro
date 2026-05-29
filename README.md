# 🏋️ FitTrackPro

Monorepo para seguimiento de fitness con **Go**, **Next.js 16** y **React Native (Expo SDK 56)**.

## 📦 Stack

| Capa           | Tecnología                      |
|----------------|---------------------------------|
| Orquestador    | Turborepo 2.9                   |
| Package manager | pnpm                           |
| Backend        | Go 1.26 + air (hot-reload)     |
| Web            | Next.js 16 + React 19 + Tailwind |
| Mobile         | Expo SDK 56 + RN 0.85           |

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

### 🔧 Desarrollo individual

```bash
pnpm dev:api       # Go + air (hot-reload en :8080)
pnpm dev:web       # Next.js (Turbopack)
pnpm dev:mobile    # Expo dev server

# Todas a la vez
pnpm dev
```

### 📱 Expo nativo

```bash
cd apps/mobile && npx expo start --ios
cd apps/mobile && npx expo start --android
```

### 🏗️ Build y test

```bash
pnpm build:api     # go build ./cmd/server  →  backend/bin/server
pnpm build:web     # next build
pnpm build:mobile  # expo build (native)
pnpm test:api      # go test ./...

# Todos los builds
pnpm build
```

### 🚀 Deploy

```bash
pnpm deploy:web     # next build (producción)
pnpm deploy:mobile  # expo export --platform web
```

### 🧹 Utilidades

```bash
pnpm lint
pnpm clean
pnpm format
```

## 🚀 Primeros pasos

```bash
pnpm install            # instala dependencias
go install github.com/air-verse/air@latest  # hot-reload para Go
pnpm dev:api            # arranca API
pnpm dev:web            # arranca frontend
```

**Requisitos**: Node ≥ 22, Go ≥ 1.22, pnpm

---

> ⚠️ `packages/` está reservado para código compartido entre apps (UI components, types, utils). El backend Go no se gestiona vía pnpm pero se integra vía scripts y Makefile.
