# 🏋️ FitTrackPro

Monorepo para seguimiento de fitness con **Go**, **Next.js 16** y **React Native (Expo SDK 56)**.

## 📦 Stack

| Capa        | Tecnología               |
|-------------|---------------------------|
| Orquestador | Turborepo 2.9             |
| Package manager | pnpm                   |
| Backend     | Go 1.26                  |
| Web         | Next.js 16 + React 19 + Tailwind |
| Mobile      | Expo SDK 56 + RN 0.85     |

## 📁 Estructura

```
FitTrackPro/
├── apps/
│   ├── web/          Next.js App Router + Tailwind
│   └── mobile/       Expo + React Native
├── backend/          Go API
├── packages/         Shared code (próximamente)
├── turbo.json        Pipeline de build
├── pnpm-workspace.yaml
└── package.json
```

## ⚡ Scripts

### 🔧 Desarrollo

```bash
# Todas las apps a la vez
pnpm dev

# Solo backend
cd backend && go run ./cmd/server

# Solo web
pnpm dev --filter web

# Solo mobile
pnpm dev --filter mobile
```

### 📱 Expo nativo

```bash
npx expo start --ios
npx expo start --android
```

### 🏗️ Build, lint y utilidades

```bash
pnpm build
pnpm lint
pnpm clean
pnpm format
```

## 🚀 Primeros pasos

```bash
pnpm install    # instala dependencias
pnpm dev        # arranca todo
```

**Requisitos**: Node ≥ 22, Go ≥ 1.22, pnpm

---

> ⚠️ `packages/` está reservado para código compartido entre apps (UI components, types, utils). El backend Go no se gestiona vía pnpm pero se integra en CI y con Turborepo vía `tasks`.
