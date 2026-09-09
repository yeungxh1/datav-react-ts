import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#7acaec']
const cardinals: Record<number, string> = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }

export type Decoration17Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'dur' | 'ref'>

export function Decoration17({ className, style, color = [], dur = 16, ref }: Decoration17Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-17', className), [className])
  const w = width || 300
  const h = height || 50
  const visibleSpan = 80
  const pxPerDeg = w / visibleSpan
  const shift = 24 * pxPerDeg
  const tapeY = h * 0.58
  const marks = useMemo(() => {
    const items: Array<{ deg: number; x: number; major: boolean; label: string }> = []
    for (let deg = -180; deg <= 540; deg += 5) {
      const heading = ((deg % 360) + 360) % 360
      const cardinal = cardinals[heading]
      items.push({
        deg,
        x: deg * pxPerDeg,
        major: deg % 10 === 0,
        label: cardinal || (deg % 30 === 0 ? String(heading).padStart(3, '0') : '')
      })
    }
    return items
  }, [pxPerDeg])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <rect x="0" y={h * 0.22} width={w} height={h * 0.62} fill={fade(mergedColor[1] || defaultColor[1], 8)} />
        <line x1="0" y1={h * 0.22} x2={w} y2={h * 0.22} stroke={fade(mergedColor[0] || defaultColor[0], 40)} />
        <line x1="0" y1={h * 0.84} x2={w} y2={h * 0.84} stroke={fade(mergedColor[0] || defaultColor[0], 40)} />
        {new Array(9).fill(0).map((_, i) => {
          const x = (w / 8) * i
          return (
            <line
              key={`rail-${i}`}
              x1={x}
              y1={h * 0.22}
              x2={x}
              y2={h * 0.22 + 5}
              stroke={fade(mergedColor[0] || defaultColor[0], 45)}
            />
          )
        })}
        <g>
          {marks.map((mark) => (
            <g key={mark.deg} transform={`translate(${mark.x}, 0)`}>
              <line
                x1="0"
                y1={mark.major ? tapeY - 16 : tapeY - 8}
                x2="0"
                y2={tapeY}
                stroke={mark.major ? mergedColor[0] : fade(mergedColor[0] || defaultColor[0], 55)}
                strokeWidth={mark.major ? 1.4 : 1}
              />
              {mark.label && (
                <text x="0" y={tapeY - 20} fill={mergedColor[0]} fontSize="11" textAnchor="middle">
                  {mark.label}
                </text>
              )}
            </g>
          ))}
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${w / 2},0;${w / 2 - shift},0;${w / 2 + shift},0;${w / 2},0`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </g>
        <polygon
          points={`${w / 2},${h * 0.22 + 2} ${w / 2 - 7},${h * 0.38} ${w / 2 + 7},${h * 0.38}`}
          fill={mergedColor[1]}
        />
        <line x1={w / 2} y1={h * 0.38} x2={w / 2} y2={h * 0.84} stroke={mergedColor[1]} strokeWidth="1.2" />
        <rect
          x={w / 2 - 22}
          y={h * 0.84 + 1}
          width="44"
          height={Math.max(h * 0.14, 12)}
          fill={fade(mergedColor[1] || defaultColor[1], 18)}
          stroke={mergedColor[1]}
        />
        <text x={w / 2} y={h * 0.84 + Math.max(h * 0.11, 11)} fill={mergedColor[0]} fontSize="10" textAnchor="middle">
          HDG
        </text>
      </svg>
    </div>
  )
}
