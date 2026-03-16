# CLAUDE.md — better-mock-server

## Project Overview

A lightweight TypeScript mock server library built on [unjs/h3](https://github.com/unjs/h3), providing type-safe APIs for creating HTTP mock servers in development and testing scenarios.

## Tech Stack

- **Language**: TypeScript (strict mode, ESNext target)
- **Core Dependency**: h3 v2.0.1-rc.5
- **Build**: tsdown (outputs ESM + CJS + d.ts to `dist/`)
- **Test**: vitest
- **Lint**: eslint (`@king-3/eslint-config`)
- **Format**: prettier (`@king-3/prettier-config`)
- **Package**: ESM-first (`"type": "module"`), dual format exports

## Commands

- `pnpm test` — Run tests (vitest)
- `pnpm build` — Build via `tsx scripts/build.ts`
- `pnpm lint` / `pnpm lint:fix` — Lint
- `pnpm format` — Format with prettier
- `pnpm play` — Run playground demo
- `pnpm release` — Version bump via bumpp

## Project Structure

```
src/
  index.ts        — Public API exports
  server.ts       — createApp(), createAppServer()
  routes.ts       — defineRoutes(), parseRoutes(), registerRoutes()
  middlewares.ts  — defineMiddleware(), parseMiddlewares(), registerMiddlewares()
  plugins.ts      — definePlugin(), registerPlugins()
  util.ts         — joinPaths(), buildServerUrl(), type guards
  constants.ts    — HTTP method constants (GET/POST/PUT/PATCH/DELETE)
types/            — TypeScript type definitions (routes, middlewares, server, plugins)
test/             — Vitest test files mirroring src/ modules
playground/       — Example usage
scripts/          — Custom build script
```

## Path Aliases

- `#/*` → project root (`./`)
- `#types/*` → `./types/*`

Configured in both `tsconfig.json` and `package.json` imports.

## Architecture & Conventions

- Each module follows a **define → parse → register** pattern (e.g., `defineRoutes` → `parseRoutes` → `registerRoutes`)
- Routes support nesting via `children` and method-specific handlers (GET/POST/PUT/PATCH/DELETE)
- Middlewares support global, route-specific, and method-restricted scopes
- `createAppServer()` returns a synchronous `AppServer` object with `listen()`, `close()`, and `restart()` for lifecycle management
- `listen()` auto-closes the previous server if called again; `restart()` preserves the last-used port by default

## Coding Style

- Use `type` imports for type-only imports (`import type ...`)
- Prefer functional style; avoid classes
- Keep modules small and focused on a single responsibility
- Export helpers with `define*` prefix for type-safe configuration (defineRoutes, defineMiddleware, definePlugin)

## Git Workflow

- Main branch: `main`
- Development branch: `dev`
- Commit messages: use conventional commits with emoji prefixes (e.g., `♻️ refactor:`, `chore:`)
