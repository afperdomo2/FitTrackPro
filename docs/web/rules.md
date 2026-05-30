# Web — Rules

## Framework

- **Next.js 16.2.6** with React 19.2.4.
- **Breaking changes** vs 14/15 — APIs, conventions, and file structure differ from training data.
- Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Styling

- **Tailwind CSS v4** — no `tailwind.config.ts`.
- Theme is defined via `@theme inline` in `src/app/globals.css`.
- Uses `@import "tailwindcss"` + `@import "@heroui/styles"` for HeroUI integration.

## State management

- **TanStack Query v5** for all server state. No Redux, no Zustand.
- Auth state via React Context (`AuthContext`).
- Local UI state via `useState` / `useReducer`.

## Component architecture

- Feature modules in `src/features/<name>/` with: `api.ts`, `types.ts`, `components/`, `hooks/`.
- Pages are thin — import and compose from feature modules.
- Shared UI components in `src/components/` are generic and reusable.
- Every component must be under 150 lines. Extract hooks or sub-components when exceeded.

## Form validation

- **React Hook Form** + **Zod** + **HeroUI**.
- Use `mode: 'onChange'` for hot validation (errors appear/disappear while typing).
- Use `FormField` wrapper from `src/components/form/` to bind RHF to HeroUI Input.
- Server errors: catch in `onSubmit`, display via `setError('root', ...)` + `toast.error()`.

## Data fetching

- Use `apiClient<T>(path, options)` from `src/lib/api-client.ts`.
- Mutations use `@tanstack/react-query` `useMutation`.
- Paginated queries must include page params in the query key for separate cache entries.
- Use `placeholderData: (prev) => prev` for smooth page transitions.
- Refresh buttons use `RefreshButton` component — invalidates query key, 1-second cooldown.

## Role-based access

- Use `RoleGuard` component from `src/components/ui/role-guard.tsx` for conditional rendering.
- Route-level protection in `(auth)/layout.tsx` — redirects to `/login` if unauthenticated.
- Page-level: wrap in `<RoleGuard roles="admin">`.

## API contract

- Base URL from `NEXT_PUBLIC_API_URL` env (default `http://localhost:8080/api/v1`).
- Response: `{ success: boolean, message?: string, data?: any }`.
- Errors: `{ success: false, message: "..." }`.
- Auth: `Authorization: Bearer <token>` header.

## Error handling

- `apiClient` throws `ApiError(status, message)` on non-success responses.
- TanStack Query mutations catch errors and show via `sonner` toasts.
- Global `error.tsx` catches render errors.

## Linting

- **ESLint flat config** (`eslint.config.mjs`), not `.eslintrc.*`.
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

## TypeScript

- Strict mode enabled. Path alias: `@/*` → `./src/*`.
- TS version: ~5.x (compatible with React 19 types).

## Architecture

See `docs/web/architecture.md` for folder layout, entrypoint flow, component patterns, and design decisions.

## Gotchas

- Dev server uses **Turbopack** by default (`--turbopack` flag in dev).
- Use `@theme inline { ... }` in CSS for custom theme tokens, not `tailwind.config.ts`.
- No `postcss.config.mjs` needed — Tailwind v4 auto-detects.
- `@import "tailwindcss"` must come before `@import "@heroui/styles"` in CSS.
