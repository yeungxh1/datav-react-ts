import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PercentPond } from './index'

describe('PercentPond', () => {
  it('renders formatted value', () => {
    render(<PercentPond config={{ value: 66, formatter: '{value}%' }} />)
    expect(screen.getByText('66%')).toBeInTheDocument()
  })
})
