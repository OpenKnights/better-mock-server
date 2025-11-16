import type { Plugins } from '#types/plugins'
import type { App } from '#types/server'
import { definePlugin as defineH3Plugin } from 'h3'

import { isEmptyArray } from './util'

/**
 * Defines an H3 plugin with type safety.
 * This is a re-export of the h3 `definePlugin` function for convenience.
 */
const definePlugin = defineH3Plugin

/**
 * Registers all plugins to an H3 application instance.
 * Plugins are registered in the order they appear in the array.
 */
function registerPlugins(app: App, plugins?: Plugins): void {
  if (isEmptyArray(plugins)) return

  // Register each plugin to the app
  for (const plugin of plugins) {
    app.register(plugin)
  }
}

export { definePlugin, registerPlugins }
