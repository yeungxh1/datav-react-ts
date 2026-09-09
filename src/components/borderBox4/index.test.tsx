import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox4 } from './index'

describe('BorderBox4', () => {
  it('accepts reverse without throwing', () => {
    const { container } = render(<BorderBox4 reverse style={{ width: 200, height: 100 }} />)
    expect(container.querySelector('.dv-border-box-4')).not.toBeNull()
  })
})
