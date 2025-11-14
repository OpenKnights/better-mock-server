/**
 * 判断是否为对象
 */
export const isObject = (value: unknown): value is object => {
  return !!value && value.constructor === Object
}

/**
 * 判断是否为数组
 */
export const isArray = Array.isArray

/**
 * 判断是否为空数组
 */
export const isEmptyArray = (value: unknown): value is undefined | null | [] =>
  value === undefined ||
  value === null ||
  !Array.isArray(value) ||
  value.length === 0

/**
 * 拼接路径
 */
export function joinPaths(...paths: string[]): string {
  return (
    paths.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/\/$/, '') ||
    '/'
  )
}

/**
 * 判断是否为包含 handler 的配置对象
 *
 * @template T - 配置对象类型，必须包含 handler 属性
 * @param config - 待检查的值
 * @returns 是否为有效的 handler 配置对象
 *
 * @example
 * ```ts
 * const config = { handler: () => {}, route: '/api' }
 * if (isHandlerConfig<MiddlewareConfig>(config)) {
 *   // config 的类型被收窄为 MiddlewareConfig
 *   console.log(config.handler)
 * }
 * ```
 */

// eslint-disable-next-line typescript/no-unsafe-function-type
export const isHandlerConfig = <T extends { handler: Function }>(
  config: unknown
): config is T => {
  return (
    isObject(config) &&
    'handler' in config &&
    typeof (config as T).handler === 'function'
  )
}
