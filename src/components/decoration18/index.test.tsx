import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration18 } from './index'

describe('Decoration18', () => {
  it('renders children over the analog gauge', () => {
    render(
      <Decoration18 style={{ width: 180, height: 180 }}>
        <span>72%</span>
      </Decoration18>
    )
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(document.querySelector('.dv-decoration-18')).not.toBeNull()
  })
})
