import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ActiveRingChart } from './index'

describe('ActiveRingChart', () => {
  it('shows the first slice name', () => {
    render(
      <ActiveRingChart
        style={{ width: 200, height: 200 }}
        config={{
          data: [
            { name: '一号', value: 30 },
            { name: '二号', value: 70 }
          ],
          activeTimeGap: 999999
        }}
      />
    )
    expect(screen.getByText('一号')).toBeInTheDocument()
  })

  it('draws one ring sector per datum', () => {
    const { container } = render(
      <ActiveRingChart
        style={{ width: 200, height: 200 }}
        config={{
          data: [
            { name: '一号', value: 30 },
            { name: '二号', value: 70 }
          ],
          activeTimeGap: 999999
        }}
      />
    )
    expect(container.querySelectorAll('path.dv-active-ring-sector')).toHaveLength(2)
  })
})
