import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox17 } from './index'

describe('BorderBox17', () => {
  it('renders children inside the airlock hatch with scan and breathing latches', () => {
    render(
      <BorderBox17 style={{ width: 240, height: 140 }}>
        <span>hatch</span>
      </BorderBox17>
    )
    expect(screen.getByText('hatch')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-17')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform, animateMotion').length).toBeGreaterThan(0)
  })
})
