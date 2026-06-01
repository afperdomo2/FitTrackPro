# Web — Architecture

## Folder layout

```
apps/web/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (public)/                     # Route group — no auth required
│   │   │   ├── _components/
│   │   │   │   └── brand-panel.tsx       # Brand panel for login/register (dark, 45%)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx                # 2-panel: BrandPanel + children
│   │   ├── (auth)/                       # Route group — requires authentication
│   │   │   ├── _components/
│   │   │   │   ├── sidebar.tsx           # Fixed desktop / drawer mobile, icons, role-aware
│   │   │   │   └── topbar.tsx            # Breadcrumb + hamburger + theme toggle + user
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── clients/
│   │   │   │   └── page.tsx
│   │   │   ├── trainers/
│   │   │   │   └── page.tsx
│   │   │   ├── workouts/
│   │   │   │   └── page.tsx
│   │   │   ├── exercises/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx                # Sidebar (fixed/drawer) + Topbar, auth guard
│   │   ├── layout.tsx                    # Root layout — fonts, metadata, providers
│   │   ├── page.tsx                      # Landing / redirect
│   │   ├── loading.tsx
│   │   ├── error.tsx                     # Error boundary (icon + card design)
│   │   ├── not-found.tsx                 # 404 (icon + card design)
│   │   ├── providers.tsx                 # Client providers (QueryClient, Auth, Theme, Toasts)
│   │   └── globals.css                   # Tailwind v4 + HeroUI styles + theme tokens + animations
│   ├── components/                       # Shared UI components
│   │   ├── form/
│   │   │   └── form-field.tsx            # RHF + HeroUI Input + error message wrapper
│   │   ├── data-table/
│   │   │   ├── data-table.tsx            # Generic table with pagination, empty state, refresh
│   │   │   ├── pagination.tsx            # Pagination controls (español + iconos)
│   │   │   └── refresh-button.tsx        # Refresh button with 1s cooldown + spin anim
│   │   ├── layout/
│   │   │   └── empty-state.tsx           # Reusable empty state (icon + title + action)
│   │   └── ui/
│   │       ├── theme-toggle.tsx          # Dark/light toggle button
│   │       ├── breadcrumb.tsx            # Auto breadcrumb (full / compact variant)
│   │       └── role-guard.tsx            # Role-based conditional render
│   ├── features/                         # Domain feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── auth-provider.tsx     # AuthContext provider
│   │   │   │   ├── login-form.tsx        # Login form (RHF + Zod + HeroUI)
│   │   │   │   ├── register-form.tsx     # Register form
│   │   │   │   └── change-password-form.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-auth.ts           # AuthContext consumer
│   │   │   ├── api.ts                    # Auth API mutations
│   │   │   ├── types.ts                  # Auth DTOs
│   │   │   └── validators.ts             # Zod schemas (login, register, changePassword)
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   └── users-table.tsx
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── clients/
│   │   │   ├── components/
│   │   │   │   ├── clients-table.tsx
│   │   │   │   └── client-form.tsx
│   │   │   ├── api.ts
│   │   │   ├── validators.ts
│   │   │   └── types.ts
│   │   ├── trainers/
│   │   │   ├── components/
│   │   │   │   ├── trainers-table.tsx
│   │   │   │   └── trainer-form.tsx
│   │   │   ├── api.ts
│   │   │   ├── validators.ts
│   │   │   └── types.ts
│   │   └── exercises/
│   │       ├── components/
│   │       │   ├── exercise-card.tsx     # Card with image, muscle chip, actions
│   │       │   ├── exercise-grid.tsx     # Search/filter grid with pagination
│   │       │   └── exercise-form.tsx     # Create/edit modal form
│   │       ├── api.ts
│   │       ├── validators.ts
│   │       └── types.ts
│   ├── lib/                              # App configuration and utilities
│   │   ├── api-client.ts                 # Fetch wrapper: JWT injection, error normalization
│   │   ├── query-client.ts               # TanStack Query client (staleTime: 5min, retry: 1)
│   │   ├── auth.ts                       # Token get/set/remove from localStorage + JWT decode
│   │   ├── roles.ts                      # Role constants + hasRole() helper
│   │   └── errors.ts                     # normalizeError() utility
│   ├── hooks/                            # Shared hooks
│   └── types/                            # Global TypeScript types
│       ├── api.ts                        # ApiResponse<T>, PaginatedData<T>, ApiError, User, Role
│       └── auth.ts                       # LoginRequest, JwtClaims, AuthState
```

## Entrypoint flow

1. `next dev` / `next build` starts at `src/app/layout.tsx`
2. Root layout loads fonts, calls `globals.css`, wraps children with `Providers`
3. `Providers` composes: `ThemeProvider` > `QueryClientProvider` > `AuthProvider` > children > `Toaster`
4. Route groups determine which layout applies
5. `(public)/layout.tsx` checks auth — if logged in, redirects to `/dashboard`; renders 2-panel layout: `BrandPanel` (left, hidden on mobile) + children (right)
6. `(auth)/layout.tsx` checks auth — if not logged in, redirects to `/login`; renders `Sidebar` (fixed desktop / drawer mobile) + `Topbar` (hamburger + breadcrumb + theme toggle + user) + `children`

## State management

| Layer        | Tool                              | Scope                               |
| ------------ | --------------------------------- | ----------------------------------- |
| Server state | **TanStack Query v5**             | API data: lists, details, mutations |
| Auth state   | **React Context** (`AuthContext`) | Current user, token, login/logout   |
| UI state     | `useState` / `useReducer`         | Forms, modals, filters              |

### Auth flow

```
Login ─► useLogin() mutation ─► apiClient POST /auth/login
  └── on success: setToken() ─► decodeJwt() ─► setUser()
       └── router.replace('/dashboard')

Logout ─► removeToken() ─► queryClient.clear() ─► router.replace('/login')
```

### TanStack Query configuration

```ts
queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});
```

## Component patterns

- **Feature modules** (src/features/): Each domain (auth, users, clients, workouts) is self-contained with its own types, API (queries/mutations), components, and hooks. Pages import from features, never the reverse.
- **Pages are thin**: A page.tsx only sets up layout, role guards, and composes feature components. No business logic.
- **Shared components** (src/components/): Generic, reusable UI like DataTable, FormField, RoleGuard, EmptyState.
- **Custom hooks**: Extract reusable logic per feature (use-pagination.tsx for data table pagination, use-debounce.tsx for search).
- **Compound components**: DataTable, Card, FormField use compound patterns for composability.
- **Component size limit**: Keep under 150 lines. Extract sub-components or custom hooks when they grow.

## Form validation

**Stack**: React Hook Form + Zod + HeroUI

- Validation mode: `mode: 'onChange'` — errors appear/disappear as the user types (hot validation)
- Schema: Zod object per form, with readable error messages
- FormField: Shared wrapper that binds RHF `control` to HeroUI `Input` + `errorMessage`
- Server errors: Caught in `onSubmit`, mapped to form-level `setError('root', ...)` and toast

```tsx
const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onChange',
});

<FormField control={control} name="email" label="Email" type="email" />;
```

## Design system

See **`docs/web/design-system.md`** for the complete design system reference (colors, typography, animations, component conventions, responsive rules).

Key highlights:

- **UI library**: HeroUI v3 (React Aria Components based) — compound patterns (`Card.Header`, `Dropdown.Menu`, etc.)
- **CSS**: Tailwind v4 via `@import "tailwindcss"` and `@import "@heroui/styles"`
- **Theme tokens**: Defined in `globals.css` via `@theme inline` — warm amber accent, dark/light via `.dark` class managed by `next-themes`
- **Fonts**: `font-display` (Plus Jakarta Sans) for headings/brand, Geist for body/mono
- **Animations**: `animate-fade-in-up`, `animate-scale-in`, etc. with `delay-*` classes for staggered reveals
- **Consistency**: All modules use the same building blocks (same Card, Button, Input, Chip) — no custom-styled module diverges

## Layouts

| Route group | Layout               | Auth required | Sidebar                  | Topbar                        |
| ----------- | -------------------- | ------------- | ------------------------ | ----------------------------- |
| `(public)`  | 2-panel asimétrico   | No            | No                       | No                            |
| `(auth)`    | Sidebar + Topbar     | Yes           | Fixed (lg+) / Drawer (<lg) | Hamburger + breadcrumb + user |

**Public layout** (`(public)/layout.tsx`):

- Desktop: `BrandPanel` (45% left, dark bg) + form (55% right)
- Mobile: brand panel oculto, form full-width
- Animación: `animate-fade-in-up` en el contenedor del form

**Auth layout** (`(auth)/layout.tsx`):

- Desktop: Sidebar fijo (`w-60`, `hidden lg:flex`) + Topbar + content
- Mobile: Sidebar como drawer overlay con hamburguesa + backdrop + `animate-slide-in-left`
- Topbar: hamburguesa (`lg:hidden`), breadcrumb compacto en mobile (`sm:hidden`)
- Cierra sidebar automáticamente al cambiar de ruta

Role-based navigation is driven by `src/app/(auth)/_components/sidebar.tsx` — each nav item defines which roles can see it.

Role guards for page-level:

```tsx
// In a page.tsx
<RoleGuard roles="admin">
  <UsersTable />
</RoleGuard>
```

## API integration

### apiClient

```ts
import { apiClient } from '@/lib/api-client';

// GET with pagination
const data = await apiClient<PaginatedData<UserRow>>('/users?page=1&per_page=20');

// POST (mutations)
await apiClient<LoginResponse>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
  skipAuth: true, // skip JWT injection for public endpoints
});
```

### Error handling

- `apiClient` throws `ApiError` with HTTP status and message
- TanStack Query `mutations` catch errors and display via `toast.error()`
- Global `error.tsx` catches rendering errors
- Each form handles server errors locally via `setError`

### Pagination

```ts
// Query key includes page params for separate cache entries
useQuery({
  queryKey: ['users', { page, perPage }],
  queryFn: () => apiClient<PaginatedData<UserRow>>(`/users?page=${page}&per_page=${perPage}`),
  placeholderData: (prev) => prev, // keep previous page while loading
});
```

### Refresh with cooldown

RefreshButton component invalidates the query key and disables itself for 1 second:

```tsx
<RefreshButton queryKey={['users', { page, perPage: 20 }]} />
```

## Backend API contract

- Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:8080/api/v1`)
- Auth: `Authorization: Bearer <token>` header
- Response shape: `{ success: boolean, message?: string, data?: any }`
- Paginated: `{ success: true, data: { data: [...], meta: { page, per_page, total, total_pages } } }`
- Error: `{ success: false, message: "..." }`
- Roles: `admin | trainer | client`

## Naming conventions

| Type          | Convention                        | Example                             |
| ------------- | --------------------------------- | ----------------------------------- |
| Route groups  | `(name)/`                         | `(public)/`, `(auth)/`              |
| Feature names | kebab-case                        | `features/auth/`, `features/users/` |
| Components    | PascalCase                        | `LoginForm`, `DataTable`            |
| Hooks         | `use<Name>`                       | `useAuth`, `useUsers`               |
| API functions | `use<Name>` for queries/mutations | `useLogin`, `useUsers`              |
| Files         | kebab-case                        | `api-client.ts`, `role-guard.tsx`   |
