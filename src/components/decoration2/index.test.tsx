import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration2 } from './index'

describe('Decoration2', () => {
  it('mounts with reverse and custom dur', () => {
    const { container } = render(<Decoration2 reverse dur={2} style={{ width: 200, height: 40 }} />)
    expect(container.querySelector('.dv-decoration-2')).not.toBeNull()
  })
})
