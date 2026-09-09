import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#7acaec']

function wavePoints(width: number, height: number, amp: number, phase: number, freq: number) {
  const steps = 48
  return new Array(steps)
    .fill(0)
    .map((_, i) => {
      const x = (i / (steps - 1)) * width
      const y = height / 2 + Math.sin(i * freq + phase) * amp
      return `${x},${y}`
    })
    .join(' ')
}

export type Decoration19Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'dur' | 'ref'>

export function Decoration19({ className, style, color = [], dur = 3, ref }: Decoration19Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-19', className), [className])
  const w = width || 300
  const h = height || 80
  const grid = useMemo(() => {
    const cols = 8
    const rows = 4
    const v = new Array(cols + 1).fill(0).map((_, i) => (w / cols) * i)
    const hz = new Array(rows + 1).fill(0).map((_, i) => (h / rows) * i)
    return { v, hz }
  }, [w, h])
  const waveA = useMemo(() => wavePoints(w, h, h * 0.28, 0, 0.38), [w, h])
  const waveB = useMemo(() => wavePoints(w, h, h * 0.16, 1.2, 0.52), [w, h])
  const length = Math.hypot(w, h)

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        {grid.v.map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2={h} stroke={fade(mergedColor[1] || defaultColor[1], 18)} />
        ))}
        {grid.hz.map((y) => (
          <line key={`h-${y}`} x1="0" y1={y} x2={w} y2={y} stroke={fade(mergedColor[1] || defaultColor[1], 18)} />
        ))}
        <polyline fill="transparent" stroke={fade(mergedColor[1] || defaultColor[1], 45)} strokeWidth="1" points={waveB} />
        <polyline
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.6"
          points={waveA}
          strokeDasharray={length}
          strokeDashoffset="0"
        >
          <animate attributeName="stroke-dashoffset" values={`${length};0`} dur={`${dur}s`} repeatCount="indefinite" />
        </polyline>
        <circle r="2.4" fill={mergedColor[0]}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={`M${waveA.replace(/ /g, ' L')}`} />
        </circle>
      </svg>
    </div>
  )
}
