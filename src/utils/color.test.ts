import { describe, expect, it } from 'vitest'
import { fade } from './color'

describe('fade', () => {
  it('applies 0-100 opacity to hex', () => {
    expect(fade('#ffffff', 50)).toMatch(/rgba\(\s*255,\s*255,\s*255,\s*0\.5\s*\)/)
  })
})
