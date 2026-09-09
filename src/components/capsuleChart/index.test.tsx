import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CapsuleChart } from './index'

describe('CapsuleChart', () => {
  it('renders item names', () => {
    render(
      <CapsuleChart
        config={{
          data: [
            { name: 'a', value: 40 },
            { name: 'b', value: 80 }
          ]
        }}
      />
    )
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })
})
