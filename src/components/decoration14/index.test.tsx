import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration14 } from './index'

describe('Decoration14', () => {
  it('mounts an attitude indicator', () => {
    const { container } = render(<Decoration14 style={{ width: 180, height: 180 }} />)
    expect(container.querySelector('.dv-decoration-14')).not.toBeNull()
    expect(container.querySelector('clipPath')).not.toBeNull()
  })

  it('applies custom color to the horizon', () => {
    const { container } = render(
      <Decoration14 color={['#4ad2ff', '#c4782a']} style={{ width: 180, height: 180 }} />
    )
    expect(container.innerHTML).toContain('#4ad2ff')
    expect(container.innerHTML).toContain('#c4782a')
  })
})
