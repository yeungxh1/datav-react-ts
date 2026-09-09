import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import { DigitalFlop } from '../digitalFlop'
import './style.less'

export type ActiveRingDatum = { name: string; value: number }

export type ActiveRingChartConfig = {
  radius?: string | number
  activeRadius?: string | number
  data?: ActiveRingDatum[]
  lineWidth?: number
  activeTimeGap?: number
  color?: string[]
  digitalFlopStyle?: { fontSize?: number; fill?: string }
  digitalFlopToFixed?: number
  digitalFlopUnit?: string
  showOriginValue?: boolean
}

export type ActiveRingChartProps = {
  config?: ActiveRingChartConfig
  className?: string
  style?: CSSProperties
}

const defaultColors = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']

const defaultConfig: Required<ActiveRingChartConfig> = {
  radius: '50%',
  activeRadius: '55%',
  data: [{ name: '', value: 0 }],
  lineWidth: 20,
  activeTimeGap: 3000,
  color: [],
  digitalFlopStyle: { fontSize: 25, fill: '#fff' },
  digitalFlopToFixed: 0,
  digitalFlopUnit: '',
  showOriginValue: false
}

function parseRadius(value: string | number, maxR: number) {
  if (typeof value === 'number') return value
  if (value.endsWith('%')) return (Number.parseFloat(value) / 100) * maxR
  return Number.parseFloat(value) || maxR * 0.5
}

function describeDonut(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number
) {
  const point = (r: number, angle: number) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  const [x1, y1] = point(outer, start)
  const [x2, y2] = point(outer, end)
  const [x3, y3] = point(inner, end)
  const [x4, y4] = point(inner, start)
  const large = end - start > Math.PI ? 1 : 0
  return `M${x1},${y1} A${outer},${outer} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`
}

export function ActiveRingChart({ config = {}, className, style }: ActiveRingChartProps) {
  const { width, height, domRef } = useAutoResize()
  const mergedConfig = useMemo(() => deepMerge(deepClone(defaultConfig), config), [config])
  const [activeIndex, setActiveIndex] = useState(0)
  const data = mergedConfig.data
  const colors = mergedConfig.color.length ? mergedConfig.color : defaultColors

  useEffect(() => {
    if (data.length < 2) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % data.length)
    }, mergedConfig.activeTimeGap)
    return () => window.clearInterval(id)
  }, [data.length, mergedConfig.activeTimeGap])

  const maxR = Math.min(width, height) / 2
  const radius = parseRadius(mergedConfig.radius, maxR)
  const activeRadius = parseRadius(mergedConfig.activeRadius, maxR)
  const sum = data.reduce((all, item) => all + item.value, 0) || 1
  let cursor = -Math.PI / 2
  const slices = data.map((item, i) => {
    const sweep = (item.value / sum) * Math.PI * 2
    const start = cursor
    const end = cursor + sweep
    cursor = end
    const outer = i === activeIndex ? activeRadius : radius
    const inner = Math.max(outer - mergedConfig.lineWidth, 0)
    return {
      ...item,
      d: describeDonut(width / 2, height / 2, inner, outer, start, end),
      color: colors[i % colors.length]
    }
  })

  const displayValue = mergedConfig.showOriginValue
    ? data[activeIndex]?.value ?? 0
    : parseFloat((((data[activeIndex]?.value ?? 0) / sum) * 100).toFixed(mergedConfig.digitalFlopToFixed))

  const classNames = useMemo(() => classnames('dv-active-ring-chart', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        {slices.map((slice, i) => (
          <path
            className="dv-active-ring-sector"
            key={`${slice.name}-${i}`}
            d={slice.d}
            fill={slice.color}
            stroke="transparent"
          />
        ))}
      </svg>
      <div className="active-ring-info">
        <div className="active-ring-name" style={{ fontSize: `${mergedConfig.digitalFlopStyle.fontSize}px` }}>
          {data[activeIndex]?.name}
        </div>
        <DigitalFlop
          config={{
            number: [displayValue],
            content: mergedConfig.showOriginValue
              ? `{nt}${mergedConfig.digitalFlopUnit}`
              : `{nt}${mergedConfig.digitalFlopUnit || '%'}`,
            toFixed: mergedConfig.digitalFlopToFixed,
            duration: 0,
            style: mergedConfig.digitalFlopStyle
          }}
        />
      </div>
    </div>
  )
}
