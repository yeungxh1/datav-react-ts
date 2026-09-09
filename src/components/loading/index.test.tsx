import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from './index'

describe('Loading', () => {
  it('renders tip children', () => {
    render(<Loading>Loading...</Loading>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
