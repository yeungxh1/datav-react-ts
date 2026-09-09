import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox1 } from './index'

describe('BorderBox1', () => {
  it('renders children inside the content slot', () => {
    render(
      <BorderBox1 style={{ width: 200, height: 120 }}>
        <span>inner</span>
      </BorderBox1>
    )
    expect(screen.getByText('inner')).toBeInTheDocument()
  })
})
