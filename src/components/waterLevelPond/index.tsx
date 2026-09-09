import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import './style.less'

export type WaterLevelPondConfig = {
  data?: number[]
  shape?: 'rect' | 'roundRect' | 'round'
  waveNum?: number
  waveHeight?: number
  waveOpacity?: number
  colors?: string[]
  formatter?: string
}

export type WaterLevelPondProps = {
  config?: WaterLevelPondConfig
  className?: string
  style?: CSSProperties
}

const defaultConfig: Required<WaterLevelPondConfig> = {
  data: [],
  shape: 'rect',
  waveNum: 3,
  waveHeight: 40,
  waveOpacity: 0.4,
  colors: ['#3DE7C9', '#00BAFF'],
  formatter: '{value}%'
}

function calcSvgBorderGradient({ colors }: Required<WaterLevelPondConfig>) {
  const colorOffsetGap = colors.length > 1 ? 100 / (colors.length - 1) : 0
  return colors.map((c, i) => [colorOffsetGap * i, c] as [number, string])
}

function calcDetails({ data, formatter }: Required<WaterLevelPondConfig>) {
  if (!data.length) return ''
  return formatter.replace('{value}', String(Math.max(...data)))
}

function getWaveShapes(
  { waveNum, waveHeight, data }: Required<WaterLevelPondConfig>,
  w: number,
  h: number
) {
  const pointsNum = waveNum * 4 + 4
  const pointXGap = w / waveNum / 2
  return data.map((v) => {
    const points = new Array(pointsNum).fill(0).map((_, j) => {
      const x = w - pointXGap * j + pointXGap * 2
      const startY = (1 - v / 100) * h
      const y = j % 2 === 0 ? startY : startY - waveHeight
      return [x, y]
    })
    return { points }
  })
}

function drawWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shapes: { points: number[][] }[],
  colors: string[],
  opacity: number,
  offsetX: number
) {
  ctx.clearRect(0, 0, width, height)
  shapes.forEach((shape, index) => {
    ctx.beginPath()
    const pts = shape.points.map(([x, y]) => [x + offsetX, y] as [number, number])
    if (!pts.length) return
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i][0] + pts[i + 1][0]) / 2
      const yc = (pts[i][1] + pts[i + 1][1]) / 2
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc)
    }
    const last = pts[pts.length - 1]
    ctx.lineTo(last[0], last[1])
    ctx.lineTo(pts[pts.length - 1][0], height)
    ctx.lineTo(pts[0][0], height)
    ctx.closePath()
    ctx.fillStyle = colors[index % colors.length]
    ctx.globalAlpha = opacity
    ctx.fill()
  })
}

export function WaterLevelPond({ config = {}, className, style }: WaterLevelPondProps) {
  const { width, height, domRef } = useAutoResize()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gradientId = useRef(`water-level-pond-${uuid()}`).current
  const mergedConfig = useMemo(() => deepMerge(deepClone(defaultConfig), config), [config])
  const svgBorderGradient = useMemo(() => calcSvgBorderGradient(mergedConfig), [mergedConfig])
  const details = useMemo(() => calcDetails(mergedConfig), [mergedConfig])
  const radius =
    mergedConfig.shape === 'round' ? '50%' : mergedConfig.shape === 'roundRect' ? '10px' : '0'
  const classNames = useMemo(() => classnames('dv-water-pond-level', className), [className])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !width || !height) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const shapes = getWaveShapes(mergedConfig, width, height)
    let offset = 0
    let frame = 0
    const tick = () => {
      offset = (offset + 1.2) % width
      drawWaves(ctx, width, height, shapes, mergedConfig.colors, mergedConfig.waveOpacity, offset)
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [mergedConfig, width, height])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            {svgBorderGradient.map((lc) => (
              <stop key={lc[0]} offset={lc[0]} stopColor={lc[1]} />
            ))}
          </linearGradient>
        </defs>
        <text
          stroke={`url(#${gradientId})`}
          fill={`url(#${gradientId})`}
          x={width / 2 + 8}
          y={height / 2 + 8}
        >
          {details}
        </text>
        {mergedConfig.shape === 'round' ? (
          <ellipse
            cx={width / 2 + 8}
            cy={height / 2 + 8}
            rx={width / 2 + 5}
            ry={height / 2 + 5}
            stroke={`url(#${gradientId})`}
          />
        ) : (
          <rect
            x="2"
            y="2"
            rx={mergedConfig.shape === 'roundRect' ? 10 : 0}
            ry={mergedConfig.shape === 'roundRect' ? 10 : 0}
            width={width + 12}
            height={height + 12}
            stroke={`url(#${gradientId})`}
          />
        )}
      </svg>
      <canvas ref={canvasRef} style={{ borderRadius: radius }} />
    </div>
  )
}
