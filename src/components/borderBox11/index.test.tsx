import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BorderBox11 } from './index'

describe('BorderBox11', () => {
  it('renders the title text', () => {
    render(<BorderBox11 title="系统总览" style={{ width: 300, height: 160 }} />)
    expect(screen.getByText('系统总览')).toBeInTheDocument()
  })
})
