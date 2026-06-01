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

### Campos obligatorios

- Todo campo requerido debe mostrar un **asterisco rojo** (`*`) al lado de su label.
- En `FormField` usar prop `required` para campos obligatorios.
- En formularios con `Label` manual, agregar:
  ```tsx
  <Label>
    Nombre <span className="text-danger ml-0.5">*</span>
  </Label>
  ```

### Layout de formularios (responsive)

- Preferir **CSS Grid** (`grid grid-cols-2 gap-4`) sobre `flex gap-4` para agrupar campos que deben ir en la misma fila (ej. peso/altura). Grid se adapta mejor en pantallas chicas sin overflow horizontal.
- El `Modal.Body` usa `className="flex flex-col gap-4"` (vertical). Dentro de él, los grupos de campos horizontales usan grid, no flex.

## Data fetching

- Use `apiClient<T>(path, options)` from `src/lib/api-client.ts`.
- Mutations use `@tanstack/react-query` `useMutation`.
- Paginated queries must include page params in the query key for separate cache entries.
- Use `placeholderData: (prev) => prev` for smooth page transitions.

## Tablas de datos (DataTable)

Usar siempre el componente genérico `DataTable<T>` de `src/components/data-table/data-table.tsx`.

### Column<T> — interfaz de columna

```ts
interface Column<T> {
  key: string; // Llave del dato en la fila
  label: string; // Texto del header (en español)
  render?: (item: T) => React.ReactNode; // Render personalizado (opcional)
  align?: 'left' | 'center' | 'right'; // Alineación (default: 'center')
}
```

### Alineación de columnas

| Tipo de dato            | `align`              | Ejemplos                      |
| ----------------------- | -------------------- | ----------------------------- |
| Texto                   | `'left'`             | Nombre, Email, Descripción    |
| Estado, chips, acciones | `'center'` (default) | Activo/Inactivo, Rol, Botones |
| Fechas                  | `'center'`           | created_at, updated_at        |
| Números / moneda        | `'right'`            | Precio, Total                 |

### Botón de refrescar

Toda tabla debe incluir `<RefreshButton>` junto al título, con el `queryKey` que coincida con el de la query:

```tsx
<RefreshButton queryKey={['trainers', { page, perPage: 20 }]} />
```

Invalida el cache y se desactiva por 1 segundo (cooldown).

### Confirmación al eliminar

Antes de ejecutar un `DELETE`, mostrar un `AlertDialog` de confirmación con:

- `status="danger"` en el icono
- Título: `¿Eliminar [entidad]?`
- Cuerpo: descripción del borrado irreversible, incluyendo el nombre del registro
- Botón "Cancelar" → cierra sin eliminar
- Botón "Eliminar" con `variant="danger"` → ejecuta la mutación y cierra

Ver ejemplo en `src/features/trainers/components/trainers-table.tsx`.

### Módulo de referencia

`features/trainers/` es el template a replicar para nuevos módulos CRUD: `types.ts` → `api.ts` → `components/trainers-table.tsx` + `components/[entity]-form.tsx` → página.

## Edición en modal con datos frescos

Cuando un elemento se edita dentro de un modal (o cualquier componente inline en la misma página), **siempre se debe consultar el endpoint `GET /:id`** para obtener datos actualizados del backend, en lugar de usar los datos del listado cacheados en el frontend.

### Implementación

1. El hook `useEntity(id)` debe tener `staleTime: 0` para asegurar un refetch en cada apertura.
2. El modal recibe el `id` del elemento a editar (no el objeto completo).
3. Mientras se cargan los datos frescos, el modal muestra un `Spinner`.
4. Cuando los datos llegan, se resetea el formulario con `form.reset(data)`.

### Ejemplo (`features/exercises/api.ts`)

```ts
export function useExercise(id: string | null) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => apiClient<Entity>(`/entities/${id}`),
    enabled: !!id,
    staleTime: 0, // ← siempre refetch
  });
}
```

### Flujo

1. Usuario da clic en "Editar" → se setea `editingId` y se abre el modal
2. El modal recibe `exerciseId={editingId}` como prop
3. `useExercise(exerciseId)` se activa (`enabled: !!id`) y hace fetch a `GET /entities/:id`
4. Mientras carga: `Spinner`
5. Cuando llegan los datos: `form.reset(exercise)` → el usuario ve datos frescos

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

## UI language

- **All user-facing text must be in Spanish**: labels, buttons, placeholders, error messages, titles, descriptions.
- Technical terms that stay in English: `Email`, `Token`, `JWT`, `Dashboard`, component names, CSS classes, API terms.

## Botones

- Todo botón con `variant="primary"` debe incluir un icono antes del texto (importar `<Icon>` de `@iconify/react`).
- Iconos recomendados según acción: agregar (`lucide:plus`), guardar (`lucide:save`), iniciar sesión (`lucide:log-in`), registrarse (`lucide:user-plus`), cambiar contraseña (`lucide:key-round`), volver al inicio (`lucide:home`), reintentar (`lucide:refresh-cw`), editar (`lucide:pencil`), eliminar (`lucide:trash-2`).
- Los botones con `variant="secondary"`, `variant="danger"` y `variant="tertiary"` también pueden usar iconos cuando mejoren la claridad de la acción.

## Shared package

- Types, constants, and utilities shared between web and mobile live in `packages/shared/` (`@fittrackpro/shared`).
- Import via `import { ... } from '@fittrackpro/shared'`.
- Current exports: `Role`, `User`, `ApiResponse<T>`, `PaginatedData<T>`, `ApiError`, `LoginRequest`, `RegisterRequest`, `LoginResponse`, `JwtClaims`, `AuthState`, `ROLES` const, `hasRole()`.

## Pre-commit checks

- After any TS/TSX change: run `pnpm format` and `pnpm --filter web lint`.

## Architecture

See `docs/web/architecture.md` for folder layout, entrypoint flow, component patterns, and design decisions.

## Gotchas

- Dev server uses **Turbopack** by default (`--turbopack` flag in dev).
- Use `@theme inline { ... }` in CSS for custom theme tokens, not `tailwind.config.ts`.
- No `postcss.config.mjs` needed — Tailwind v4 auto-detects.
- `@import "tailwindcss"` must come before `@import "@heroui/styles"` in CSS.
