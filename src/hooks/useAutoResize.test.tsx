import { useLayoutEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAutoResize } from './useAutoResize'

function Measure() {
  const { width, height, domRef, setWH } = useAutoResize()

  useLayoutEffect(() => {
    const node = domRef.current
    if (!node) return
    Object.defineProperty(node, 'clientWidth', { configurable: true, value: 120 })
    Object.defineProperty(node, 'clientHeight', { configurable: true, value: 80 })
    setWH()
  }, [domRef, setWH])

  return (
    <div ref={domRef} data-testid="box">
      {width}x{height}
    </div>
  )
}

describe('useAutoResize', () => {
  it('exposes width and height from the observed node', () => {
    render(<Measure />)
    expect(screen.getByTestId('box')).toHaveTextContent('120x80')
  })
})
