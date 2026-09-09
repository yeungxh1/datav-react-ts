import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#ffde93']
const barCount = 5

export type Decoration21Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'reverse' | 'dur' | 'ref'>

export function Decoration21({ reverse = false, dur = 3.2, className, style, color = [], ref }: Decoration21Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-21', className), [className])
  const w = width || (reverse ? 80 : 280)
  const h = height || (reverse ? 180 : 80)
  const bars = useMemo(() => {
    return new Array(barCount).fill(0).map((_, i) => {
      const level = 0.35 + ((i * 17) % 50) / 100
      if (reverse) {
        const gap = w / (barCount + 1)
        const barW = Math.max(8, gap * 0.5)
        const maxH = h * 0.82
        return {
          x: gap * (i + 1) - barW / 2,
          y: h - maxH - 6,
          width: barW,
          height: maxH,
          level,
          labelX: gap * (i + 1),
          labelY: h - 2
        }
      }
      const gap = h / (barCount + 1)
      const barH = Math.max(6, gap * 0.45)
      const maxW = w * 0.78
      return {
        x: w * 0.14,
        y: gap * (i + 1) - barH / 2,
        width: maxW,
        height: barH,
        level,
        labelX: w * 0.07,
        labelY: gap * (i + 1) + 3
      }
    })
  }, [reverse, w, h])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        {bars.map((bar, i) => (
          <g key={i}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={fade(mergedColor[0] || defaultColor[0], 10)}
              stroke={fade(mergedColor[0] || defaultColor[0], 35)}
            />
            <rect
              x={bar.x}
              y={reverse ? bar.y + bar.height * (1 - bar.level) : bar.y}
              width={reverse ? bar.width : bar.width * bar.level}
              height={reverse ? bar.height * bar.level : bar.height}
              fill={i % 2 === 0 ? mergedColor[0] : mergedColor[1]}
              opacity="0.85"
            >
              {reverse ? (
                <animate
                  attributeName="height"
                  values={`${bar.height * 0.2};${bar.height * bar.level};${bar.height * 0.2}`}
                  dur={`${dur + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              ) : (
                <animate
                  attributeName="width"
                  values={`${bar.width * 0.2};${bar.width * bar.level};${bar.width * 0.2}`}
                  dur={`${dur + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              )}
              {reverse && (
                <animate
                  attributeName="y"
                  values={`${bar.y + bar.height * 0.8};${bar.y + bar.height * (1 - bar.level)};${bar.y + bar.height * 0.8}`}
                  dur={`${dur + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              )}
            </rect>
            <text x={bar.labelX} y={bar.labelY} fill={mergedColor[0]} fontSize="9" textAnchor="middle">
              {`0${i + 1}`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
