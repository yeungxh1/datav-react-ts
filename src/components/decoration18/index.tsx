import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#ffde93']
const startDeg = 135
const sweep = 270

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

export type Decoration18Props = Pick<
  DecorationProps,
  'children' | 'className' | 'style' | 'color' | 'dur' | 'ref'
>

export function Decoration18({ children, className, style, color = [], dur = 6, ref }: Decoration18Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-18', className), [className])
  const w = width || 180
  const h = height || 180
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.4
  const ticks = useMemo(() => {
    const count = sweep / 10
    return new Array(count + 1).fill(0).map((_, i) => {
      const deg = startDeg + i * 10
      const major = i % 3 === 0
      const [x1, y1] = polar(cx, cy, r - (major ? 12 : 6), deg)
      const [x2, y2] = polar(cx, cy, r, deg)
      return { x1, y1, x2, y2, major }
    })
  }, [cx, cy, r])
  const [arcStartX, arcStartY] = polar(cx, cy, r, startDeg)
  const [arcEndX, arcEndY] = polar(cx, cy, r, startDeg + sweep)
  const [needleX, needleY] = polar(cx, cy, r * 0.72, startDeg)

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <path
          d={`M${arcStartX},${arcStartY} A${r},${r} 0 1 1 ${arcEndX},${arcEndY}`}
          fill="transparent"
          stroke={fade(mergedColor[0] || defaultColor[0], 35)}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M${arcStartX},${arcStartY} A${r},${r} 0 1 1 ${arcEndX},${arcEndY}`}
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.4"
        />
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? mergedColor[0] : fade(mergedColor[0] || defaultColor[0], 55)}
            strokeWidth={tick.major ? 1.6 : 1}
          />
        ))}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={mergedColor[1]} strokeWidth="2" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${cx} ${cy};${sweep * 0.78} ${cx} ${cy};18 ${cx} ${cy};${sweep * 0.78} ${cx} ${cy}`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </line>
        <circle cx={cx} cy={cy} r="6" fill={mergedColor[1]} />
        <circle cx={cx} cy={cy} r="2.4" fill={mergedColor[0]} />
      </svg>
      <div className="decoration-content">{children}</div>
    </div>
  )
}
