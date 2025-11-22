import type { App } from '#types/server'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createApp, createAppServer } from '../src/server'

// Mock H3 and dependencies
vi.mock('h3', () => ({
  H3: vi.fn(() => ({
    use: vi.fn(),
    register: vi.fn(),
    all: vi.fn(),
    on: vi.fn()
  })),
  serve: vi.fn((app, options) => ({
    options,
    url: `${options.protocol ?? 'http'}://${options.hostname ?? 'localhost'}:${options.port ?? 3000}`,
    ready: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined)
  })),
  definePlugin: vi.fn((def: (h3: App, options: unknown) => void) => {
    return ((opts?: any) => (h3: App) => def(h3, opts)) as any
  })
}))

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createApp', () => {
    it('should create H3 app instance', () => {
      const app = createApp({ routes: {} })
      expect(app).toBeDefined()
    })

    it('should accept routes, middlewares, and plugins', () => {
      const routes = { '/api': vi.fn() }
      const middlewares = [vi.fn()]
      const plugins = [{ name: 'test', setup: vi.fn() }]

      const app = createApp({ routes, middlewares, plugins: plugins as any })
      expect(app).toBeDefined()
    })
  })

  describe('createAppServer', () => {
    it('should create server instance without autoListen', () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes })

      expect(server).toBeDefined()
      expect(server.listen).toBeInstanceOf(Function)
      expect(server.close).toBeInstanceOf(Function)

      // Not listening yet
      expect(server.port).toBeUndefined()
      expect(server.url).toBeUndefined()
      expect(server.raw).toBeUndefined()
    })

    it('should use default port 0 when no port is provided (random port)', async () => {
      const server = createAppServer({ routes: {} })

      await server.listen()

      expect(server.raw).toBeDefined()
      expect(server.port).toBeDefined()
      expect(server.url).toBeDefined()
    })

    it('should listen on specified port', async () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes, port: 8080 })

      await server.listen()

      expect(server.port).toBe(8080)
      expect(server.url).toContain('8080')
    })

    it('should autoListen when enabled', async () => {
      const server = await createAppServer({
        routes: { '/api': vi.fn() },
        autoListen: true,
        port: 5050
      })

      expect(server.raw).toBeDefined()
      expect(server.port).toBe(5050)
      expect(server.url).toContain('5050')
    })

    it('should close server correctly', async () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes })

      await server.listen()

      await expect(server.close()).resolves.toBeUndefined()
      expect(server.raw).toBeUndefined()
      expect(server.port).toBeUndefined()
      expect(server.url).toBeUndefined()
    })
  })
})
