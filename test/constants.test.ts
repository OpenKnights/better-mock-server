import { describe, expect, it } from 'vitest'
import { ALL_HTTP_METHOD, HTTP_METHODS } from '../src/constants'

describe('constants', () => {
  describe('HTTP_METHODS', () => {
    it('should contain all standard HTTP methods', () => {
      expect(HTTP_METHODS).toEqual(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    })

    it('should be an array', () => {
      expect(Array.isArray(HTTP_METHODS)).toBe(true)
    })

    it('should have length of 5', () => {
      expect(HTTP_METHODS).toHaveLength(5)
    })
  })

  describe('ALL_HTTP_METHOD', () => {
    it('should equal "ALL"', () => {
      expect(ALL_HTTP_METHOD).toBe('ALL')
    })
  })
})
