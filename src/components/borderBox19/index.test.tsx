import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox19 } from './index'

describe('BorderBox19', () => {
  it('renders children inside the chamfered canopy with rotating scan and breathing nodes', () => {
    render(
      <BorderBox19 style={{ width: 240, height: 140 }}>
        <span>canopy</span>
      </BorderBox19>
    )
    expect(screen.getByText('canopy')).toBeInTheDocument()
    const root = document.querySelector('.dv-border-box-19')
    expect(root).not.toBeNull()
    expect(root?.querySelectorAll('animate, animateTransform').length).toBeGreaterThan(0)
  })
})
