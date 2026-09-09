import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#00c2ff']

export type Decoration13Props = Pick<
  DecorationProps,
  'children' | 'className' | 'style' | 'color' | 'dur' | 'ref'
>

export function Decoration13({ children, className, style, color = [], dur = 8, ref }: Decoration13Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-13', className), [className])
  const w = width || 180
  const h = height || 180
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.42
  const gap = Math.min(w, h) * 0.08
  const inset = Math.min(w, h) * 0.12
  const bracket = Math.min(w, h) * 0.1
  const ticks = useMemo(() => {
    return new Array(24).fill(0).map((_, i) => {
      const a = (Math.PI * 2 * i) / 24 - Math.PI / 2
      const major = i % 3 === 0
      const inner = r - (major ? 10 : 5)
      return {
        x1: cx + inner * Math.cos(a),
        y1: cy + inner * Math.sin(a),
        x2: cx + r * Math.cos(a),
        y2: cy + r * Math.sin(a),
        major
      }
    })
  }, [cx, cy, r])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={fade(mergedColor[1] || defaultColor[1], 35)} strokeWidth="1" />
        <circle
          cx={cx}
          cy={cy}
          r={r * 0.78}
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.2"
          strokeDasharray="6 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${cx} ${cy};360 ${cx} ${cy}`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </circle>
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? mergedColor[0] : fade(mergedColor[1] || defaultColor[1], 55)}
            strokeWidth={tick.major ? 1.5 : 1}
          />
        ))}
        <line x1={cx - r + 4} y1={cy} x2={cx - gap} y2={cy} stroke={mergedColor[0]} strokeWidth="1.2" />
        <line x1={cx + gap} y1={cy} x2={cx + r - 4} y2={cy} stroke={mergedColor[0]} strokeWidth="1.2" />
        <line x1={cx} y1={cy - r + 4} x2={cx} y2={cy - gap} stroke={mergedColor[0]} strokeWidth="1.2" />
        <line x1={cx} y1={cy + gap} x2={cx} y2={cy + r - 4} stroke={mergedColor[0]} strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r="3" fill="transparent" stroke={mergedColor[1]} strokeWidth="1.2" />
        {[
          [inset, inset, 1, 1],
          [w - inset, inset, -1, 1],
          [inset, h - inset, 1, -1],
          [w - inset, h - inset, -1, -1]
        ].map(([x, y, sx, sy], i) => (
          <polyline
            key={i}
            fill="transparent"
            stroke={mergedColor[1]}
            strokeWidth="1.6"
            points={`${x + bracket * sx},${y} ${x},${y} ${x},${y + bracket * sy}`}
          />
        ))}
      </svg>
      <div className="decoration-content">{children}</div>
    </div>
  )
}
