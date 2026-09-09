import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#3f96a5', '#3f96a5']

export type Decoration8Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'reverse' | 'ref'>

export function Decoration8({ reverse = false, className, style, color = [], ref }: Decoration8Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const xPos = (pos: number) => (!reverse ? pos : width - pos)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const [pointsOne, pointsTwo, pointsThree] = useMemo(
    () => [
      `${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`,
      `${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`,
      `${xPos(0)}, ${height - 3}, ${xPos(200)}, ${height - 3}`
    ],
    [reverse, width, height]
  )
  const classNames = useMemo(() => classnames('dv-decoration-8', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        <polyline stroke={mergedColor[0]} strokeWidth="2" fill="transparent" points={pointsOne} />
        <polyline stroke={mergedColor[0]} strokeWidth="2" fill="transparent" points={pointsTwo} />
        <polyline stroke={mergedColor[1]} fill="transparent" strokeWidth="3" points={pointsThree} />
      </svg>
    </div>
  )
}
