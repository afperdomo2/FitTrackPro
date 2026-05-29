# Mobile — Rules

## Framework

- **Expo SDK 56** (expo ~56.0.8) with React 19.2.3 and React Native 0.85.3.
- **Breaking changes** — read versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing code.

## TypeScript

- Extends `expo/tsconfig.base`. Strict mode enabled.
- TS version: ~6.0.3 (may differ from web).

## Architecture

See `docs/mobile/architecture.md` for folder layout, entrypoint flow, and naming conventions.

## Linting

- **No lint setup configured yet.**

## Gotchas

- React version differs from web (19.2.3 vs 19.2.4). Do not alias or assume same behavior.
- `app.json` controls platform-specific settings (iOS, Android, web).
- Native builds require macOS (iOS) or Android Studio (Android).
