import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration22 } from './index'

describe('Decoration22', () => {
  it('mounts a vertical instrument tape', () => {
    const { container } = render(<Decoration22 style={{ width: 80, height: 180 }} />)
    expect(container.querySelector('.dv-decoration-22')).not.toBeNull()
    expect(container.querySelectorAll('line').length).toBeGreaterThan(6)
  })
})
