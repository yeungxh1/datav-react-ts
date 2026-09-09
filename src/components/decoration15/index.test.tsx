import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration15 } from './index'

describe('Decoration15', () => {
  it('mounts a status LED rail', () => {
    const { container } = render(<Decoration15 style={{ width: 280, height: 40 }} />)
    expect(container.querySelector('.dv-decoration-15')).not.toBeNull()
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(4)
  })

  it('supports reverse orientation and custom duration', () => {
    const { container } = render(<Decoration15 reverse dur={2} style={{ width: 40, height: 180 }} />)
    expect(container.querySelector('.dv-decoration-15')).not.toBeNull()
  })
})
