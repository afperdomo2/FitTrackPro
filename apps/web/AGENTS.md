<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Web Agent Rules

## Architecture

See `docs/web/architecture.md` for folder layout, component patterns, and state management.

## Quick rules

### Spanish UI

- All user-facing text must be in Spanish: labels, buttons, placeholders, error messages, titles, descriptions
- Technical terms that stay in English: `Email`, `Token`, `JWT`, `Dashboard`, component names, CSS classes, API terms
- After any TS/TSX change: run `pnpm format` and `pnpm --filter web lint`

### State

- **TanStack Query v5** for all server state (queries + mutations)
- **React Context** (`AuthContext`) for auth state only
- Local component state for UI-only data

### Components

- Feature modules in `src/features/<name>/` follow domain pattern: `api.ts`, `types.ts`, `components/`, `hooks/`
- Pages in `src/app/` are thin — they compose feature components, no business logic
- UI components in `src/components/` are shared and reusable
- Keep components under 150 lines; extract hooks when they exceed

### Forms

- **React Hook Form** + **Zod** with `mode: 'onChange'` for hot validation
- Wrap HeroUI inputs with `FormField` component from `src/components/form/`
- Server errors map to form `setError` or toast notifications

### Data fetching

- Use `apiClient<T>(path, options)` from `src/lib/api-client.ts` — injects JWT, parses errors
- Paginated queries use `placeholderData: (prev) => prev` for smooth page transitions
- Refresh buttons use `RefreshButton` component with 1-second cooldown

### Role-based access

- `RoleGuard` component in `src/components/ui/role-guard.tsx` for conditional rendering
- Route-level protection in `(auth)/layout.tsx` (redirects unauthenticated users)

### Dependencies

| Package                   | Use                                             |
| ------------------------- | ----------------------------------------------- |
| `@heroui/react`           | UI components (Button, Card, Input, Chip, etc.) |
| `@heroui/styles`          | HeroUI Tailwind v4 CSS import                   |
| `@tanstack/react-query`   | Server state management                         |
| `react-hook-form` + `zod` | Form validation                                 |
| `sonner`                  | Toast notifications                             |
| `next-themes`             | Dark/light mode                                 |
| `atob` (nativo)           | JWT payload decoding                            |
