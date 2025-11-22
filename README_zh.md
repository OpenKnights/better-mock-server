# better-mock-server

> 一个基于 [unjs/h3](https://github.com/unjs/h3) 构建的 TypeScript 优先的 mock 服务器库,为开发和测试提供优雅且类型安全的 HTTP mock 服务器创建方式。

[![npm version](https://img.shields.io/npm/v/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![npm downloads](https://img.shields.io/npm/dm/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![bundle size](https://img.shields.io/bundlephobia/minzip/better-mock-server.svg)](https://bundlephobia.com/package/better-mock-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## ✨ 特性

- 🎯 **类型安全**: 完整的 TypeScript 支持和全面的类型定义
- 🚀 **基于 H3**: 利用强大且精简的 H3 框架
- 🎨 **优雅 API**: 清晰直观的配置语法
- 🔧 **灵活路由**: 支持嵌套路由和多种 HTTP 方法
- 🔌 **中间件支持**: 轻松注册中间件,支持路由特定选项
- 🧩 **插件系统**: 通过 H3 的插件架构进行扩展
- 📦 **零配置**: 开箱即用,具有合理的默认值
- ⚡ **自动监听**: 可选的自动服务器启动,基于 Promise 的 API

## 📦 安装

```bash
npm install better-mock-server h3
```

## 🚀 快速开始

### 基本用法

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
console.log(`服务器运行在 ${server.url}`)

// 稍后:关闭服务器
await server.close()
```

### 自动启动服务器

```typescript
import { createAppServer } from 'better-mock-server'

// 服务器自动启动并返回一个 promise
const server = await createAppServer({
  port: 3000,
  autoListen: true,
  routes: {
    '/api/hello': (event) => {
      return { message: 'Hello World!' }
    }
  }
})

console.log(`服务器运行在 ${server.url}`)
```

### 随机端口

```typescript
// 使用端口 0 进行自动端口分配
const server = await createAppServer({
  port: 0,
  autoListen: true,
  routes: {
    '/api/ping': () => 'pong'
  }
})

console.log(`服务器运行在 ${server.url}`) // 例如: http://localhost:54321/
console.log(`端口: ${server.port}`) // 例如: 54321
```

## 🎯 核心概念

### 路由

路由定义 HTTP 端点及其处理程序。你可以使用简单的处理程序或详细的路由配置。

#### 简单处理程序(所有方法)

```typescript
const routes = {
  '/api/ping': (event) => 'pong'
}
```

#### 特定方法处理程序

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

#### 嵌套路由

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

#### 路由选项

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

### 中间件

中间件是在路由处理程序之前运行的函数,对于日志记录、身份验证、CORS 等非常有用。

#### 全局中间件

```typescript
const middlewares = [
  (event, next) => {
    console.log(`${event.method} ${event.path}`)
    return next()
  }
]
```

#### 路由特定中间件

```typescript
const middlewares = [
  {
    route: '/api',
    handler: (event, next) => {
      console.log('访问 API 路由')
      return next()
    }
  }
]
```

#### 带选项的中间件

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

### 插件

插件使用 H3 的插件系统扩展服务器的功能。

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

## 📚 API 参考

### 服务器函数

#### `createAppServer(options)`

创建并可选地启动一个配置好的 HTTP 服务器应用程序。

**参数:**

- `options.routes` (必需): 路由配置
- `options.middlewares` (可选): 中间件数组
- `options.plugins` (可选): 插件数组
- `options.port` (可选): 端口号(默认: 0 表示随机端口)
- `options.hostname` (可选): 主机名(默认: 'localhost')
- `options.protocol` (可选): 协议(默认: 'http')
- `options.autoListen` (可选): 自动启动服务器(默认: false)

**返回值:**

- 当 `autoListen` 为 `false` 或省略时: `AppServer` 对象
- 当 `autoListen` 为 `true` 时: `Promise<AppServer>`,在服务器就绪时解析

**AppServer 属性:**

- `raw`: 原始 H3 服务器实例
- `app`: H3 应用程序实例
- `port`: 服务器端口号(`listen()` 后可用)
- `url`: 服务器 URL(`listen()` 后可用)
- `listen(port?)`: 启动服务器的异步函数
- `close()`: 关闭服务器的异步函数

**示例:**

```typescript
// 手动启动
const server = createAppServer({
  port: 3000,
  routes: {
    '/api/hello': () => 'Hello'
  }
})

await server.listen()
console.log(`运行在 ${server.url}`)

// 或在监听时覆盖端口
await server.listen(4000)

// 自动启动
const server = await createAppServer({
  port: 3000,
  autoListen: true,
  routes: {
    '/api/hello': () => 'Hello'
  }
})

console.log(`运行在 ${server.url}`)

// 随机端口自动启动
const server = await createAppServer({
  port: 0, // 随机可用端口
  autoListen: true,
  routes: {
    '/api/test': () => 'Test'
  }
})

console.log(`服务器在端口 ${server.port} 上启动`)

// 清理
await server.close()
```

#### `createApp(options)`

创建一个 H3 应用程序实例而不启动服务器。当你想与现有服务器设置集成时很有用。

**参数:**

- `options.routes` (可选): 路由配置
- `options.middlewares` (可选): 中间件数组
- `options.plugins` (可选): 插件数组

**返回值:** H3 应用程序实例

**示例:**

```typescript
import { createApp } from 'better-mock-server'
import { serve } from 'h3'

const app = createApp({
  routes: {
    '/api/hello': () => 'Hello'
  }
})

// 使用你自己的服务器配置
const server = serve(app, { port: 4000 })
await server.ready()
console.log(`服务器运行在 ${server.url}`)
```

### 路由函数

#### `defineRoutes(routes)`

提供类型安全的路由定义和 IDE 自动补全。

**示例:**

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

将嵌套的路由结构解析为扁平的路由定义数组。主要供内部使用。

**参数:**

- `routes`: 路由配置对象
- `basePath` (可选): 嵌套路由的基础路径

**返回值:** 解析后的路由对象数组

#### `registerRoutes(app, routes?)`

将路由注册到 H3 应用程序实例。

**参数:**

- `app`: H3 应用程序实例
- `routes` (可选): 路由配置

### 中间件函数

#### `defineMiddleware(input)`

定义具有类型安全的中间件。接受函数或配置对象。

**示例:**

```typescript
import { defineMiddleware } from 'better-mock-server'

// 使用函数
const mw1 = defineMiddleware((event, next) => {
  console.log('中间件')
  return next()
})

// 使用配置
const mw2 = defineMiddleware({
  route: '/api',
  handler: (event, next) => next(),
  options: { method: 'POST' }
})
```

#### `parseMiddlewares(middlewares)`

将中间件配置解析为标准化的元组格式。主要供内部使用。

**参数:**

- `middlewares`: 中间件函数或配置数组

**返回值:** 解析后的中间件元组数组

#### `registerMiddlewares(app, middlewares?)`

将中间件注册到 H3 应用程序实例。

**参数:**

- `app`: H3 应用程序实例
- `middlewares` (可选): 中间件数组

### 插件函数

#### `definePlugin`

为方便起见重新导出 H3 的 `definePlugin`。

**示例:**

```typescript
import { definePlugin } from 'better-mock-server'

const myPlugin = definePlugin((h3, _options) => {
  // 插件设置
})
```

#### `registerPlugins(app, plugins?)`

将插件注册到 H3 应用程序实例。

**参数:**

- `app`: H3 应用程序实例
- `plugins` (可选): 插件数组

### 工具函数

#### `buildServerUrl(protocol, hostname, port?)`

从协议、主机名和可选端口构建服务器 URL 字符串。
自动规范化协议(如果不存在则添加 ':')。

**参数:**

- `protocol`: 协议字符串(例如 'http'、'https'、'http:'、'https:')
- `hostname`: 主机名或 IP 地址
- `port` (可选): 端口号或字符串

**返回值:** 完整的 URL 字符串

**示例:**

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

将多个路径段连接成一个规范化的路径。

**示例:**

```typescript
import { joinPaths } from 'better-mock-server'

joinPaths('/api', 'users') // '/api/users'
joinPaths('/api/', '/users/') // '/api/users'
joinPaths('api', '', 'users') // 'api/users'
```

## 📝 类型定义

### 路由类型

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

### 中间件类型

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

### 服务器类型

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

## 💡 完整示例

```typescript
import {
  createAppServer,
  defineMiddleware,
  definePlugin
} from 'better-mock-server'
import { readBody } from 'h3'

// 定义日志中间件
const logger = defineMiddleware((event, next) => {
  console.log(`[${new Date().toISOString()}] ${event.method} ${event.path}`)
  return next()
})

// 定义自定义插件
const corsPlugin = definePlugin((h3, _options) => {
  // CORS 设置逻辑
})

// 使用完整配置创建服务器
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
    '/': () => '欢迎使用 Better Mock Server!',

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
            { id: 1, title: '第一篇文章', content: 'Hello World' },
            { id: 2, title: '第二篇文章', content: 'TypeScript 很棒' }
          ]
        }
      }
    }
  }
})

console.log(`🚀 服务器运行在 ${server.url}`)

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n👋 正在关闭...')
  await server.close()
  process.exit(0)
})
```

## ✅ 最佳实践

1. **使用 `autoListen` 快速设置**: 启用 `autoListen: true` 用于快速开发和测试:

   ```typescript
   const server = await createAppServer({
     port: 3000,
     autoListen: true,
     routes: {
       /* ... */
     }
   })
   ```

2. **使用端口 0 进行测试**: 让系统自动分配可用端口:

   ```typescript
   const server = await createAppServer({
     port: 0, // 随机端口
     autoListen: true,
     routes: {
       /* ... */
     }
   })
   console.log(`测试服务器运行在端口 ${server.port}`)
   ```

3. **使用 `defineRoutes` 获得类型安全**: 始终使用 `defineRoutes()` 包装你的路由以获得更好的 IDE 支持和类型检查。

4. **顺序很重要**: 中间件和路由按照它们出现的顺序注册。将全局中间件放在路由特定中间件之前。

5. **异步处理程序**: 处理请求体或异步操作时,始终使用异步处理程序:

   ```typescript
   ;async (event) => {
     const body = await readBody(event)
     return body
   }
   ```

6. **错误处理**: 使用 H3 的错误处理工具:

   ```typescript
   import { createError } from 'h3'
   ;(event) => {
     throw createError({
       statusCode: 404,
       message: '用户未找到'
     })
   }
   ```

7. **路径参数**: 通过 `event.context.params` 访问路由参数:

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

8. **嵌套路由**: 使用 `children` 属性以获得更好的组织:

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

9. **手动 vs 自动启动**: 根据你的使用场景选择合适的模式:

   ```typescript
   // 手动启动 - 更多控制
   const server = createAppServer({ routes })
   // ... 进行设置 ...
   await server.listen()

   // 自动启动 - 更简单
   const server = await createAppServer({ routes, autoListen: true })
   ```

## ⚠️ 约束和限制

- 该库基于 H3 构建,因此适用所有 H3 的限制
- 路由定义必须在服务器启动时已知(不支持动态路由注册)
- 中间件执行顺序遵循注册顺序
- 端口 0 将分配一个随机可用端口
- 使用 `autoListen: true` 时,`createAppServer` 返回一个必须等待的 Promise

## 📄 许可证

[MIT](./LICENSE) 许可证 © 2025-至今 [king3](https://github.com/coderking3)

## 🤝 贡献

欢迎贡献、问题和功能请求!

请随时查看 [issues 页面](https://github.com/OpenKnights/better-mock-server/issues)。

## 🔗 相关项目

- [unjs/h3](https://github.com/unjs/h3) - 精简的 H3 HTTP 框架
- [unjs/srvx](https://github.com/unjs/srvx) - 基于 Web 标准的通用服务器
- [unjs](https://unjs.io) - 统一的 JavaScript 工具
