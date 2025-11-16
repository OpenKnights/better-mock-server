# better-mock-server

> 一个基于 [unjs/h3](https://github.com/unjs/h3) 构建的 TypeScript 现代化模拟服务库, 为开发和测试提供优雅且类型安全的 HTTP 模拟服务创建方式。

[![npm version](https://img.shields.io/npm/v/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![npm downloads](https://img.shields.io/npm/dm/better-mock-server.svg)](https://www.npmjs.com/package/better-mock-server)
[![bundle size](https://img.shields.io/bundlephobia/minzip/better-mock-server.svg)](https://bundlephobia.com/package/better-mock-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## ✨ 特性

- 🎯 **类型安全**: 完整的 TypeScript 支持和全面的类型定义
- 🚀 **基于 H3**: 利用强大而精简的 H3 框架
- 🎨 **优雅的 API**: 简洁直观的配置语法
-
- 🔧 **灵活的路由**: 支持嵌套路由和多种 HTTP 方法
- 🔌 **中间件支持**: 轻松注册中间件,支持路由特定选项
- 🧩 **插件系统**: 通过 H3 的插件架构实现可扩展性
- 📦 **零配置**: 开箱即用,具有合理的默认设置

## 📦 安装

```bash
npm install better-mock-server h3
```

```bash
pnpm add better-mock-server h3
```

```bash
yarn add better-mock-server h3
```

## 🚀 快速开始

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

console.log(`服务运行在 ${server.url}`)

// 稍后: 关闭服务
await server.close()
```

## 🎯 核心概念

### 路由

路由定义 HTTP 端点及其处理器。您可以使用简单的处理器或详细的路由配置。

#### 简单处理器(所有方法)

```typescript
const routes = {
  '/api/ping': (event) => 'pong'
}
```

#### 特定方法处理器

```typescript
const routes = {
  '/api/users': {
    GET: (event) => [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
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
    GET: (event) => 'API 根路径',
    children: {
      '/users': {
        GET: (event) => '用户列表',
        children: {
          '/:id': {
            GET: (event) => `获取用户 ${event.context.params.id}`,
            DELETE: (event) => `删除用户 ${event.context.params.id}`
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
      handler: (event) => '元信息',
      options: {
        meta: { name: 'king3' }
      }
    }
  }
}
```

### 中间件

中间件是在路由处理器之前运行的函数,用于日志记录、身份验证、CORS 等。

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

插件使用 H3 的插件系统扩展服务的功能。

```typescript
import { definePlugin } from 'better-mock-server'

const loggerPlugin = definePlugin((h3, _options) => {
  if (h3.config.debug) {
    h3.use((req) => {
      console.log(`[${req.method}] ${req.url}`)
    })
  }
})

const server = createAppServer({
  routes: {
    /* ... */
  },
  plugins: [loggerPlugin]
})
```

## 📚 API 参考

### 创建服务函数

#### `createAppServer(options)`

创建并启动配置好的 HTTP 服务器应用。

**参数:**

- `options.routes` (必需): 路由配置
- `options.middlewares` (可选): 中间件数组
- `options.plugins` (可选): 插件数组
- `options.port` (可选): 端口号(默认: 0 表示随机端口)

**返回:** `AppServer` 对象,包含:

- `raw`: 原始 H3 服务器实例
- `port`: 服务器端口号
- `url`: 服务器 URL
- `close()`: 关闭服务器的异步函数

**示例:**

```typescript
const server = createAppServer({
  port: 3000,
  routes: {
    '/api/hello': () => 'Hello'
  },
  middlewares: [
    (event, next) => {
      console.log('收到请求')
      return next()
    }
  ]
})

console.log(`运行在 ${server.url}`)
await server.close()
```

#### `createApp(options)`

创建 H3 应用实例而不启动服务。当您想要与现有服务设置集成时很有用。

**参数:**

- `options.routes` (可选): 路由配置
- `options.middlewares` (可选): 中间件数组
- `options.plugins` (可选): 插件数组

**返回:** H3 应用实例

**示例:**

```typescript
import { createApp } from 'better-mock-server'
import { serve } from 'h3'

const app = createApp({
  routes: {
    '/api/hello': () => 'Hello'
  }
})

// 使用您自己的服务器配置
const server = serve(app, { port: 4000 })
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

将嵌套路由结构解析为扁平的路由定义数组。主要供内部使用。

**参数:**

- `routes`: 路由配置对象
- `basePath` (可选): 嵌套路由的基础路径

**返回:** 解析后的路由对象数组

#### `registerRoutes(app, routes?)`

将路由注册到 H3 应用实例。

**参数:**

- `app`: H3 应用实例
- `routes` (可选): 路由配置

### 中间件函数

#### `defineMiddleware(input)`

定义类型安全的中间件。接受函数或配置对象。

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

**返回:** 解析后的中间件元组数组

#### `registerMiddlewares(app, middlewares?)`

将中间件注册到 H3 应用实例。

**参数:**

- `app`: H3 应用实例
- `middlewares` (可选): 中间件数组

### 插件函数

#### `definePlugin`

H3 的 `definePlugin` 的重新导出,为方便使用。

**示例:**

```typescript
import { definePlugin } from 'better-mock-server'

const myPlugin = definePlugin((h3, _options) => {
  // 插件设置
})
```

#### `registerPlugins(app, plugins?)`

将插件注册到 H3 应用实例。

**参数:**

- `app`: H3 应用实例
- `plugins` (可选): 插件数组

### 工具函数

#### `joinPaths(...paths)`

将多个路径段连接成规范化的路径。

**示例:**

```typescript
import { joinPaths } from 'better-mock-server'

joinPaths('/api', 'users') // '/api/users'
joinPaths('/api/', '/users/') // '/api/users'
joinPaths('api', '', 'users') // 'api/users'
```

#### `isObject(value)`

检查值是否为普通对象。

#### `isArray(value)`

检查值是否为数组(`Array.isArray` 的重新导出)。

#### `isEmptyArray(value)`

检查值是否为 undefined、null 或空数组。

#### `isHandlerConfig<T>(config)`

类型守卫,检查配置对象是否包含处理器函数。

### 常量

#### `HTTP_METHODS`

标准 HTTP 方法数组: `['GET', 'POST', 'PUT', 'PATCH', 'DELETE']`

#### `ALL_HTTP_METHOD`

特殊常量 `'ALL'`,用于匹配所有 HTTP 方法。

## 📝 类型定义

### 路由类型

```typescript
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
```

### 中间件类型

```typescript
interface MiddlewareConfig {
  route?: string
  handler: Middleware
  options?: MiddlewareOptions
}

type Middlewares = Array<Middleware | MiddlewareConfig>
```

### 服务器类型

```typescript
interface AppOptions {
  routes?: Routes
  middlewares?: Middlewares
  plugins?: Plugins
}

interface AppServerOptions extends AppOptions {
  routes: Routes
  port?: number
}

interface AppServer {
  raw: Server
  port: number | string
  url: string
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

// 创建完整配置的服务
const server = createAppServer({
  port: 3000,

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
            { id: 1, name: '张三', email: 'zhangsan@example.com' },
            { id: 2, name: '李四', email: 'lisi@example.com' }
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
                  name: `用户 ${id}`,
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
            { id: 1, title: '第一篇文章', content: '你好世界' },
            { id: 2, title: '第二篇文章', content: 'TypeScript 真棒' }
          ]
        }
      }
    }
  }
})

console.log(`🚀 服务运行在 ${server.url}`)

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n👋 正在关闭...')
  await server.close()
  process.exit(0)
})
```

## ✅ 最佳实践

1. **使用 `defineRoutes` 获得类型安全**: 始终使用 `defineRoutes()` 包装您的路由,以获得更好的 IDE 支持和类型检查。

2. **顺序很重要**: 中间件和路由按照它们出现的顺序注册。将全局中间件放在路由特定中间件之前。

3. **异步处理器**: 在处理请求体或异步操作时,始终使用异步处理器:

   ```typescript
   ;async (event) => {
     const body = await readBody(event)
     return body
   }
   ```

4. **错误处理**: 使用 H3 的错误处理工具:

   ```typescript
   import { createError } from 'h3'
   ;(event) => {
     throw createError({
       statusCode: 404,
       message: '未找到用户'
     })
   }
   ```

5. **路径参数**: 通过 `event.context.params` 访问路由参数:

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

6. **嵌套路由**: 使用 `children` 属性实现更好的组织:
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

## ⚠️ 约束与限制

- 该库基于 H3 构建,因此所有 H3 的限制都适用
- 路由定义必须在服务启动时已知(不支持动态路由注册)
- 中间件执行顺序遵循注册顺序
- 端口 0 将分配一个随机可用端口

## 📄 许可证

MIT 许可证 © 2025 [king3](https://github.com/OpenKnights)

## 🤝 贡献

欢迎贡献、提出问题和功能请求！

随时查看 [issues 页面](https://github.com/OpenKnights/storadapt/issues)。

## 🔗 相关项目

- [unjs/h3](https://github.com/unjs/h3) - 精简的 H3 HTTP 框架
- [unjs](https://unjs.io) - 统一的 JavaScript 工具集

## ⭐ 支持

如果这个项目对你有帮助，请给个 ⭐️！
