import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#ff6b4a', '#ffde93']

export type BorderBox21Props = BoxProps & { dur?: number }

export function BorderBox21({
  children,
  className,
  style,
  color = [],
  dur = 2.6,
  backgroundColor = 'transparent',
  ref
}: BorderBox21Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-21', className), [className])
  const w = width || 240
  const h = height || 140
  const inset = 8
  const stripe = (x: number, y: number, dirX: 1 | -1, dirY: 1 | -1) => {
    return new Array(4).fill(0).map((_, i) => {
      const o = 4 + i * 5
      return {
        x1: x + dirX * o,
        y1: y,
        x2: x,
        y2: y + dirY * o
      }
    })
  }
  const stripes = [
    ...stripe(inset, inset, 1, 1),
    ...stripe(w - inset, inset, -1, 1),
    ...stripe(inset, h - inset, 1, -1),
    ...stripe(w - inset, h - inset, -1, -1)
  ]
  const lamps = [
    { x: inset + 14, y: inset + 14, delay: '0s', values: '0.15;1;0.1;0.85;0;0.4;1;0.05' },
    { x: w - inset - 14, y: inset + 14, delay: '0.18s', values: '1;0;0.7;0.1;1;0.2;0;0.9' },
    { x: inset + 14, y: h - inset - 14, delay: '0.4s', values: '0.3;1;0;0.2;1;0.05;0.8;0.1' },
    { x: w - inset - 14, y: h - inset - 14, delay: '0.08s', values: '0;0.9;0.2;1;0;0.35;0.1;1' }
  ]
  const scanTop = inset + 18
  const scanBottom = h - inset - 28
  const scanHeight = 10

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <polygon
          fill={backgroundColor}
          stroke={mergedColor[0]}
          strokeWidth="1.5"
          points={`
            ${inset + 16},${inset} ${w - inset - 16},${inset} ${w - inset},${inset + 16}
            ${w - inset},${h - inset - 16} ${w - inset - 16},${h - inset}
            ${inset + 16},${h - inset} ${inset},${h - inset - 16} ${inset},${inset + 16}
          `}
        />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 40)}
          strokeWidth="1"
          strokeDasharray="10 6 3 8"
          points={`
            ${inset + 22},${inset + 10} ${w - inset - 22},${inset + 10} ${w - inset - 10},${inset + 22}
            ${w - inset - 10},${h - inset - 22} ${w - inset - 22},${h - inset - 10}
            ${inset + 22},${h - inset - 10} ${inset + 10},${h - inset - 22} ${inset + 10},${inset + 22}
          `}
        />
        <line
          x1={w - inset}
          y1={inset + 22}
          x2={w - inset}
          y2={h - inset - 22}
          stroke={fade(mergedColor[0] || defaultColor[0], 28)}
          strokeWidth="2"
          strokeDasharray="4 10"
        />
        {stripes.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={i % 2 === 0 ? mergedColor[1] : mergedColor[0]}
            strokeWidth="2.2"
            strokeLinecap="square"
          />
        ))}
        {lamps.map((lamp, i) => (
          <g key={i}>
            <circle
              cx={lamp.x}
              cy={lamp.y}
              r="5"
              fill={fade(mergedColor[0] || defaultColor[0], 22)}
              stroke={mergedColor[1]}
            />
            <circle cx={lamp.x} cy={lamp.y} r="2.2" fill={mergedColor[1]}>
              <animate
                attributeName="opacity"
                values={lamp.values}
                dur={`${0.7 + i * 0.15}s`}
                begin={lamp.delay}
                calcMode="discrete"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        <rect
          x={inset + 20}
          y={scanTop}
          width={Math.max(0, w * 0.58)}
          height={scanHeight}
          fill={fade(mergedColor[1] || defaultColor[1], 35)}
        >
          <animate
            attributeName="y"
            values={`${scanTop};${scanTop + (scanBottom - scanTop) * 0.28};${scanTop + (scanBottom - scanTop) * 0.28};${scanTop + (scanBottom - scanTop) * 0.62};${scanTop + (scanBottom - scanTop) * 0.62};${scanBottom};${scanTop}`}
            keyTimes="0;0.18;0.34;0.5;0.68;0.84;1"
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.15;0.9;0.2;0.85;0;0.7;0.25"
            dur={`${dur}s`}
            calcMode="discrete"
            repeatCount="indefinite"
          />
          <animate
            attributeName="width"
            values={`${w * 0.58};${w * 0.58};${w * 0.32};${w * 0.5};${w * 0.18};${w * 0.58};${w * 0.4}`}
            dur={`${dur}s`}
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </rect>
        <polyline
          fill="transparent"
          stroke={mergedColor[0]}
          strokeWidth="1.6"
          points={`${w / 2 - 12},4 ${w / 2},12 ${w / 2 + 12},4`}
        >
          <animate
            attributeName="opacity"
            values="0.2;1;0.15;0.9;0;1"
            dur="0.9s"
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
