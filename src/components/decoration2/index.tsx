import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#3faacb', '#fff']

export type Decoration2Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'reverse' | 'dur' | 'ref'>

export function Decoration2({ reverse = false, dur = 6, className, style, color = [], ref }: Decoration2Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const { x, y, w, h } = useMemo(
    () => (reverse ? { w: 1, h: height, x: width / 2, y: 0 } : { w: width, h: 1, x: 0, y: height / 2 }),
    [reverse, width, height]
  )
  const classNames = useMemo(() => classnames('dv-decoration-2', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={`${width}px`} height={`${height}px`}>
        <rect x={x} y={y} width={w} height={h} fill={mergedColor[0]}>
          <animate
            attributeName={reverse ? 'height' : 'width'}
            from="0"
            to={reverse ? height : width}
            dur={`${dur}s`}
            calcMode="spline"
            keyTimes="0;1"
            keySplines=".42,0,.58,1"
            repeatCount="indefinite"
          />
        </rect>
        <rect x={x} y={y} width="1" height="1" fill={mergedColor[1]}>
          <animate
            attributeName={reverse ? 'y' : 'x'}
            from="0"
            to={reverse ? height : width}
            dur={`${dur}s`}
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42,0,0.58,1"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  )
}
