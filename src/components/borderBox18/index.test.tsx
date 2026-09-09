import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox18 } from './index'

describe('BorderBox18', () => {
  it('renders children inside the visor cap with scan and breathing lamps', () => {
    render(
      <BorderBox18 style={{ width: 240, height: 140 }}>
        <span>visor</span>
      </BorderBox18>
    )
    expect(screen.getByText('visor')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-18')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform').length).toBeGreaterThan(0)
  })
})
