import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, easeOutCubic } from '../../utils'
import './style.less'

export type DigitalFlopConfig = {
  number?: number[]
  content?: string
  toFixed?: number
  textAlign?: 'left' | 'center' | 'right'
  rowGap?: number
  style?: {
    fontSize?: number
    fill?: string
    [key: string]: unknown
  }
  formatter?: (value: number) => number | string
  duration?: number
}

export type DigitalFlopProps = {
  config?: DigitalFlopConfig
  className?: string
  style?: CSSProperties
}

const defaultConfig: Required<
  Omit<DigitalFlopConfig, 'formatter'>
> & { formatter?: DigitalFlopConfig['formatter'] } = {
  number: [],
  content: '',
  toFixed: 0,
  textAlign: 'center',
  rowGap: 0,
  style: {
    fontSize: 30,
    fill: '#3de7c9'
  },
  formatter: undefined,
  duration: 1000
}

function formatNumbers(config: DigitalFlopConfig, values: number[]) {
  return values.map((n) => {
    const raw = config.formatter ? config.formatter(n) : n
    if (typeof raw === 'number') return raw.toFixed(config.toFixed ?? 0)
    return String(raw)
  })
}

function applyContent(content: string, parts: string[]) {
  if (!content) return parts.join(' ')
  let i = 0
  return content.replace(/\{nt\}/g, () => parts[i++] ?? '')
}

export function DigitalFlop({ config = {}, className, style }: DigitalFlopProps) {
  const merged = useMemo(
    () => deepMerge(deepClone(defaultConfig), config),
    [config]
  )
  const [display, setDisplay] = useState(() => [...(merged.number ?? [])])
  const displayRef = useRef(display)
  const frameRef = useRef(0)

  useEffect(() => {
    displayRef.current = display
  }, [display])

  useEffect(() => {
    const target = merged.number ?? []
    const duration = merged.duration ?? 1000
    cancelAnimationFrame(frameRef.current)

    if (duration === 0) {
      setDisplay([...target])
      return
    }

    const from = target.map((_, i) => displayRef.current[i] ?? 0)
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = easeOutCubic(p)
      setDisplay(target.map((value, i) => from[i] + (value - from[i]) * eased))
      if (p < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [merged])

  const text = applyContent(merged.content ?? '', formatNumbers(merged, display))
  const classNames = useMemo(() => classnames('dv-digital-flop', className), [className])
  const fontSize = merged.style?.fontSize ?? 30
  const fill = merged.style?.fill ?? '#3de7c9'

  return (
    <div
      className={classNames}
      style={{
        ...style,
        textAlign: merged.textAlign,
        fontSize,
        color: fill,
        lineHeight: merged.rowGap ? `${fontSize + merged.rowGap}px` : undefined
      }}
    >
      <span className="digital-flop-text">{text}</span>
    </div>
  )
}
