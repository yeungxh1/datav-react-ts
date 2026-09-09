import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#1677b3']

export type BorderBox14Props = BoxProps

export function BorderBox14({
  children,
  className,
  style,
  color = [],
  backgroundColor = 'transparent',
  ref
}: BorderBox14Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-14', className), [className])
  const w = width || 240
  const h = height || 140
  const cut = 16
  const bolts = [
    [10, 10],
    [w - 10, 10],
    [10, h - 10],
    [w - 10, h - 10]
  ]
  const edgeTicks = useMemo(() => {
    const ticks: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    for (let x = 28; x < w - 28; x += 10) {
      ticks.push({ x1: x, y1: 4, x2: x, y2: x % 30 === 8 ? 12 : 8 })
      ticks.push({ x1: x, y1: h - 4, x2: x, y2: x % 30 === 8 ? h - 12 : h - 8 })
    }
    for (let y = 28; y < h - 28; y += 10) {
      ticks.push({ x1: 4, y1: y, x2: y % 30 === 8 ? 12 : 8, y2: y })
      ticks.push({ x1: w - 4, y1: y, x2: y % 30 === 8 ? w - 12 : w - 8, y2: y })
    }
    return ticks
  }, [w, h])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <polygon
          fill={backgroundColor}
          stroke={mergedColor[0]}
          strokeWidth="1.4"
          points={`
            ${cut},4 ${w - cut},4 ${w - 4},${cut} ${w - 4},${h - cut}
            ${w - cut},${h - 4} ${cut},${h - 4} 4,${h - cut} 4,${cut}
          `}
        />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 70)}
          strokeWidth="1"
          strokeDasharray="6 4"
          points={`
            ${cut + 8},12 ${w - cut - 8},12 ${w - 12},${cut + 8} ${w - 12},${h - cut - 8}
            ${w - cut - 8},${h - 12} ${cut + 8},${h - 12} 12,${h - cut - 8} 12,${cut + 8}
          `}
        />
        {edgeTicks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={mergedColor[1]}
            strokeWidth="1"
          />
        ))}
        {bolts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={fade(mergedColor[1] || defaultColor[1], 40)} stroke={mergedColor[0]} />
            <circle cx={x} cy={y} r="1.4" fill={mergedColor[0]} />
          </g>
        ))}
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={`20,4 36,4`} />
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={`${w - 36},4 ${w - 20},4`} />
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
