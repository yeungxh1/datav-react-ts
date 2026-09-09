import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration12 } from './index'

describe('Decoration12', () => {
  it('renders children over the radar decoration', () => {
    render(
      <Decoration12 style={{ width: 180, height: 180 }}>
        <span>scan</span>
      </Decoration12>
    )
    expect(screen.getByText('scan')).toBeInTheDocument()
  })
})
