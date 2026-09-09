import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox20 } from './index'

describe('BorderBox20', () => {
  it('renders children inside the damaged hull plate with flicker and breathing lights', () => {
    render(
      <BorderBox20 style={{ width: 240, height: 140 }}>
        <span>hull-fault</span>
      </BorderBox20>
    )
    expect(screen.getByText('hull-fault')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-20')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform').length).toBeGreaterThan(0)
  })
})
