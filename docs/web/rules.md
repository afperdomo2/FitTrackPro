# Web — Rules

## Framework

- **Next.js 16.2.6** with React 19.2.4.
- **Breaking changes** vs 14/15 — APIs, conventions, and file structure differ from training data.
- Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Styling

- **Tailwind CSS v4** — no `tailwind.config.ts`.
- Theme is defined via `@theme inline` in `src/app/globals.css`.
- Uses `@import "tailwindcss"` instead of `@tailwind` directives.

## Linting

- **ESLint flat config** (`eslint.config.mjs`), not `.eslintrc.*`.
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

## TypeScript

- Strict mode enabled. Path alias: `@/*` → `./src/*`.
- TS version: ~5.x (compatible with React 19 types).

## Structure

```
apps/web/
├── src/app/          # App Router pages & layouts
│   ├── layout.tsx    # Root layout (Geist font, globals.css)
│   ├── page.tsx      # Home page
│   └── globals.css   # Tailwind v4 theme + base styles
├── public/           # Static assets
├── next.config.ts    # Next.js config
├── eslint.config.mjs # Flat ESLint config
└── tsconfig.json     # TypeScript config with Next plugin
```

## Gotchas

- Dev server uses **Turbopack** by default (`--turbopack` flag in dev).
- Use `@theme inline { ... }` in CSS for custom theme tokens, not `tailwind.config.ts`.
- No `postcss.config.mjs` needed — Tailwind v4 auto-detects.
