import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, getPointDistance, randomExtend, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import './style.less'

export type FlylinePoint = {
  name: string
  coordinate: [number, number]
  halo?: { show?: boolean; duration?: [number, number]; color?: string; radius?: number }
  text?: { show?: boolean; offset?: [number, number]; color?: string; fontSize?: number }
  icon?: { show?: boolean; src?: string; width?: number; height?: number }
}

export type Flyline = {
  source: string
  target: string
  width?: number
  color?: string
  orbitColor?: string
  duration?: [number, number]
  radius?: number
}

export type FlylineChartEnhancedConfig = {
  points?: FlylinePoint[]
  lines?: Flyline[]
  halo?: FlylinePoint['halo']
  text?: FlylinePoint['text']
  icon?: FlylinePoint['icon']
  line?: Omit<Flyline, 'source' | 'target'>
  bgImgSrc?: string
  k?: number
  curvature?: number
  relative?: boolean
}

export type FlylineChartEnhancedProps = {
  config?: FlylineChartEnhancedConfig
  dev?: boolean
  className?: string
  style?: CSSProperties
  ref?: Ref<AutoResizeHandle>
}

const defaultConfig = {
  points: [] as FlylinePoint[],
  lines: [] as Flyline[],
  halo: { show: false, duration: [20, 30] as [number, number], color: '#fb7293', radius: 120 },
  text: { show: false, offset: [0, 15] as [number, number], color: '#ffdb5c', fontSize: 12 },
  icon: { show: false, src: '', width: 15, height: 15 },
  line: { width: 1, color: '#ffde93', orbitColor: 'rgba(103, 224, 227, .2)', duration: [20, 30] as [number, number], radius: 100 },
  bgImgSrc: '',
  k: -0.5,
  curvature: 5,
  relative: true
}

function getControlPoint(
  [sx, sy]: number[],
  [ex, ey]: number[],
  { curvature, k }: { curvature: number; k: number }
) {
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

export function FlylineChartEnhanced({
  config = {},
  dev = false,
  className,
  style,
  ref
}: FlylineChartEnhancedProps) {
  const { width, height, domRef } = useAutoResize(ref)
  const ids = useRef({
    unique: Math.random(),
    flylineGradientId: `flyline-gradient-id-${uuid()}`,
    haloGradientId: `halo-gradient-id-${uuid()}`
  }).current
  const pathDomRef = useRef<Array<SVGPathElement | null>>([])
  const [flylineLengths, setFlylineLengths] = useState<number[]>([])

  const { mergedConfig, flylinePoints, flylines } = useMemo(() => {
    const merged = deepMerge(deepClone(defaultConfig), config as Partial<typeof defaultConfig>)
    const points = merged.points.map((item, i) => {
      const halo = deepMerge(deepClone(merged.halo), item.halo || {})
      const text = deepMerge(deepClone(merged.text), item.text || {})
      const icon = deepMerge(deepClone(merged.icon), item.icon || {})
      const coordinate: [number, number] = merged.relative
        ? [item.coordinate[0] * width, item.coordinate[1] * height]
        : item.coordinate
      return {
        ...item,
        coordinate,
        halo: { ...halo, time: randomExtend(...halo.duration) / 10 },
        icon: { ...icon, x: coordinate[0] - icon.width / 2, y: coordinate[1] - icon.height / 2 },
        text: { ...text, x: coordinate[0] + text.offset[0], y: coordinate[1] + text.offset[1] },
        key: `${coordinate.toString()}${i}`
      }
    })
    const lines = merged.lines.map((item) => {
      const line = deepMerge(deepClone(merged.line), item)
      const sourcePoint = points.find(({ name }) => name === item.source)?.coordinate
      const targetPoint = points.find(({ name }) => name === item.target)?.coordinate
      if (!sourcePoint || !targetPoint) {
        return { ...line, d: '', key: `${item.source}-${item.target}`, time: 2, radius: line.radius }
      }
      const control = getControlPoint(sourcePoint, targetPoint, merged)
      const path = [sourcePoint, control, targetPoint]
      return {
        ...line,
        path,
        key: `path${path.toString()}`,
        d: `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`,
        time: randomExtend(...line.duration) / 10
      }
    })
    return { mergedConfig: merged, flylinePoints: points, flylines: lines }
  }, [config, width, height])

  useEffect(() => {
    setFlylineLengths(
      flylines.map((_, i) => {
        const node = pathDomRef.current[i]
        return typeof node?.getTotalLength === 'function' ? node.getTotalLength() : 0
      })
    )
  }, [flylines])

  const consoleClickPos = useCallback(
    ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
      if (!dev) return
      const { offsetX, offsetY } = nativeEvent
      console.warn(
        `dv-flyline-chart-enhanced DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${(offsetX / width).toFixed(2)}, ${(offsetY / height).toFixed(2)}]`
      )
    },
    [width, height, dev]
  )

  const classNames = useMemo(() => classnames('dv-flyline-chart-enhanced', className), [className])

  return (
    <div
      className={classNames}
      ref={domRef}
      style={{ backgroundImage: `url(${mergedConfig.bgImgSrc})`, ...style }}
      onClick={consoleClickPos}
    >
      {!!flylines.length && (
        <svg width={width} height={height}>
          <defs>
            <radialGradient id={ids.flylineGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={ids.haloGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </radialGradient>
          </defs>
          {flylinePoints.map((point) => (
            <g key={point.key}>
              {point.halo.show && (
                <>
                  <defs>
                    <circle id={`halo${ids.unique}${point.key}`} cx={point.coordinate[0]} cy={point.coordinate[1]}>
                      <animate attributeName="r" values={`1;${point.halo.radius}`} dur={`${point.halo.time}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0" dur={`${point.halo.time}s`} repeatCount="indefinite" />
                    </circle>
                  </defs>
                  <mask id={`mask${ids.unique}${point.key}`}>
                    <use href={`#halo${ids.unique}${point.key}`} fill={`url(#${ids.haloGradientId})`} />
                  </mask>
                  <use href={`#halo${ids.unique}${point.key}`} fill={point.halo.color} mask={`url(#mask${ids.unique}${point.key})`} />
                </>
              )}
              {point.icon.show && (
                <image href={point.icon.src} width={point.icon.width} height={point.icon.height} x={point.icon.x} y={point.icon.y} />
              )}
              <circle cx={point.coordinate[0]} cy={point.coordinate[1]} r={4} fill={point.halo.color || '#ffde93'} />
              {point.text.show && (
                <text fill={point.text.color} x={point.text.x} y={point.text.y} style={{ fontSize: `${point.text.fontSize}px` }}>
                  {point.name}
                </text>
              )}
            </g>
          ))}
          {flylines.map((line, i) => (
            <g key={line.key}>
              <defs>
                <path id={line.key} ref={(el) => { pathDomRef.current[i] = el }} d={line.d} fill="transparent" />
              </defs>
              <use href={`#${line.key}`} strokeWidth={line.width} stroke={line.orbitColor} />
              <circle className="dv-flyline-dot" r={Math.max(4, (line.radius ?? 100) / 12)} fill={line.color}>
                <animateMotion dur={`${line.time}s`} path={line.d} rotate="auto" repeatCount="indefinite" />
              </circle>
              {!!flylineLengths[i] && (
                <use href={`#${line.key}`} strokeWidth={line.width} stroke={line.color} opacity="0.55">
                  <animate
                    attributeName="stroke-dasharray"
                    from={`0, ${flylineLengths[i]}`}
                    to={`${flylineLengths[i]}, 0`}
                    dur={`${line.time}s`}
                    repeatCount="indefinite"
                  />
                </use>
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
