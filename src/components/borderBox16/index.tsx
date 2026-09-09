import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#1677b3']

export type BorderBox16Props = BoxProps & { dur?: number }

export function BorderBox16({
  children,
  className,
  style,
  color = [],
  dur = 3,
  backgroundColor = 'transparent',
  ref
}: BorderBox16Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const filterId = useRef(`border-box-16-glow-${uuid()}`).current
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-16', className), [className])
  const w = width || 240
  const h = height || 140
  const inset = 8
  const arm = Math.min(32, w * 0.14, h * 0.24)
  const inner = inset + 10
  const brackets = [
    `${inset},${inset + arm} ${inset},${inset} ${inset + arm},${inset}`,
    `${w - inset - arm},${inset} ${w - inset},${inset} ${w - inset},${inset + arm}`,
    `${inset},${h - inset - arm} ${inset},${h - inset} ${inset + arm},${h - inset}`,
    `${w - inset - arm},${h - inset} ${w - inset},${h - inset} ${w - inset},${h - inset - arm}`
  ]
  const pips = [
    [inset + 3, inset + 3],
    [w - inset - 3, inset + 3],
    [inset + 3, h - inset - 3],
    [w - inset - 3, h - inset - 3]
  ]
  const ticks = useMemo(() => {
    const next: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = []
    for (let x = inset + arm + 8; x < w - inset - arm - 4; x += 8) {
      const major = Math.round(x) % 24 < 8
      next.push({ x1: x, y1: inset - 1, x2: x, y2: inset + (major ? 8 : 4), major })
      next.push({ x1: x, y1: h - inset + 1, x2: x, y2: h - inset - (major ? 8 : 4), major })
    }
    for (let y = inset + arm + 8; y < h - inset - arm - 4; y += 8) {
      const major = Math.round(y) % 24 < 8
      next.push({ x1: inset - 1, y1: y, x2: inset + (major ? 8 : 4), y2: y, major })
      next.push({ x1: w - inset + 1, y1: y, x2: w - inset - (major ? 8 : 4), y2: y, major })
    }
    return next
  }, [w, h, inset, arm])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <defs>
          <linearGradient id={filterId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={mergedColor[0]} stopOpacity="0" />
            <stop offset="45%" stopColor={mergedColor[0]} stopOpacity="0.55" />
            <stop offset="100%" stopColor={mergedColor[0]} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill={backgroundColor}
          stroke={fade(mergedColor[1] || defaultColor[1], 55)}
          strokeWidth="1"
          points={`${inset + 4},${inset + 4} ${w - inset - 4},${inset + 4} ${w - inset - 4},${h - inset - 4} ${inset + 4},${h - inset - 4}`}
        />
        <rect
          x={inner}
          y={inner}
          width={Math.max(0, w - inner * 2)}
          height={Math.max(0, h - inner * 2)}
          fill="transparent"
          stroke={fade(mergedColor[0] || defaultColor[0], 45)}
          strokeWidth="1"
          strokeDasharray="5 4"
        />
        {brackets.map((points, i) => (
          <polyline
            key={i}
            points={points}
            fill="transparent"
            stroke={mergedColor[0]}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="square"
          />
        ))}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? mergedColor[0] : fade(mergedColor[1] || defaultColor[1], 70)}
            strokeWidth={tick.major ? 1.4 : 1}
          />
        ))}
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="1.6"
          points={`${w / 2 - 10},4 ${w / 2},12 ${w / 2 + 10},4`}
        />
        <rect
          x={inner}
          y={inner}
          width={Math.max(0, w - inner * 2)}
          height="14"
          fill={`url(#${filterId})`}
          opacity="0.9"
        >
          <animate
            attributeName="y"
            values={`${inner};${Math.max(inner, h - inner - 14)};${inner}`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </rect>
        {pips.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill={mergedColor[0]}>
            <animate
              attributeName="opacity"
              values="0.25;1;0.25"
              dur="1.6s"
              begin={`${i * 0.28}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="2;3.2;2"
              dur="1.6s"
              begin={`${i * 0.28}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
