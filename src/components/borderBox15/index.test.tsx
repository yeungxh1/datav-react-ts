import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox15 } from './index'

describe('BorderBox15', () => {
  it('renders children inside the canopy viewport frame', () => {
    render(
      <BorderBox15 style={{ width: 240, height: 140 }}>
        <span>viewport</span>
      </BorderBox15>
    )
    expect(screen.getByText('viewport')).toBeInTheDocument()
    expect(document.querySelector('.dv-border-box-15')).not.toBeNull()
  })
})
