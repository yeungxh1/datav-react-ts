import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox14 } from './index'

describe('BorderBox14', () => {
  it('renders children inside the cockpit console frame', () => {
    render(
      <BorderBox14 style={{ width: 240, height: 140 }}>
        <span>console</span>
      </BorderBox14>
    )
    expect(screen.getByText('console')).toBeInTheDocument()
    expect(document.querySelector('.dv-border-box-14')).not.toBeNull()
  })
})
