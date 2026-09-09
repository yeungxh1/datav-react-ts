import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DigitalFlop } from './index'

describe('DigitalFlop', () => {
  it('renders formatted content immediately when duration is 0', () => {
    render(<DigitalFlop config={{ number: [12], content: '{nt}个', duration: 0 }} />)
    expect(screen.getByText('12个')).toBeInTheDocument()
  })
})
