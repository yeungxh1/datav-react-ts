import { useMemo, useState } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#0d6e8a']

export type BorderBox17Props = BoxProps & { dur?: number }

export function BorderBox17({
  children,
  className,
  style,
  color = [],
  dur = 3.4,
  backgroundColor = 'transparent',
  ref
}: BorderBox17Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const [{ path, gradient, mask }] = useState(() => {
    const id = uuid()
    return {
      path: `border-box-17-path-${id}`,
      gradient: `border-box-17-gradient-${id}`,
      mask: `border-box-17-mask-${id}`
    }
  })
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-17', className), [className])
  const w = width || 240
  const h = height || 140
  const s = 18
  const outer = `
    ${s},4 ${w - s},4 ${w - 4},${s} ${w - 4},${h - s}
    ${w - s},${h - 4} ${s},${h - 4} 4,${h - s} 4,${s}
  `
  const inner = `
    ${s + 10},14 ${w - s - 10},14 ${w - 14},${s + 10} ${w - 14},${h - s - 10}
    ${w - s - 10},${h - 14} ${s + 10},${h - 14} 14,${h - s - 10} 14,${s + 10}
  `
  const pathD = `M ${s + 10} 14 L ${w - s - 10} 14 L ${w - 14} ${s + 10} L ${w - 14} ${h - s - 10} L ${w - s - 10} ${h - 14} L ${s + 10} ${h - 14} L 14 ${h - s - 10} L 14 ${s + 10} Z`
  const latches = [
    { x: 6, y: 6, w: 28, h: 12 },
    { x: w - 34, y: 6, w: 28, h: 12 },
    { x: 6, y: h - 18, w: 28, h: 12 },
    { x: w - 34, y: h - 18, w: 28, h: 12 }
  ]

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <defs>
          <path id={path} d={pathD} fill="transparent" />
          <radialGradient id={gradient} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={mask}>
            <circle cx="0" cy="0" r="120" fill={`url(#${gradient})`}>
              <animateMotion dur={`${dur}s`} path={pathD} rotate="auto" repeatCount="indefinite" />
            </circle>
          </mask>
        </defs>
        <polygon fill={backgroundColor} stroke={mergedColor[0]} strokeWidth="1.6" points={outer} />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 70)}
          strokeWidth="1"
          strokeDasharray="7 5"
          points={inner}
        />
        <use stroke={mergedColor[0]} strokeWidth="1" href={`#${path}`} />
        <use stroke={mergedColor[1]} strokeWidth="3" href={`#${path}`} mask={`url(#${mask})`} />
        {latches.map((latch, i) => (
          <g key={i}>
            <rect
              x={latch.x}
              y={latch.y}
              width={latch.w}
              height={latch.h}
              rx="1.5"
              fill={fade(mergedColor[1] || defaultColor[1], 35)}
              stroke={mergedColor[0]}
              strokeWidth="1.2"
            >
              <animate
                attributeName="fill"
                values={`${fade(mergedColor[1] || defaultColor[1], 18)};${fade(mergedColor[0] || defaultColor[0], 55)};${fade(
                  mergedColor[1] || defaultColor[1],
                  18
                )}`}
                dur="1.8s"
                begin={`${i * 0.22}s`}
                repeatCount="indefinite"
              />
            </rect>
            <circle cx={latch.x + 8} cy={latch.y + latch.h / 2} r="1.8" fill={mergedColor[0]} />
            <circle cx={latch.x + latch.w - 8} cy={latch.y + latch.h / 2} r="1.8" fill={mergedColor[0]} />
          </g>
        ))}
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={`4,${h / 2 - 14} 4,${h / 2 + 14}`} />
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="2"
          points={`${w - 4},${h / 2 - 14} ${w - 4},${h / 2 + 14}`}
        />
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="1.4" points={`${w / 2 - 16},4 ${w / 2 + 16},4`} />
        <polyline
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.4"
          points={`${w / 2 - 16},${h - 4} ${w / 2 + 16},${h - 4}`}
        />
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
