# Mobile — Architecture

## Folder layout

```
apps/mobile/
├── App.tsx               # Main app component (UI root)
├── index.ts              # Entry point — calls registerRootComponent(App)
├── app.json              # Expo config (name, slug, icons, platform options)
├── assets/               # Icons, splash images, favicon
├── tsconfig.json          # TypeScript config extending expo/tsconfig.base
└── package.json           # Dependencies & scripts
```

## Entrypoint flow

1. `index.ts` is the native entry point — calls `registerRootComponent(App)`
2. `App.tsx` renders the UI tree (StatusBar + View/Text/StyleSheet for now)
3. Expo maps `main` field in package.json → `index.ts` (configured in `package.json`)

## Convention for new screens

| Type | Location | Example |
|------|----------|---------|
| Screen | `screens/<Name>.tsx` | `screens/HomeScreen.tsx` |
| Component | `components/<Name>.tsx` | `components/Button.tsx` |
| Hook | `hooks/use<Name>.ts` | `hooks/useAuth.ts` |
| Navigation | `navigation/` | react-navigation config |

> ⚠️ `navigation/` and `screens/` patterns are planned conventions. The scaffold has no routing yet.
