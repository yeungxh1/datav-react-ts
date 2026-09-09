import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#0d6e8a']

export type BorderBox15Props = BoxProps

export function BorderBox15({
  children,
  className,
  style,
  color = [],
  backgroundColor = 'transparent',
  ref
}: BorderBox15Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const filterId = useRef(`border-box-15-glow-${uuid()}`).current
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-15', className), [className])
  const w = width || 240
  const h = height || 140
  const ox = Math.min(28, w * 0.12)
  const oy = Math.min(22, h * 0.16)
  const canopy = `
    ${ox},4 ${w - ox},4 ${w - 4},${oy} ${w - 4},${h - oy}
    ${w - ox},${h - 4} ${ox},${h - 4} 4,${h - oy} 4,${oy}
  `
  const rivets = useMemo(() => {
    const points: Array<[number, number]> = []
    for (let x = ox + 12; x < w - ox - 8; x += 18) {
      points.push([x, 8])
      points.push([x, h - 8])
    }
    for (let y = oy + 10; y < h - oy - 8; y += 16) {
      points.push([8, y])
      points.push([w - 8, y])
    }
    return points
  }, [w, h, ox, oy])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon fill={backgroundColor} stroke={mergedColor[0]} strokeWidth="1.6" points={canopy} filter={`url(#${filterId})`} />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 80)}
          strokeWidth="1"
          points={`
            ${ox + 10},14 ${w - ox - 10},14 ${w - 14},${oy + 8} ${w - 14},${h - oy - 8}
            ${w - ox - 10},${h - 14} ${ox + 10},${h - 14} 14,${h - oy - 8} 14,${oy + 8}
          `}
        />
        <path
          d={`M ${ox + 18} 4 Q ${w / 2} ${-6} ${w - ox - 18} 4`}
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="2"
        />
        {rivets.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill={mergedColor[0]} />
        ))}
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={`4,${h / 2 - 12} 4,${h / 2 + 12}`} />
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="2"
          points={`${w - 4},${h / 2 - 12} ${w - 4},${h / 2 + 12}`}
        />
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
