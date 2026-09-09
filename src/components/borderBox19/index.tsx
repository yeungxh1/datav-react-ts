import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#1677b3']

function octagon(w: number, h: number, cut: number, pad: number) {
  const l = pad
  const t = pad
  const r = w - pad
  const b = h - pad
  const c = Math.max(8, cut - pad * 0.35)
  return `${l + c},${t} ${r - c},${t} ${r},${t + c} ${r},${b - c} ${r - c},${b} ${l + c},${b} ${l},${b - c} ${l},${t + c}`
}

export type BorderBox19Props = BoxProps & { dur?: number }

export function BorderBox19({
  children,
  className,
  style,
  color = [],
  dur = 6,
  backgroundColor = 'transparent',
  ref
}: BorderBox19Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const clipId = useRef(`border-box-19-clip-${uuid()}`).current
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-19', className), [className])
  const w = width || 240
  const h = height || 140
  const cut = Math.min(36, w * 0.16, h * 0.28)
  const outer = octagon(w, h, cut, 4)
  const inner = octagon(w, h, cut, 14)
  const nodes = useMemo(() => {
    const pad = 4
    const c = Math.max(8, cut - pad * 0.35)
    return [
      [pad + c, pad],
      [w - pad - c, pad],
      [w - pad, pad + c],
      [w - pad, h - pad - c],
      [w - pad - c, h - pad],
      [pad + c, h - pad],
      [pad, h - pad - c],
      [pad, pad + c]
    ] as Array<[number, number]>
  }, [w, h, cut])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg className="dv-border-svg-container" width={w} height={h}>
        <defs>
          <clipPath id={clipId}>
            <polygon points={outer} />
          </clipPath>
        </defs>
        <polygon fill={backgroundColor} stroke={mergedColor[0]} strokeWidth="1.6" points={outer} />
        <polygon
          fill="transparent"
          stroke={fade(mergedColor[1] || defaultColor[1], 75)}
          strokeWidth="1"
          strokeDasharray="9 7"
          points={inner}
        >
          <animate attributeName="stroke-dashoffset" values="0;-64" dur={`${dur}s`} repeatCount="indefinite" />
        </polygon>
        <g clipPath={`url(#${clipId})`}>
          <rect x="4" y="4" width={Math.max(0, w - 8)} height="12" fill={fade(mergedColor[0] || defaultColor[0], 28)}>
            <animate
              attributeName="y"
              values={`4;${Math.max(4, h - 16)};4`}
              dur={`${Math.max(2.4, dur * 0.55)}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.4" fill={fade(mergedColor[1] || defaultColor[1], 30)} stroke={mergedColor[0]} />
            <circle cx={x} cy={y} r="1.4" fill={mergedColor[0]}>
              <animate
                attributeName="opacity"
                values="0.25;1;0.25"
                dur="1.7s"
                begin={`${i * 0.16}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={`${w / 2 - 14},4 ${w / 2 + 14},4`} />
      </svg>
      <div className="border-box-content">{children}</div>
    </div>
  )
}
