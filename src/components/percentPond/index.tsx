import { useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import './style.less'

export type PercentPondConfig = {
  value?: number
  colors?: string[]
  borderWidth?: number
  borderGap?: number
  lineDash?: number[]
  textColor?: string
  borderRadius?: number
  localGradient?: boolean
  formatter?: string
}

export type PercentPondProps = {
  config?: PercentPondConfig
  className?: string
  style?: CSSProperties
}

const defaultConfig: Required<PercentPondConfig> = {
  value: 0,
  colors: ['#3DE7C9', '#00BAFF'],
  borderWidth: 3,
  borderGap: 3,
  lineDash: [5, 1],
  textColor: '#fff',
  borderRadius: 5,
  localGradient: false,
  formatter: '{value}%'
}

export function PercentPond({ config = {}, className, style }: PercentPondProps) {
  const { width, height, domRef } = useAutoResize()
  const { gradientId1, gradientId2 } = useRef({
    gradientId1: `percent-pond-gradientId1-${uuid()}`,
    gradientId2: `percent-pond-gradientId2-${uuid()}`
  }).current
  const mergedConfig = useMemo(() => deepMerge(deepClone(defaultConfig), config), [config])

  const rectWidth = width - mergedConfig.borderWidth
  const rectHeight = height - mergedConfig.borderWidth
  const halfHeight = height / 2
  const points = useMemo(() => {
    const { borderWidth, borderGap, value } = mergedConfig
    const polylineLength = ((width - (borderWidth + borderGap) * 2) / 100) * value
    return `
      ${borderWidth + borderGap}, ${halfHeight}
      ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
    `
  }, [mergedConfig, width, halfHeight])
  const polylineWidth = height - (mergedConfig.borderWidth + mergedConfig.borderGap) * 2
  const linearGradient = useMemo(() => {
    const { colors } = mergedConfig
    const colorOffsetGap = colors.length > 1 ? 100 / (colors.length - 1) : 0
    return colors.map((c, i) => [colorOffsetGap * i, c] as [number, string])
  }, [mergedConfig])
  const polylineGradient = mergedConfig.localGradient ? gradientId1 : gradientId2
  const gradient2XPos = `${200 - mergedConfig.value}%`
  const details = mergedConfig.formatter.replace('{value}', String(mergedConfig.value))

  const classNames = useMemo(() => classnames('dv-percent-pond', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg>
        <defs>
          <linearGradient id={gradientId1} x1="0%" y1="0%" x2="100%" y2="0%">
            {linearGradient.map((lc) => (
              <stop key={lc[0]} offset={`${lc[0]}%`} stopColor={lc[1]} />
            ))}
          </linearGradient>
          <linearGradient id={gradientId2} x1="0%" y1="0%" x2={gradient2XPos} y2="0%">
            {linearGradient.map((lc) => (
              <stop key={`g2-${lc[0]}`} offset={`${lc[0]}%`} stopColor={lc[1]} />
            ))}
          </linearGradient>
        </defs>
        <rect
          x={mergedConfig.borderWidth / 2}
          y={mergedConfig.borderWidth / 2}
          rx={mergedConfig.borderRadius}
          ry={mergedConfig.borderRadius}
          fill="transparent"
          strokeWidth={mergedConfig.borderWidth}
          stroke={`url(#${gradientId1})`}
          width={rectWidth > 0 ? rectWidth : 0}
          height={rectHeight > 0 ? rectHeight : 0}
        />
        <polyline
          strokeWidth={polylineWidth}
          strokeDasharray={mergedConfig.lineDash.join(',')}
          stroke={`url(#${polylineGradient})`}
          points={points}
        />
        <text stroke={mergedConfig.textColor} fill={mergedConfig.textColor} x={width / 2} y={height / 2}>
          {details}
        </text>
      </svg>
    </div>
  )
}
