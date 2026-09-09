import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#ff6b4a', '#ffde93']

export type BorderBox20Props = BoxProps & { dur?: number }

export function BorderBox20({
  children,
  className,
  style,
  color = [],
  dur = 1.1,
  backgroundColor = 'transparent',
  ref
}: BorderBox20Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-20', className), [className])
  const w = width || 240
  const h = height || 140
  const hull = `
    18,4 ${w - 18},4 ${w - 4},18 ${w - 4},${h - 42}
    ${w - 16},${h - 30} ${w - 8},${h - 24} ${w - 22},${h - 20}
    ${w - 12},${h - 11} ${w - 34},${h - 4} 18,${h - 4} 4,${h - 18} 4,18
  `
  const inner = `
    26,14 ${w - 26},14 ${w - 14},26 ${w - 14},${h - 48}
    ${w - 28},${h - 36} ${w - 40},${h - 16} 26,${h - 14} 14,${h - 26} 14,26
  `
  const bolts = [
    [12, 12],
    [w - 12, 12],
    [12, h - 12]
  ]
  const deadBolt = [w - 28, h - 16]
  const cracks = [
    `${w - 22},${h - 20} ${w - 54},${h - 42} ${w - 48},${h - 58}`,
    `${w - 54},${h - 42} ${w - 76},${h - 34}`,
    `${w - 16},${h - 30} ${w - 36},${h - 48}`
  ]
  const sparks = [
    { x1: w - 18, y1: h - 26, x2: w - 6, y2: h - 18, delay: '0s' },
    { x1: w - 10, y1: h - 22, x2: w + 2, y2: h - 30, delay: '0.12s' },
    { x1: w - 14, y1: h - 14, x2: w - 2, y2: h - 4, delay: '0.28s' },
    { x1: w - 24, y1: h - 12, x2: w - 8, y2: h + 2, delay: '0.44s' },
    { x1: w - 8, y1: h - 28, x2: w + 4, y2: h - 16, delay: '0.61s' }
  ]
  const lamps = [
    { x: 28, y: 8, live: true, delay: '0s' },
    { x: w / 2, y: 8, live: true, delay: '0.35s' },
    { x: w - 36, y: 8, live: false, delay: '0s' },
    { x: 28, y: h - 8, live: true, delay: '0.7s' },
    { x: w / 2, y: h - 8, live: false, delay: '0s' }
  ]

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <polygon fill={backgroundColor} stroke={mergedColor[0]} strokeWidth="1.6" points={hull} />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 55)}
          strokeWidth="1"
          strokeDasharray="6 5 2 7"
          points={inner}
        />
        {cracks.map((points, i) => (
          <polyline
            key={i}
            points={points}
            fill="transparent"
            stroke={mergedColor[0]}
            strokeWidth={i === 0 ? 1.6 : 1.1}
            strokeLinecap="round"
          />
        ))}
        {bolts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={fade(mergedColor[1] || defaultColor[1], 28)} stroke={mergedColor[0]} />
            <circle cx={x} cy={y} r="1.5" fill={mergedColor[1]}>
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur="2.2s"
                begin={`${i * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        <circle
          cx={deadBolt[0]}
          cy={deadBolt[1]}
          r="4"
          fill="transparent"
          stroke={fade(mergedColor[0] || defaultColor[0], 35)}
          strokeDasharray="2 3"
        />
        {lamps.map((lamp, i) =>
          lamp.live ? (
            <circle key={i} cx={lamp.x} cy={lamp.y} r="2.2" fill={mergedColor[1]}>
              <animate
                attributeName="opacity"
                values="0.2;1;0.25;0.85;0.2"
                dur="1.8s"
                begin={lamp.delay}
                repeatCount="indefinite"
              />
            </circle>
          ) : (
            <circle key={i} cx={lamp.x} cy={lamp.y} r="2.2" fill={fade(mergedColor[0] || defaultColor[0], 22)} />
          )
        )}
        {sparks.map((spark, i) => (
          <line
            key={i}
            x1={spark.x1}
            y1={spark.y1}
            x2={spark.x2}
            y2={spark.y2}
            stroke={mergedColor[1]}
            strokeWidth="1.3"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0;1;0;0.7;0;1;0.15;0"
              dur={`${dur}s`}
              begin={spark.delay}
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </line>
        ))}
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="1.4"
          points={`${w - 34},${h - 4} ${w - 22},${h - 20}`}
        >
          <animate
            attributeName="opacity"
            values="0.2;1;0.1;0.8;0.3"
            dur={`${dur + 0.4}s`}
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
