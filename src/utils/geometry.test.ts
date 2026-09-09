import { describe, expect, it } from 'vitest'
import { getPolylineLength, getCircleRadianPoint } from './geometry'

describe('geometry', () => {
  it('sums polyline segments', () => {
    expect(getPolylineLength([[0, 0], [3, 0], [3, 4]])).toBe(7)
  })

  it('returns a point on the circle', () => {
    const [x, y] = getCircleRadianPoint(0, 0, 10, 0)
    expect(x).toBeCloseTo(10)
    expect(y).toBeCloseTo(0)
  })
})
