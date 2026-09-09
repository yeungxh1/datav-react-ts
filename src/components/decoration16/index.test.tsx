import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration16 } from './index'

describe('Decoration16', () => {
  it('renders a honeycomb of hex cells', () => {
    const { container } = render(<Decoration16 style={{ width: 280, height: 120 }} />)
    expect(container.querySelector('.dv-decoration-16')).not.toBeNull()
    expect(container.querySelectorAll('polygon').length).toBeGreaterThan(6)
  })
})
