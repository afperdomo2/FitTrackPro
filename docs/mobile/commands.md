# Mobile — Commands

## Development

```bash
pnpm dev:mobile             # Expo dev server (web)
pnpm --filter mobile start  # same, via pnpm filter
pnpm --filter mobile web    # expo start --web
```

## Native

```bash
cd apps/mobile && npx expo start --ios      # iOS simulator (macOS only)
cd apps/mobile && npx expo start --android  # Android emulator
pnpm --filter mobile android                # via pnpm
pnpm --filter mobile ios                    # via pnpm
```

## Build & Deploy

```bash
pnpm build:mobile            # expo export --platform web
pnpm --filter mobile build

pnpm deploy:mobile            # expo export --platform web
pnpm --filter mobile deploy:web
```
