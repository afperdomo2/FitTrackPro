# Web — Commands

## Development

```bash
pnpm dev:web           # Next.js Turbopack dev server
pnpm --filter web dev  # same, via pnpm filter
```

## Build

```bash
pnpm build:web          # next build (development)
pnpm --filter web build
```

## Deploy

```bash
pnpm deploy:web          # next build (production)
pnpm --filter web deploy
```

## Lint

```bash
pnpm lint               # turbo lint (all apps)
pnpm --filter web lint  # eslint only for web
```
