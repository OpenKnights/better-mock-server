import type { H3Plugin } from 'h3'

/**
 * Array of H3 plugins to be registered with the application.
 *
 * Plugins are registered in the order they appear in the array
 * and provide a way to extend the server's functionality at the
 * application level.
 *
 * Each plugin should be created using the `definePlugin` function
 * from H3 (or the re-exported version from this library).
 *
 * @see {@link https://h3.unjs.io/guide/plugins|H3 Plugin Documentation}
 */
type Plugins = H3Plugin[]

export { Plugins }
