import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration21 } from './index'

describe('Decoration21', () => {
  it('mounts engine power bars', () => {
    const { container } = render(<Decoration21 style={{ width: 280, height: 80 }} />)
    expect(container.querySelector('.dv-decoration-21')).not.toBeNull()
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(3)
  })

  it('supports reverse orientation', () => {
    const { container } = render(<Decoration21 reverse style={{ width: 80, height: 180 }} />)
    expect(container.querySelector('.dv-decoration-21')).not.toBeNull()
  })
})
