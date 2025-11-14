import type {
  MiddlewareConfig,
  Middlewares,
  ParsedMiddleware
} from '#types/middlewares'
import type { App } from '#types/server'
import type { Middleware } from 'h3'
import { isEmptyArray, isHandlerConfig } from './util'

/**
 * 判断是否为 MiddlewareConfig 类型
 */
function isMiddlewareConfig(config: unknown): config is MiddlewareConfig {
  return isHandlerConfig<MiddlewareConfig>(config)
}

/**
 * 解析中间件配置为二维数组
 * 返回格式可以直接用于 app.use(...middleware)
 */
function parseMiddlewares(middlewares: Middlewares): ParsedMiddleware[] {
  const parsedMiddlewares: ParsedMiddleware[] = []

  for (const middleware of middlewares) {
    if (isMiddlewareConfig(middleware)) {
      // MiddlewareConfig 格式
      const { route, handler, options } = middleware

      if (route && options) {
        parsedMiddlewares.push([route, handler, options])
      } else if (route) {
        parsedMiddlewares.push([route, handler])
      } else if (options) {
        parsedMiddlewares.push([handler, options])
      } else {
        parsedMiddlewares.push([handler])
      }
    } else {
      // 直接的 Middleware 函数格式
      parsedMiddlewares.push([middleware])
    }
  }

  return parsedMiddlewares
}

/**
 * 定义中间件配置
 */
function defineMiddleware(middleware: Middleware): { handler: Middleware }
function defineMiddleware(config: MiddlewareConfig): MiddlewareConfig
function defineMiddleware(
  input: Middleware | MiddlewareConfig
): { handler: Middleware } | MiddlewareConfig {
  // 如果是函数，包装成对象
  if (typeof input === 'function') {
    return { handler: input }
  }

  // 如果是配置对象，直接返回
  return input
}

/**
 * 注册中间件到 H3 应用
 */
function registerMiddlewares(app: App, middlewares?: Middlewares): void {
  if (isEmptyArray(middlewares)) return

  const parsedMiddlewares = parseMiddlewares(middlewares)

  // 直接展开数组传给 app.use()
  for (const middleware of parsedMiddlewares) {
    // @ts-expect-error - 展开元组类型
    app.use(...middleware)
  }
}

export { defineMiddleware, parseMiddlewares, registerMiddlewares }
