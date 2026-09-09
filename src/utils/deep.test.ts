import { describe, expect, it } from 'vitest'
import { deepClone, deepMerge } from './deep'

describe('deepMerge', () => {
  it('overwrites array values by index and keeps leftover defaults', () => {
    const merged = deepMerge(['#aaa', '#bbb'], ['#111'])
    expect(merged).toEqual(['#111', '#bbb'])
  })

  it('does not mutate the default object', () => {
    const defaults = { color: ['#a', '#b'], width: 1 }
    const clone = deepClone(defaults)
    deepMerge(defaults, { width: 2 })
    expect(defaults).toEqual(clone)
  })
})
