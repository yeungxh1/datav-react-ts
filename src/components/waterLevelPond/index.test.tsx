import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WaterLevelPond } from './index'

describe('WaterLevelPond', () => {
  it('renders the formatted max value', () => {
    render(
      <WaterLevelPond style={{ width: 150, height: 150 }} config={{ data: [55, 45], formatter: '{value}%' }} />
    )
    expect(screen.getByText('55%')).toBeInTheDocument()
  })
})
