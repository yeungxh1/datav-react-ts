import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration20 } from './index'

describe('Decoration20', () => {
  it('renders children between HUD chevrons', () => {
    render(
      <Decoration20>
        <span>NAV</span>
      </Decoration20>
    )
    expect(screen.getByText('NAV')).toBeInTheDocument()
    expect(document.querySelector('.dv-decoration-20')).not.toBeNull()
  })
})
