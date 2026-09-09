import { useCallback, useMemo, useRef } from 'react'
import type { CSSProperties, Ref } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, getPointDistance, randomExtend, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import './style.less'

export type FlylineChartConfig = {
  centerPoint?: [number, number]
  points?: number[][]
  lineWidth?: number
  orbitColor?: string
  flylineColor?: string
  k?: number
  curvature?: number
  flylineRadius?: number
  duration?: [number, number]
  relative?: boolean
  bgImgUrl?: string
  text?: { offset?: [number, number]; color?: string; fontSize?: number }
  halo?: { show?: boolean; duration?: number; color?: string; radius?: number }
  centerPointImg?: { width?: number; height?: number; url?: string }
  pointsImg?: { width?: number; height?: number; url?: string }
}

export type FlylineChartProps = {
  config?: FlylineChartConfig
  dev?: boolean
  className?: string
  style?: CSSProperties
  ref?: Ref<AutoResizeHandle>
}

const defaultConfig: Required<FlylineChartConfig> = {
  centerPoint: [0, 0],
  points: [],
  lineWidth: 1,
  orbitColor: 'rgba(103, 224, 227, .2)',
  flylineColor: '#ffde93',
  k: -0.5,
  curvature: 5,
  flylineRadius: 100,
  duration: [20, 30],
  relative: true,
  bgImgUrl: '',
  text: { offset: [0, 15], color: '#ffdb5c', fontSize: 12 },
  halo: { show: true, duration: 30, color: '#fb7293', radius: 120 },
  centerPointImg: { width: 40, height: 40, url: '' },
  pointsImg: { width: 15, height: 15, url: '' }
}

function getControlPoint([sx, sy]: number[], [ex, ey]: number[], curvature: number, k: number) {
  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2
  const distance = getPointDistance([sx, sy], [ex, ey])
  if (!distance || !curvature) return [mx, my]
  const targetLength = distance / curvature
  const step = targetLength / 2 || 1
  let dx = mx
  let dy = my
  let guard = 0
  while (getPointDistance([mx, my], [dx, dy]) < targetLength && guard < 200) {
    dx += step
    dy = my - k * mx + k * dx
    guard += 1
  }
  return [dx, dy]
}

export function FlylineChart({ config = {}, dev = false, className, style, ref }: FlylineChartProps) {
  const { width, height, domRef } = useAutoResize(ref)
  const ids = useRef({
    unique: Math.random(),
    gradientId: `gradient-id-${uuid()}`,
    gradient2Id: `gradient2-id-${uuid()}`
  }).current
  const merged = useMemo(() => deepMerge(deepClone(defaultConfig), config), [config])
  const toAbs = (point: number[]): [number, number] =>
    merged.relative ? [point[0] * width, point[1] * height] : [point[0], point[1]]
  const center = toAbs(merged.centerPoint)
  const points = merged.points.map(toAbs)
  const paths = points.map((point) => {
    const control = getControlPoint(point, center, merged.curvature, merged.k)
    return `M${point.toString()} Q${control.toString()} ${center.toString()}`
  })
  const times = points.map(() => randomExtend(...merged.duration) / 10)
  const classNames = useMemo(() => classnames('dv-flyline-chart', className), [className])
  const consoleClickPos = useCallback(
    ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
      if (!dev) return
      console.warn(`dv-flyline-chart DEV: [${nativeEvent.offsetX}, ${nativeEvent.offsetY}]`)
    },
    [dev]
  )

  return (
    <div
      className={classNames}
      ref={domRef}
      style={{ backgroundImage: `url(${merged.bgImgUrl})`, ...style }}
      onClick={consoleClickPos}
    >
      <svg width={width} height={height}>
        <defs>
          <radialGradient id={ids.gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.gradient2Id} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={`${d}-${i}`}>
            <path d={d} fill="transparent" stroke={merged.orbitColor} strokeWidth={Math.max(merged.lineWidth, 1)} />
            <circle className="dv-flyline-dot" r={6} fill={merged.flylineColor}>
              <animateMotion dur={`${times[i]}s`} path={d} rotate="auto" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {points.map((point, i) => (
          <circle key={`pt-${i}`} cx={point[0]} cy={point[1]} r={4} fill={merged.flylineColor} />
        ))}
        <circle cx={center[0]} cy={center[1]} r={6} fill={merged.halo.color ?? '#fb7293'} />
        {merged.halo.show && (
          <circle cx={center[0]} cy={center[1]} fill={merged.halo.color}>
            <animate attributeName="r" values={`1;${merged.halo.radius ?? 120}`} dur={`${(merged.halo.duration ?? 30) / 10}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur={`${(merged.halo.duration ?? 30) / 10}s`} repeatCount="indefinite" />
          </circle>
        )}
        {merged.centerPointImg.url && (
          <image
            href={merged.centerPointImg.url}
            width={merged.centerPointImg.width}
            height={merged.centerPointImg.height}
            x={center[0] - (merged.centerPointImg.width ?? 0) / 2}
            y={center[1] - (merged.centerPointImg.height ?? 0) / 2}
          />
        )}
      </svg>
    </div>
  )
}
