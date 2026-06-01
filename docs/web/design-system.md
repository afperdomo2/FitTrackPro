# Web — Design System ("Athletic Refined")

## Color Palette

Todas las variables se definen en `src/app/globals.css` con valores `oklch`. El tema se controla via `next-themes` con clase `.dark` / `:root`.

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--color-accent` | `var(--accent)` | `var(--accent)` | Botones primarios, links, indicadores activos |
| `--color-accent-foreground` | `var(--accent-foreground)` | — | Texto sobre accent |
| `--color-background` | `var(--background)` | `var(--background)` | Fondo de página |
| `--color-foreground` | `var(--foreground)` | `var(--foreground)` | Texto principal |
| `--color-sidebar` | `var(--sidebar)` | `var(--sidebar)` | Fondo del sidebar |
| `--color-sidebar-border` | `var(--sidebar-border)` | — | Bordes del sidebar |
| `--color-surface-secondary` | `var(--surface-secondary)` | — | Fondos secundarios (hover, placeholders) |
| `--color-danger` | `var(--danger)` | `var(--danger)` | Errores, estados críticos |
| `--color-success` | `var(--success)` | `var(--success)` | Estados exitosos |
| `--color-warning` | `var(--warning)` | `var(--warning)` | Advertencias |

Valores base (ámbar/dorado):

| Variable | Light | Dark |
|----------|-------|------|
| `--accent` | `oklch(0.68 0.18 70)` | `oklch(0.72 0.18 75)` |
| `--background` | `oklch(0.975 0.003 65)` (crema claro) | `oklch(0.11 0.005 65)` (carbón cálido) |
| `--foreground` | `oklch(0.15 0.01 65)` | `oklch(0.96 0.003 65)` |

> **Importante:** No usar valores hex hardcodeados. Siempre usar las variables del tema: `bg-accent`, `text-accent`, `bg-accent/10`, `bg-danger/10`, `border-border/50`, etc.

---

## Typography

| Token | Font | Uso |
|-------|------|-----|
| `font-display` | **Plus Jakarta Sans** (`next/font/google`) | Headings, brand name, títulos de página, `Card.Title`, `Modal.Heading` |
| `font-sans` (default) | **Geist** | Cuerpo de texto, labels, botones, inputs |
| `font-mono` | **Geist Mono** | Código, valores técnicos |

### Conventions

```tsx
// Page headings
<h1 className="text-2xl font-display font-bold tracking-tight">Clientes</h1>

// Section card titles
<Card.Title className="font-display">Información de la cuenta</Card.Title>

// Modal headings
<Modal.Heading className="font-display">Crear ejercicio</Modal.Heading>

// Brand
<span className="text-base font-display font-bold tracking-tight">FitTrackPro</span>
```

---

## Animations

Definidas en `globals.css` via `@theme inline` con `animation-fill-mode: both` (empiezan invisible, terminan visible).

| Clase | Cuándo usarla |
|-------|---------------|
| `animate-fade-in` | Elementos que deben aparecer suavemente (errores, modales síncronos) |
| `animate-fade-in-up` | **Patrón principal** para contenido de página, cards, formularios |
| `animate-scale-in` | Modales, diálogos, tarjetas de error/404 |
| `animate-slide-in-left` | Drawer del sidebar en mobile |

### Staggered delays

```tsx
<div className="space-y-4 animate-fade-in-up">
  <h1 className="text-2xl font-display font-bold tracking-tight">Título</h1>
  <Card className="animate-fade-in-up delay-100">
  <Card className="animate-fade-in-up delay-200">
  <Card className="animate-fade-in-up delay-300">
</div>
```

Clases de delay disponibles: `delay-100`, `delay-200`, `delay-300`, `delay-400`, `delay-500`.

### Reglas de animación

- **Páginas completas**: el contenedor principal lleva `animate-fade-in-up`
- **Cards en grid**: cada card con `animate-fade-in-up` y delay incremental
- **Formularios**: cada `FormField` envuelto en `<div className="animate-fade-in-up delay-*">`
- **Modales y errores**: `animate-scale-in` en el contenedor y en el `Card`
- **NO** animar elementos que pueden re-renderizarse (evitar parpadeos)

---

## Component Styling Conventions

### Cards

```tsx
<Card className="border border-border/50 shadow-sm">
<Card className="border border-border/50 shadow-lg shadow-black/5">  <!-- errores/404 -->
```

### Page Headings

```tsx
<h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
<p className="text-sm text-muted-foreground">Descripción breve</p>
```

### Error Banners (root errors en formularios)

```tsx
{formState.errors.root && (
  <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-fade-in">
    <Icon icon="lucide:alert-circle" className="size-4 shrink-0" />
    <span>{formState.errors.root.message}</span>
  </div>
)}
```

### Icon Circles (para estados vacíos, errores, páginas de estado)

```tsx
<div className="size-14 rounded-full bg-accent/10 flex items-center justify-center">
  <Icon icon="lucide:inbox" className="size-7 text-accent" />
</div>
```

Variante para errores:

```tsx
<div className="size-14 rounded-full bg-danger/10 flex items-center justify-center">
  <Icon icon="lucide:alert-triangle" className="size-7 text-danger" />
</div>
```

### Buttons

| Variant | Uso |
|---------|-----|
| `variant="primary"` | Acción principal. Siempre con icono. |
| `variant="secondary"` | Acción secundaria (ej. Editar) |
| `variant="tertiary"` | **Cancelar** en modales y AlertDialogs |
| `variant="danger"` | Eliminar, acciones destructivas |
| `variant="ghost"` | Acciones sutiles (refresh, toggle) |

### Modals

```tsx
<Modal.Dialog className="animate-scale-in">  {/* ← animación de entrada */}
<Modal.Heading className="font-display">     {/* ← font-display */}
```

### Empty States

```tsx
<EmptyState
  icon="lucide:inbox"
  title="No se encontraron elementos"
  description="Descripción opcional"
  action={<Button variant="primary">Crear</Button>}
/>
```

---

## Responsive Design

### Breakpoints (Tailwind v4)

| Prefix | Min-width | Target |
|--------|-----------|--------|
| `sm` | 640px | Tablets pequeñas |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |

### Auth Layout (Sidebar + Topbar)

**Desktop (`lg+`):**

```
+------------+------------------------------------+
| Sidebar    | Topbar (breadcrumb + user avatar)  |
| w-60, fijo |                                    |
|            | Main content (overflow-auto)       |
+------------+------------------------------------+
```

- Sidebar: `hidden lg:flex` — siempre visible, fijo a la izquierda
- Topbar: breadcrumb completo, avatar con nombre+rol+chevron
- Main padding: `p-4 sm:p-6`

**Mobile (`<lg`):**

```
+------------------------------------+
| [=] Título página  [tema] [avatar] |
+------------------------------------+
| Main content                        |
+------------------------------------+
```

- Sidebar: oculto por defecto, se abre como drawer con hamburguesa
- Drawer: `fixed inset-y-0 left-0 z-50 w-60` con overlay `bg-black/50`
- Animación de entrada: `animate-slide-in-left`
- Backdrop: `animate-fade-in`
- Cerrar al: tocar backdrop, navegar a un link, cambiar de ruta
- Topbar: hamburguesa `lg:hidden`, breadcrumb compacto (solo nombre de página)
- Avatar: solo la inicial (sin nombre/rol/chevron)

### Sidebar Drawer

```tsx
// Estructura del drawer (sidebar.tsx)
{isOpen && (
  <div className="fixed inset-0 z-40 animate-fade-in lg:hidden" onClick={onClose}>
    <div className="absolute inset-0 bg-black/50" />
  </div>
)}
<aside className={`fixed inset-y-0 left-0 z-50 w-60 ... animate-slide-in-left lg:hidden ${isOpen ? '' : 'hidden'}`}>
  {navContent}
</aside>
```

El drawer se cierra automáticamente en `layout.tsx`:

```tsx
useEffect(() => { setSidebarOpen(false); }, [pathname]);
```

### Public Layout (Login/Register)

**Desktop (`lg+`):**

```
+----------------------+----------------------+
| Brand Panel (45%)    | Form Panel (55%)     |
| bg-[#0c0c0a]         | bg-background        |
| Logo + tagline       | Login/Register form  |
+----------------------+----------------------+
```

**Mobile (`<lg`):**

- Brand panel: `hidden lg:flex` — se oculta completamente
- Form panel: `flex-1` ocupa todo el ancho
- Animación: `animate-fade-in-up` en el contenedor del form

### Card Grids

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
```

| Dispositivo | Columnas |
|-------------|----------|
| Mobile (<640px) | 1 columna |
| Tablet pequeña (640+) | 2 columnas |
| Desktop (1024+) | 3-4 columnas |

### Form Layouts

Campos agrupados horizontalmente usan CSS Grid, no Flex:

```tsx
<div className="grid grid-cols-2 gap-4">
  <FormField ... />  {/* Peso */}
  <FormField ... />  {/* Altura */}
</div>
```

### Topbar Breadcrumb

```tsx
// Desktop: breadcrumb completo
<div className="hidden sm:block min-w-0 truncate">
  <Breadcrumb />
</div>

// Mobile: solo nombre de la página actual
<div className="block sm:hidden min-w-0 truncate">
  <Breadcrumb variant="compact" />
</div>
```

---

## UI Component Catalog

| Componente | Ubicación | Props principales |
|------------|-----------|-------------------|
| `ThemeToggle` | `src/components/ui/theme-toggle.tsx` | Ninguno. Alterna dark/light. |
| `Breadcrumb` | `src/components/ui/breadcrumb.tsx` | `variant: 'full' \| 'compact'` |
| `EmptyState` | `src/components/layout/empty-state.tsx` | `icon`, `title`, `description?`, `action?` |
| `BrandPanel` | `src/app/(public)/_components/brand-panel.tsx` | Ninguno. Panel izquierdo de login. |
| `FormField` | `src/components/form/form-field.tsx` | `control`, `name`, `label`, `type?`, `placeholder?`, `required?`, `isDisabled?` |
| `DataTable` | `src/components/data-table/data-table.tsx` | `columns`, `data`, `page`, `totalPages`, `onPageChange`, `isLoading?`, `emptyMessage?` |
| `Pagination` | `src/components/data-table/pagination.tsx` | `page`, `totalPages`, `onChange` |
| `RefreshButton` | `src/components/data-table/refresh-button.tsx` | `queryKey` |
| `RoleGuard` | `src/components/ui/role-guard.tsx` | `roles: Role \| Role[]`, `fallback?` |

---

## Patrón de página estándar (para nuevos módulos)

```tsx
'use client';

import { Card, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { RefreshButton } from '@/components/data-table/refresh-button';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { EmptyState } from '@/components/layout/empty-state';

export function NewFeature() {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold tracking-tight">Título</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKey={['entity']} />
          <Button variant="primary">
            <Icon icon="lucide:plus" className="size-4" />
            Nuevo
          </Button>
        </div>
      </div>

      <DataTable
        columns={...}
        data={...}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No se encontraron elementos"
      />
    </div>
  );
}
```

---

## Animaciones y UI en español

- Todo texto visible al usuario debe estar en español
- Excepciones técnicas: `Email`, `Token`, `JWT`, `Dashboard`, nombres de componentes y clases CSS
- Los iconos usan `@iconify/react` con prefijo `lucide:`
