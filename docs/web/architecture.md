# Web — Architecture

## Folder layout

```
apps/web/
├── src/app/              # App Router pages & layouts (entrypoint)
│   ├── layout.tsx        # Root layout — fonts, metadata, <html>/<body>
│   ├── page.tsx          # Home page (/) 
│   ├── globals.css       # Tailwind v4 @theme + base styles
│   └── favicon.ico       # Favicon
├── public/               # Static assets (images, fonts, robots.txt)
├── next.config.ts        # Next.js configuration
├── eslint.config.mjs     # Flat ESLint config (eslint-config-next)
├── tsconfig.json         # TypeScript with Next.js plugin
└── packages.json         # Dependencies & scripts
```

## Entrypoint flow

1. `next dev` / `next build` starts at `src/app/layout.tsx`
2. `layout.tsx` wraps all pages — loads Geist fonts, applies globals.css
3. App Router maps routes from file system under `src/app/`
4. Path alias: `@/*` → `./src/*`

## Convention for new pages

| Type | Location | Example |
|------|----------|---------|
| Page | `src/app/<route>/page.tsx` | `src/app/dashboard/page.tsx` → `/dashboard` |
| Layout | `src/app/<route>/layout.tsx` | Nested layouts inherit from parent |
| Loading | `src/app/<route>/loading.tsx` | Shown during SSR |
| Error | `src/app/<route>/error.tsx` | Error boundary |
| Components | `src/components/` | Shared UI components |
