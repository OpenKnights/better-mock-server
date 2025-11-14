import type { Plugins } from '#types/plugins'
import type { App } from '#types/server'
import { definePlugin as defineH3Plugin } from 'h3'

import { isEmptyArray } from './util'

/**
 * 定义插件
 */
const definePlugin = defineH3Plugin

/**
 * 注册中间件到 H3 应用
 */
function registerPlugins(app: App, plugins?: Plugins): void {
  if (isEmptyArray(plugins)) return

  // 直接展开数组传给 app.use()
  for (const plugin of plugins) {
    app.register(plugin)
  }
}

export { definePlugin, registerPlugins }
