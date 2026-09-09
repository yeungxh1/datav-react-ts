import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration13 } from './index'

describe('Decoration13', () => {
  it('renders children over the HUD reticle', () => {
    render(
      <Decoration13 style={{ width: 180, height: 180 }}>
        <span>LOCK</span>
      </Decoration13>
    )
    expect(screen.getByText('LOCK')).toBeInTheDocument()
    expect(document.querySelector('.dv-decoration-13')).not.toBeNull()
  })

  it('applies custom color to the reticle strokes', () => {
    const { container } = render(
      <Decoration13 color={['#ff3366', '#33ffcc']} style={{ width: 180, height: 180 }} />
    )
    expect(container.innerHTML).toContain('#ff3366')
    expect(container.innerHTML).toContain('#33ffcc')
  })
})
