import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox16 } from './index'

describe('BorderBox16', () => {
  it('renders children inside the HUD viewport with scan and breathing lights', () => {
    render(
      <BorderBox16 style={{ width: 240, height: 140 }}>
        <span>hud-lock</span>
      </BorderBox16>
    )
    expect(screen.getByText('hud-lock')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-16')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform').length).toBeGreaterThan(0)
  })
})
