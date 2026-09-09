import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Decoration19 } from './index'

describe('Decoration19', () => {
  it('mounts a telemetry waveform', () => {
    const { container } = render(<Decoration19 style={{ width: 300, height: 80 }} />)
    expect(container.querySelector('.dv-decoration-19')).not.toBeNull()
    expect(container.querySelector('polyline')).not.toBeNull()
  })
})
