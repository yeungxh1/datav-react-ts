import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration17 } from './index'

describe('Decoration17', () => {
  it('mounts a heading tape with cardinal labels', () => {
    const { container } = render(<Decoration17 style={{ width: 300, height: 50 }} />)
    expect(container.querySelector('.dv-decoration-17')).not.toBeNull()
    expect(container.textContent).toMatch(/N|E|S|W/)
  })
})
