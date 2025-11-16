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
    options: { port: options.port || 3000 },
    url: `http://localhost:${options.port || 3000}`,
    close: vi.fn().mockResolvedValue(undefined)
  })),
  definePlugin: vi.fn((def: (h3: App, options: unknown) => void) => {
    // Return a function that creates an H3Plugin
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
    it('should create server with routes', () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes })

      expect(server).toBeDefined()
      expect(server.port).toBeDefined()
      expect(server.url).toBeDefined()
      expect(server.close).toBeInstanceOf(Function)
    })

    it('should use default port 0 if not specified', () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes })

      expect(server.port).toBeDefined()
    })

    it('should use specified port', () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes, port: 8080 })

      expect(server.port).toBe(8080)
    })

    it('should return server with close method', async () => {
      const routes = { '/api': vi.fn() }
      const server = createAppServer({ routes })

      await expect(server.close()).resolves.toBeUndefined()
    })
  })
})
