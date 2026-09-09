import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#1677b3']

export type BorderBox18Props = BoxProps & { dur?: number }

export function BorderBox18({
  children,
  className,
  style,
  color = [],
  dur = 2.8,
  backgroundColor = 'transparent',
  ref
}: BorderBox18Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-18', className), [className])
  const w = width || 240
  const h = height || 140
  const visor = Math.min(28, h * 0.22)
  const lamps = useMemo(() => {
    const count = 5
    const start = 28
    const span = Math.max(1, w - start * 2)
    return new Array(count).fill(0).map((_, i) => start + (span * i) / (count - 1))
  }, [w])
  const chevrons = [w / 2 - 22, w / 2, w / 2 + 22]

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <polygon
          fill={backgroundColor}
          stroke={fade(mergedColor[1] || defaultColor[1], 60)}
          strokeWidth="1"
          points={`8,${visor} ${w - 8},${visor} ${w - 8},${h - 10} 8,${h - 10}`}
        />
        <polygon
          fill={fade(mergedColor[1] || defaultColor[1], 18)}
          stroke={mergedColor[0]}
          strokeWidth="1.6"
          points={`22,4 ${w - 22},4 ${w - 6},${visor} 6,${visor}`}
        />
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="1.2"
          points={`4,${visor - 2} 4,${h * 0.58} 12,${h * 0.66}`}
        />
        <polyline
          fill="transparent"
          stroke={mergedColor[1]}
          strokeWidth="1.2"
          points={`${w - 4},${visor - 2} ${w - 4},${h * 0.58} ${w - 12},${h * 0.66}`}
        />
        <circle cx="4" cy={h * 0.58} r="2.2" fill={mergedColor[0]}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.7s" repeatCount="indefinite" />
        </circle>
        <circle cx={w - 4} cy={h * 0.58} r="2.2" fill={mergedColor[0]}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.7s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        {chevrons.map((x, i) => (
          <polyline
            key={i}
            fill="transparent"
            stroke={mergedColor[0]}
            strokeWidth="1.4"
            points={`${x - 7},${visor - 16} ${x},${visor - 8} ${x + 7},${visor - 16}`}
          />
        ))}
        {lamps.map((x, i) => (
          <circle key={i} cx={x} cy={visor / 2 + 1} r="2.1" fill={mergedColor[0]}>
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur="1.5s"
              begin={`${i * 0.18}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        <rect x="22" y="7" width="16" height={Math.max(8, visor - 12)} fill={fade(mergedColor[0] || defaultColor[0], 70)}>
          <animate attributeName="x" values={`22;${Math.max(22, w - 38)};22`} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur={`${dur}s`} repeatCount="indefinite" />
        </rect>
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="2" points={`22,${h - 6} ${w - 22},${h - 6}`} />
        <polyline
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 80)}
          strokeWidth="1"
          points={`28,${h - 11} ${w - 28},${h - 11}`}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 36 + ((w - 72) * i) / 5
          return (
            <line
              key={i}
              x1={x}
              y1={h - 14}
              x2={x}
              y2={h - 6}
              stroke={mergedColor[1]}
              strokeWidth="1"
            />
          )
        })}
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
