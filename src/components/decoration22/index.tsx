import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#7acaec']

export type Decoration22Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'dur' | 'ref'>

export function Decoration22({ className, style, color = [], dur = 12, ref }: Decoration22Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-22', className), [className])
  const w = width || 80
  const h = height || 180
  const visibleSpan = 70
  const pxPerUnit = h / visibleSpan
  const shift = 18 * pxPerUnit
  const cx = w * 0.68
  const windowH = Math.max(28, h * 0.14)
  const marks = useMemo(() => {
    const items: Array<{ value: number; y: number; major: boolean }> = []
    for (let value = -80; value <= 240; value += 2) {
      items.push({
        value,
        y: -value * pxPerUnit,
        major: value % 10 === 0
      })
    }
    return items
  }, [pxPerUnit])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <rect x={w * 0.22} y="0" width={w * 0.78} height={h} fill={fade(mergedColor[1] || defaultColor[1], 8)} />
        <line x1={w * 0.22} y1="0" x2={w * 0.22} y2={h} stroke={fade(mergedColor[0] || defaultColor[0], 40)} />
        {new Array(7).fill(0).map((_, i) => {
          const y = (h / 6) * i
          return (
            <line
              key={`rail-${i}`}
              x1={w * 0.22}
              y1={y}
              x2={w * 0.22 + 5}
              y2={y}
              stroke={fade(mergedColor[0] || defaultColor[0], 45)}
            />
          )
        })}
        <g>
          {marks.map((mark) => (
            <g key={mark.value} transform={`translate(0, ${mark.y})`}>
              <line
                x1={mark.major ? cx - 20 : cx - 10}
                y1="0"
                x2={cx}
                y2="0"
                stroke={mark.major ? mergedColor[0] : fade(mergedColor[0] || defaultColor[0], 55)}
                strokeWidth={mark.major ? 1.4 : 1}
              />
              {mark.major && (
                <text x={cx - 24} y="4" fill={mergedColor[0]} fontSize="10" textAnchor="end">
                  {String(mark.value).padStart(3, '0')}
                </text>
              )}
            </g>
          ))}
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,${h / 2};0,${h / 2 - shift};0,${h / 2 + shift};0,${h / 2}`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </g>
        <rect
          x={w * 0.2}
          y={h / 2 - windowH / 2}
          width={w * 0.78}
          height={windowH}
          fill={fade(mergedColor[1] || defaultColor[1], 12)}
          stroke={mergedColor[1]}
          strokeWidth="1.4"
        />
        <polygon
          points={`4,${h / 2} ${w * 0.2},${h / 2 - 7} ${w * 0.2},${h / 2 + 7}`}
          fill={mergedColor[1]}
        />
        <text x={w * 0.62} y={h / 2 + 4} fill={mergedColor[0]} fontSize="11" textAnchor="middle">
          ALT
        </text>
      </svg>
    </div>
  )
}
