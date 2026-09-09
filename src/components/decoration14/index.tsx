import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#4ad2ff', '#c4782a']

export type Decoration14Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'dur' | 'ref'>

export function Decoration14({ className, style, color = [], dur = 10, ref }: Decoration14Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const clipId = useRef(`decoration-14-clip-${uuid()}`).current
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-14', className), [className])
  const w = width || 180
  const h = height || 180
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.42
  const pitch = useMemo(() => {
    return [-20, -10, 10, 20].map((deg) => {
      const y = cy - (deg / 30) * r * 0.7
      const half = deg % 20 === 0 ? r * 0.28 : r * 0.16
      return { deg, y, half }
    })
  }, [cx, cy, r])
  const rollTicks = useMemo(() => {
    return new Array(13).fill(0).map((_, i) => {
      const deg = -60 + i * 10
      const a = ((deg - 90) * Math.PI) / 180
      const major = deg % 30 === 0
      const inner = r + 2
      const outer = r + (major ? 10 : 6)
      return {
        x1: cx + inner * Math.cos(a),
        y1: cy + inner * Math.sin(a),
        x2: cx + outer * Math.cos(a),
        y2: cy + outer * Math.sin(a),
        major
      }
    })
  }, [cx, cy, r])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <defs>
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <g>
            <rect x={cx - r} y={cy - r * 2} width={r * 2} height={r * 2} fill={fade(mergedColor[0] || defaultColor[0], 28)} />
            <rect x={cx - r} y={cy} width={r * 2} height={r * 2} fill={fade(mergedColor[1] || defaultColor[1], 42)} />
            <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={mergedColor[0]} strokeWidth="1.4" />
            {pitch.map((item) => (
              <g key={item.deg}>
                <line
                  x1={cx - item.half}
                  y1={item.y}
                  x2={cx + item.half}
                  y2={item.y}
                  stroke={fade(mergedColor[0] || defaultColor[0], 80)}
                  strokeWidth="1"
                />
                <text
                  x={cx - item.half - 4}
                  y={item.y + 3}
                  fill={mergedColor[0]}
                  fontSize="8"
                  textAnchor="end"
                >
                  {Math.abs(item.deg)}
                </text>
              </g>
            ))}
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`-8 ${cx} ${cy};8 ${cx} ${cy};-8 ${cx} ${cy}`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
          </g>
        </g>
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={mergedColor[0]} strokeWidth="2" />
        {rollTicks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? mergedColor[0] : fade(mergedColor[0] || defaultColor[0], 60)}
            strokeWidth={tick.major ? 2 : 1}
          />
        ))}
        <polygon
          points={`${cx},${cy - r - 12} ${cx - 5},${cy - r - 2} ${cx + 5},${cy - r - 2}`}
          fill={mergedColor[1]}
        />
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="2"
          points={`${cx - r * 0.32},${cy} ${cx - 8},${cy} ${cx},${cy + 8} ${cx + 8},${cy} ${cx + r * 0.32},${cy}`}
        />
        <circle cx={cx} cy={cy} r="2" fill={mergedColor[1]} />
      </svg>
    </div>
  )
}
