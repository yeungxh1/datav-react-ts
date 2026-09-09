import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox21 } from './index'

describe('BorderBox21', () => {
  it('renders children inside the faulty warning frame with stuttered scan and flicker', () => {
    render(
      <BorderBox21 style={{ width: 240, height: 140 }}>
        <span>warn-fault</span>
      </BorderBox21>
    )
    expect(screen.getByText('warn-fault')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-21')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform').length).toBeGreaterThan(0)
  })
})
