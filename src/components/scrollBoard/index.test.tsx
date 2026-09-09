import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScrollBoard } from './index'

describe('ScrollBoard', () => {
  it('renders header cells', () => {
    render(
      <ScrollBoard
        style={{ width: 400, height: 200 }}
        config={{ header: ['A', 'B'], data: [['1', '2']], waitTime: 999999 }}
      />
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
