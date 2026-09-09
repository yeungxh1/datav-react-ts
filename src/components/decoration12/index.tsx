import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, fade, getCircleRadianPoint, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2783ce', '#2cf7fe']
const segment = 30
const sectorAngle = Math.PI / 3
const ringNum = 3
const ringWidth = 1

export type Decoration12Props = Pick<
  DecorationProps,
  'children' | 'className' | 'style' | 'color' | 'scanDur' | 'haloDur' | 'ref'
>

export function Decoration12({
  children,
  className,
  style,
  color = [],
  scanDur = 3,
  haloDur = 2,
  ref
}: Decoration12Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const x = width / 2
  const y = height / 2
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const pathD = useMemo(() => {
    const startAngle = -Math.PI / 2
    const angleGap = sectorAngle / segment
    const r = width / 4
    let lastEndPoints: Array<number | string> = getCircleRadianPoint(x, y, r, startAngle)
    return new Array(segment).fill('').map((_, i) => {
      const endPoints = getCircleRadianPoint(x, y, r, startAngle - (i + 1) * angleGap).map((n) => n.toFixed(5))
      const d = `M${lastEndPoints.join(',')} A${r}, ${r} 0 0 0 ${endPoints.join(',')}`
      lastEndPoints = endPoints
      return d
    })
  }, [x, y, width])
  const pathColor = useMemo(() => {
    const base = mergedColor[0]
    const colorGap = 100 / (segment - 1)
    return new Array(segment).fill(base).map((_, i) => fade(base, 100 - i * colorGap))
  }, [mergedColor])
  const circleR = useMemo(() => {
    const radiusGap = (width / 2 - ringWidth / 2) / ringNum
    return new Array(ringNum).fill(0).map((_, i) => radiusGap * (i + 1))
  }, [width])
  const splitLinePoints = useMemo(() => {
    const angleGap = Math.PI / 6
    const r = width / 2
    return new Array(6).fill('').map((_, i) => {
      const startAngle = angleGap * (i + 1)
      const startPoint = getCircleRadianPoint(x, y, r, startAngle)
      const endPoint = getCircleRadianPoint(x, y, r, startAngle + Math.PI)
      return `${startPoint.join(',')} ${endPoint.join(',')}`
    })
  }, [x, y, width])
  const arcD = useMemo(() => {
    const angleGap = Math.PI / 6
    const r = width / 2 - 1
    return new Array(4).fill('').map((_, i) => {
      const startAngle = angleGap * (3 * i + 1)
      const startPoint = getCircleRadianPoint(x, y, r, startAngle)
      const endPoint = getCircleRadianPoint(x, y, r, startAngle + angleGap)
      return `M${startPoint.join(',')} A${x}, ${y} 0 0 1 ${endPoint.join(',')}`
    })
  }, [x, y, width])
  const idRef = useRef({
    gId: `decoration-12-g-${uuid()}`,
    gradientId: `decoration-12-gradient-${uuid()}`
  })
  const classNames = useMemo(() => classnames('dv-decoration-12', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        <defs>
          <g id={idRef.current.gId}>
            {pathD.map((d, i) => (
              <path stroke={pathColor[i]} strokeWidth={width / 2} fill="transparent" key={i} d={d} />
            ))}
          </g>
          <radialGradient id={idRef.current.gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" stopOpacity="1" />
            <stop offset="100%" stopColor={fade(mergedColor[1] || defaultColor[1], 30)} stopOpacity="1" />
          </radialGradient>
        </defs>
        {circleR.map((r) => (
          <circle key={r} r={r} cx={x} cy={y} stroke={mergedColor[1]} strokeWidth={0.5} fill="transparent" />
        ))}
        <circle r="1" cx={x} cy={y} stroke="transparent" fill={`url(#${idRef.current.gradientId})`}>
          <animate attributeName="r" values={`1;${width / 2}`} dur={`${haloDur}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur={`${haloDur}s`} repeatCount="indefinite" />
        </circle>
        <circle r="2" cx={x} cy={y} fill={mergedColor[1]} />
        <g>
          {splitLinePoints.map((p, i) => (
            <polyline key={i} points={p} stroke={mergedColor[1]} strokeWidth={0.5} opacity="0.5" />
          ))}
        </g>
        {arcD.map((d, i) => (
          <path key={i} d={d} stroke={mergedColor[1]} strokeWidth="2" fill="transparent" />
        ))}
        <use href={`#${idRef.current.gId}`}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0, ${x} ${y};360, ${x} ${y}`}
            dur={`${scanDur}s`}
            repeatCount="indefinite"
          />
        </use>
      </svg>
      <div className="decoration-content">{children}</div>
    </div>
  )
}
