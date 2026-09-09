import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FlylineChartEnhanced } from './index'

describe('FlylineChartEnhanced', () => {
  it('mounts with two points and one line', () => {
    const { container } = render(
      <FlylineChartEnhanced
        style={{ width: 400, height: 300 }}
        config={{
          points: [
            { name: 'A', coordinate: [0.2, 0.3] },
            { name: 'B', coordinate: [0.8, 0.7] }
          ],
          lines: [{ source: 'A', target: 'B' }]
        }}
      />
    )
    expect(container.querySelector('.dv-flyline-chart-enhanced')).not.toBeNull()
  })

  it('animates along the path without getTotalLength', () => {
    const { container } = render(
      <FlylineChartEnhanced
        style={{ width: 400, height: 300 }}
        config={{
          points: [
            { name: 'A', coordinate: [0.2, 0.3] },
            { name: 'B', coordinate: [0.8, 0.7] }
          ],
          lines: [{ source: 'A', target: 'B' }]
        }}
      />
    )
    expect(container.querySelector('circle.dv-flyline-dot')).not.toBeNull()
  })
})
