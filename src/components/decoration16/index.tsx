import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#1677b3']

function hexPoints(cx: number, cy: number, radius: number) {
  return new Array(6)
    .fill(0)
    .map((_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`
    })
    .join(' ')
}

export type Decoration16Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'ref'>

export function Decoration16({ className, style, color = [], ref }: Decoration16Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-16', className), [className])
  const w = width || 280
  const h = height || 120
  const cells = useMemo(() => {
    const radius = Math.max(8, Math.min(w, h) / 7)
    const colStep = radius * 1.75
    const rowStep = radius * Math.sqrt(3)
    const cols = Math.max(4, Math.ceil(w / colStep) + 1)
    const rows = Math.max(3, Math.ceil(h / rowStep) + 1)
    const next: Array<{ points: string; pulse: boolean; delay: number }> = []
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cx = col * colStep + (row % 2 === 0 ? 0 : colStep / 2)
        const cy = row * rowStep
        if (cx < -radius || cy < -radius || cx > w + radius || cy > h + radius) continue
        next.push({
          points: hexPoints(cx, cy, radius * 0.88),
          pulse: Math.random() > 0.55,
          delay: Math.random() * 2
        })
      }
    }
    return next
  }, [w, h])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        {cells.map((cell, i) => (
          <polygon
            key={i}
            points={cell.points}
            fill={fade(mergedColor[1] || defaultColor[1], cell.pulse ? 22 : 10)}
            stroke={mergedColor[0]}
            strokeWidth="0.8"
          >
            {cell.pulse && (
              <animate
                attributeName="fill"
                values={`${fade(mergedColor[1] || defaultColor[1], 12)};${fade(mergedColor[0] || defaultColor[0], 45)};${fade(
                  mergedColor[1] || defaultColor[1],
                  12
                )}`}
                dur={`${1.6 + (i % 5) * 0.2}s`}
                begin={`${cell.delay}s`}
                repeatCount="indefinite"
              />
            )}
          </polygon>
        ))}
      </svg>
    </div>
  )
}
