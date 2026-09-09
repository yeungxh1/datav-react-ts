import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#0b3c4a']
const ledCount = 8

export type Decoration15Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'reverse' | 'dur' | 'ref'>

export function Decoration15({ reverse = false, dur = 4, className, style, color = [], ref }: Decoration15Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-15', className), [className])
  const w = width || (reverse ? 40 : 280)
  const h = height || (reverse ? 180 : 40)
  const leds = useMemo(() => {
    return new Array(ledCount).fill(0).map((_, i) => {
      if (reverse) {
        const gap = h / (ledCount + 1)
        const ledH = Math.max(8, gap * 0.55)
        const ledW = Math.max(10, w * 0.55)
        return { x: (w - ledW) / 2, y: gap * (i + 1) - ledH / 2, width: ledW, height: ledH }
      }
      const gap = w / (ledCount + 1)
      const ledW = Math.max(12, gap * 0.55)
      const ledH = Math.max(8, h * 0.42)
      return { x: gap * (i + 1) - ledW / 2, y: (h - ledH) / 2, width: ledW, height: ledH }
    })
  }, [reverse, w, h])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={w} height={h}>
        <rect
          x="1"
          y="1"
          width={Math.max(w - 2, 0)}
          height={Math.max(h - 2, 0)}
          fill={fade(mergedColor[1] || defaultColor[1], 12)}
          stroke={fade(mergedColor[0] || defaultColor[0], 35)}
          rx="2"
        />
        <polyline
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.2"
          points={reverse ? `2,8 ${w - 2},8` : `8,2 8,${h - 2}`}
        />
        <polyline
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.2"
          points={reverse ? `2,${h - 8} ${w - 2},${h - 8}` : `${w - 8},2 ${w - 8},${h - 2}`}
        />
        {leds.map((led, i) => (
          <rect
            key={i}
            x={led.x}
            y={led.y}
            width={led.width}
            height={led.height}
            rx="2"
            fill={mergedColor[1]}
            stroke={mergedColor[0]}
            strokeWidth="0.8"
          >
            <animate
              attributeName="fill"
              values={`${mergedColor[1]};${mergedColor[0]};${mergedColor[1]}`}
              dur={`${dur}s`}
              begin={`${(i * dur) / ledCount}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </div>
  )
}
