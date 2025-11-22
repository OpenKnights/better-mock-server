# better-mock-server

> A TypeScript-first mock server library built on top of [unjs/h3](https://github.com/unjs/h3), providing an elegant and type-safe way to create HTTP mock servers for development and testing.

[![npm version](https://img.shields.io/npm/v/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![npm downloads](https://img.shields.io/npm/dm/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![bundle size](https://img.shields.io/bundlephobia/minzip/better-mock-server.svg)](https://bundlephobia.com/package/better-mock-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## ✨ Features

- 🎯 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🚀 **Built on H3**: Leverages the powerful and minimal H3 framework
- 🎨 **Elegant API**: Clean and intuitive configuration syntax
- 🔧 **Flexible Routing**: Support for nested routes and multiple HTTP methods
- 🔌 **Middleware Support**: Easy middleware registration with route-specific options
- 🧩 **Plugin System**: Extensible through H3's plugin architecture
- 📦 **Zero Config**: Works out of the box with sensible defaults
- ⚡ **Auto Listen**: Optional automatic server startup with promise-based API

## 📦 Installation

```bash
npm install better-mock-server h3
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { createAppServer } from 'better-mock-server'

const server = createAppServer({
  port: 3000,
  routes: {
    '/api/hello': (event) => {
      return { message: 'Hello World!' }
    }
  }
})

await server.listen()
console.log(`Server running at ${server.url}`)

// Later: close the server
await server.close()
```

### Auto-Start Server

```typescript
import { createAppServer } from 'better-mock-server'

// Server starts automatically and returns a promise
const server = await createAppServer({
  port: 3000,
  autoListen: true,
  routes: {
    '/api/hello': (event) => {
      return { message: 'Hello World!' }
    }
  }
})

console.log(`Server running at ${server.url}`)
```

### Random Port

```typescript
// Use port 0 for automatic port assignment
const server = await createAppServer({
  port: 0,
  autoListen: true,
  routes: {
    '/api/ping': () => 'pong'
  }
})

console.log(`Server running at ${server.url}`) // e.g., http://localhost:54321/
console.log(`Port: ${server.port}`) // e.g., 54321
```

## 🎯 Core Concepts

### Routes

Routes define the HTTP endpoints and their handlers. You can use simple handlers or detailed route configurations.

#### Simple Handler (All Methods)

```typescript
const routes = {
  '/api/ping': (event) => 'pong'
}
```

#### Method-Specific Handlers

```typescript
const routes = {
  '/api/users': {
    GET: (event) => [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ],
    POST: async (event) => {
      const body = await readBody(event)
      return { id: 3, ...body }
    },
    DELETE: (event) => {
      return { success: true }
    }
  }
}
```

#### Nested Routes

```typescript
const routes = {
  '/api': {
    GET: (event) => 'API Root',
    children: {
      '/users': {
        GET: (event) => 'List users',
        children: {
          '/:id': {
            GET: (event) => `Get user ${event.context.params.id}`,
            DELETE: (event) => `Delete user ${event.context.params.id}`
          }
        }
      }
    }
  }
}
```

#### Route Options

```typescript
const routes = {
  '/api/meta': {
    GET: {
      handler: (event) => 'meta options',
      options: {
        meta: { name: 'king3' }
      }
    }
  }
}
```

### Middlewares

Middlewares are functions that run before route handlers, useful for logging, authentication, CORS, etc.

#### Global Middleware

```typescript
const middlewares = [
  (event, next) => {
    console.log(`${event.method} ${event.path}`)
    return next()
  }
]
```

#### Route-Specific Middleware

```typescript
const middlewares = [
  {
    route: '/api',
    handler: (event, next) => {
      console.log('API route accessed')
      return next()
    }
  }
]
```

#### Middleware with Options

```typescript
const middlewares = [
  {
    handler: (event, next) => next(),
    options: {
      method: 'POST'
    }
  }
]
```

### Plugins

Plugins extend the functionality of your server using H3's plugin system.

```typescript
import { definePlugin } from 'better-mock-server'

const loggerPlugin = definePlugin((h3, _options) => {
  if (h3.config.debug) {
    h3.use((req) => {
      console.log(`[${req.method}] ${req.url}`)
    })
  }
})

const server = await createAppServer({
  autoListen: true,
  routes: {
    /* ... */
  },
  plugins: [loggerPlugin]
})
```

## 📚 API Reference

### Server Functions

#### `createAppServer(options)`

Creates and optionally starts an HTTP server with the configured application.

**Parameters:**

- `options.routes` (required): Routes configuration
- `options.middlewares` (optional): Middlewares array
- `options.plugins` (optional): Plugins array
- `options.port` (optional): Port number (default: 0 for random port)
- `options.hostname` (optional): Hostname (default: 'localhost')
- `options.protocol` (optional): Protocol (default: 'http')
- `options.autoListen` (optional): Auto-start the server (default: false)

**Returns:**

- When `autoListen` is `false` or omitted: `AppServer` object
- When `autoListen` is `true`: `Promise<AppServer>` that resolves when server is ready

**AppServer Properties:**

- `raw`: Raw H3 server instance
- `app`: H3 application instance
- `port`: Server port number (available after `listen()`)
- `url`: Server URL (available after `listen()`)
- `listen(port?)`: Async function to start the server
- `close()`: Async function to close the server

**Examples:**

```typescript
// Manual start
const server = createAppServer({
  port: 3000,
  routes: {
    '/api/hello': () => 'Hello'
  }
})

await server.listen()
console.log(`Running at ${server.url}`)

// Or override port when listening
await server.listen(4000)

// Auto-start
const server = await createAppServer({
  port: 3000,
  autoListen: true,
  routes: {
    '/api/hello': () => 'Hello'
  }
})

console.log(`Running at ${server.url}`)

// Random port with auto-start
const server = await createAppServer({
  port: 0, // Random available port
  autoListen: true,
  routes: {
    '/api/test': () => 'Test'
  }
})

console.log(`Server started on port ${server.port}`)

// Clean up
await server.close()
```

#### `createApp(options)`

Creates an H3 application instance without starting a server. Useful when you want to integrate with existing server setup.

**Parameters:**

- `options.routes` (optional): Routes configuration
- `options.middlewares` (optional): Middlewares array
- `options.plugins` (optional): Plugins array

**Returns:** H3 application instance

**Example:**

```typescript
import { createApp } from 'better-mock-server'
import { serve } from 'h3'

const app = createApp({
  routes: {
    '/api/hello': () => 'Hello'
  }
})

// Use with your own server configuration
const server = serve(app, { port: 4000 })
await server.ready()
console.log(`Server running at ${server.url}`)
```

### Route Functions

#### `defineRoutes(routes)`

Provides type-safe route definitions with IDE auto-completion.

**Example:**

```typescript
import { defineRoutes } from 'better-mock-server'

const routes = defineRoutes({
  '/api/users': {
    GET: () => [],
    POST: async (event) => {
      const body = await readBody(event)
      return body
    }
  }
})
```

#### `parseRoutes(routes, basePath?)`

Parses nested route structures into a flat array of route definitions. Mainly for internal use.

**Parameters:**

- `routes`: Routes configuration object
- `basePath` (optional): Base path for nested routes

**Returns:** Array of parsed route objects

#### `registerRoutes(app, routes?)`

Registers routes to an H3 application instance.

**Parameters:**

- `app`: H3 application instance
- `routes` (optional): Routes configuration

### Middleware Functions

#### `defineMiddleware(input)`

Defines middleware with type safety. Accepts either a function or configuration object.

**Example:**

```typescript
import { defineMiddleware } from 'better-mock-server'

// With function
const mw1 = defineMiddleware((event, next) => {
  console.log('Middleware')
  return next()
})

// With config
const mw2 = defineMiddleware({
  route: '/api',
  handler: (event, next) => next(),
  options: { method: 'POST' }
})
```

#### `parseMiddlewares(middlewares)`

Parses middleware configurations into standardized tuple format. Mainly for internal use.

**Parameters:**

- `middlewares`: Array of middleware functions or configurations

**Returns:** Array of parsed middleware tuples

#### `registerMiddlewares(app, middlewares?)`

Registers middlewares to an H3 application instance.

**Parameters:**

- `app`: H3 application instance
- `middlewares` (optional): Middlewares array

### Plugin Functions

#### `definePlugin`

Re-export of H3's `definePlugin` for convenience.

**Example:**

```typescript
import { definePlugin } from 'better-mock-server'

const myPlugin = definePlugin((h3, _options) => {
  // Plugin setup
})
```

#### `registerPlugins(app, plugins?)`

Registers plugins to an H3 application instance.

**Parameters:**

- `app`: H3 application instance
- `plugins` (optional): Plugins array

### Utility Functions

#### `buildServerUrl(protocol, hostname, port?)`

Builds a server URL string from protocol, hostname, and optional port.
Automatically normalizes the protocol (adds ':' if not present).

**Parameters:**

- `protocol`: Protocol string (e.g., 'http', 'https', 'http:', 'https:')
- `hostname`: Hostname or IP address
- `port` (optional): Port number or string

**Returns:** Full URL string

**Examples:**

```typescript
import { buildServerUrl } from 'better-mock-server'

buildServerUrl('http', 'localhost', 3000)
// 'http://localhost:3000/'

buildServerUrl('https:', 'example.com', 443)
// 'https://example.com:443/'

buildServerUrl('http', '127.0.0.1')
// 'http://127.0.0.1/'

buildServerUrl('http', '::1', 8080)
// 'http://[::1]:8080/'
```

#### `joinPaths(...paths)`

Joins multiple path segments into a normalized path.

**Example:**

```typescript
import { joinPaths } from 'better-mock-server'

joinPaths('/api', 'users') // '/api/users'
joinPaths('/api/', '/users/') // '/api/users'
joinPaths('api', '', 'users') // 'api/users'
```

## 📝 Type Definitions

### Routes Types

```typescript
import type { EventHandler, RouteOptions } from 'h3'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type AllHTTPMethod = 'ALL'

interface RouteHandlerConfig {
  handler: EventHandler
  options?: RouteOptions
}

type RouteHandler = EventHandler | RouteHandlerConfig

interface RouteConfig {
  GET?: RouteHandler
  POST?: RouteHandler
  PUT?: RouteHandler
  PATCH?: RouteHandler
  DELETE?: RouteHandler
  children?: Routes
}

interface Routes {
  [route: string]: RouteHandler | RouteConfig
}

interface ParsedRoute {
  route: string
  method: HTTPMethod | AllHTTPMethod
  handler: EventHandler
  options?: RouteOptions
}
```

### Middleware Types

```typescript
import type { Middleware, MiddlewareOptions } from 'h3'

interface MiddlewareConfig {
  route?: string
  handler: Middleware
  options?: MiddlewareOptions
}

type Middlewares = Array<Middleware | MiddlewareConfig>

type ParsedMiddleware =
  | [Middleware]
  | [string, Middleware]
  | [Middleware, MiddlewareOptions]
  | [string, Middleware, MiddlewareOptions]
```

### 插件类型

```typescript
import type { H3Plugin } from 'h3'

type Plugins = H3Plugin[]
```

### Server Types

```typescript
import type { H3 as H3Instance, serve } from 'h3'
import type { ServerOptions } from 'srvx'

type Server = ReturnType<typeof serve>

type App = H3Instance

interface AppOptions {
  routes?: Routes
  middlewares?: Middlewares
  plugins?: Plugins
}

type srvxServerOptions = Omit<ServerOptions, 'fetch' | 'middleware' | 'plugins'>

interface AppServerOptions extends AppOptions, srvxServerOptions {
  routes: Routes
  autoListen?: boolean
}

interface AppServer {
  raw: Server | undefined
  app: App
  port: number | string | undefined
  url: string | undefined
  listen: (listenPort?: number) => Promise<void>
  close: () => Promise<void>
}
```

## 💡 Complete Example

```typescript
import {
  createAppServer,
  defineMiddleware,
  definePlugin
} from 'better-mock-server'
import { readBody } from 'h3'

// Define a logger middleware
const logger = defineMiddleware((event, next) => {
  console.log(`[${new Date().toISOString()}] ${event.method} ${event.path}`)
  return next()
})

// Define a custom plugin
const corsPlugin = definePlugin((h3, _options) => {
  // CORS setup logic
})

// Create server with full configuration
const server = await createAppServer({
  port: 3000,
  autoListen: true,

  plugins: [corsPlugin],

  middlewares: [
    logger,
    {
      route: '/api',
      handler: (event, next) => {
        event.context.apiAccess = true
        return next()
      }
    }
  ],

  routes: {
    '/': () => 'Welcome to Better Mock Server!',

    '/api': {
      GET: () => ({ version: '1.0.0' }),

      children: {
        '/users': {
          GET: () => [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' }
          ],

          POST: async (event) => {
            const body = await readBody(event)
            return {
              id: Date.now(),
              ...body,
              createdAt: new Date().toISOString()
            }
          },

          children: {
            '/:id': {
              GET: (event) => {
                const id = event.context.params.id
                return {
                  id,
                  name: `User ${id}`,
                  email: `user${id}@example.com`
                }
              },

              PUT: async (event) => {
                const id = event.context.params.id
                const body = await readBody(event)
                return {
                  id,
                  ...body,
                  updatedAt: new Date().toISOString()
                }
              },

              DELETE: (event) => {
                const id = event.context.params.id
                return {
                  success: true,
                  deletedId: id
                }
              }
            }
          }
        },

        '/posts': {
          GET: () => [
            { id: 1, title: 'First Post', content: 'Hello World' },
            { id: 2, title: 'Second Post', content: 'TypeScript is awesome' }
          ]
        }
      }
    }
  }
})

console.log(`🚀 Server running at ${server.url}`)

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...')
  await server.close()
  process.exit(0)
})
```

## ✅ Best Practices

1. **Use `autoListen` for Quick Setup**: Enable `autoListen: true` for rapid development and testing:

   ```typescript
   const server = await createAppServer({
     port: 3000,
     autoListen: true,
     routes: {
       /* ... */
     }
   })
   ```

2. **Use Port 0 for Testing**: Let the system assign an available port automatically:

   ```typescript
   const server = await createAppServer({
     port: 0, // Random port
     autoListen: true,
     routes: {
       /* ... */
     }
   })
   console.log(`Test server running on port ${server.port}`)
   ```

3. **Use `defineRoutes` for Type Safety**: Always wrap your routes with `defineRoutes()` for better IDE support and type checking.

4. **Order Matters**: Middlewares and routes are registered in the order they appear. Place global middlewares before route-specific ones.

5. **Async Handlers**: When working with request bodies or async operations, always use async handlers:

   ```typescript
   ;async (event) => {
     const body = await readBody(event)
     return body
   }
   ```

6. **Error Handling**: Use H3's error handling utilities:

   ```typescript
   import { createError } from 'h3'
   ;(event) => {
     throw createError({
       statusCode: 404,
       message: 'User not found'
     })
   }
   ```

7. **Path Parameters**: Access route parameters through `event.context.params`:

   ```typescript
   const routes = {
     '/:id': {
       GET: (event) => {
         const id = event.context.params.id
         return { id }
       }
     }
   }
   ```

8. **Nested Routes**: Use the `children` property for better organization:

   ```typescript
   const routes = {
     '/api': {
       children: {
         '/users': {
           /* ... */
         },
         '/posts': {
           /* ... */
         }
       }
     }
   }
   ```

9. **Manual vs Auto Start**: Choose the appropriate pattern for your use case:

   ```typescript
   // Manual start - more control
   const server = createAppServer({ routes })
   // ... do setup ...
   await server.listen()

   // Auto start - simpler
   const server = await createAppServer({ routes, autoListen: true })
   ```

## ⚠️ Constraints & Limitations

- The library is built on H3, so all H3 limitations apply
- Route definitions must be known at server startup (no dynamic route registration)
- Middleware execution order follows the registration order
- Port 0 will assign a random available port
- When using `autoListen: true`, `createAppServer` returns a Promise that must be awaited

## 📄 License

[MIT](./LICENSE) License © 2025-PRESENT [king3](https://github.com/coderking3)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/OpenKnights/better-mock-server/issues).

## 🔗 Related Projects

- [unjs/h3](https://github.com/unjs/h3) - Minimal H3 HTTP framework
- [unjs/srvx](https://github.com/unjs/srvx) - Universal Server based on web standards
- [unjs](https://unjs.io) - Unified JavaScript Tools
