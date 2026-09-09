import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, getPolylineLength } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#3f96a5', '#3f96a5']

export type Decoration5Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'dur' | 'ref'>

export function Decoration5({ className, dur = 1.2, style, color = [], ref }: Decoration5Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const { line1Points, line2Points, line1Length, line2Length } = useMemo(() => {
    const line1 = [
      [0, height * 0.2],
      [width * 0.18, height * 0.2],
      [width * 0.2, height * 0.4],
      [width * 0.25, height * 0.4],
      [width * 0.27, height * 0.6],
      [width * 0.72, height * 0.6],
      [width * 0.75, height * 0.4],
      [width * 0.8, height * 0.4],
      [width * 0.82, height * 0.2],
      [width, height * 0.2]
    ]
    const line2 = [
      [width * 0.3, height * 0.8],
      [width * 0.7, height * 0.8]
    ]
    return {
      line1Points: line1.map((point) => point.join(',')).join(' '),
      line2Points: line2.map((point) => point.join(',')).join(' '),
      line1Length: getPolylineLength(line1),
      line2Length: getPolylineLength(line2)
    }
  }, [width, height])
  const classNames = useMemo(() => classnames('dv-decoration-5', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="3" points={line1Points}>
          <animate
            attributeName="stroke-dasharray"
            attributeType="XML"
            from={`0, ${line1Length / 2}, 0, ${line1Length / 2}`}
            to={`0, 0, ${line1Length}, 0`}
            dur={`${dur}s`}
            begin="0s"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.4,1,0.49,0.98"
            repeatCount="indefinite"
          />
        </polyline>
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points={line2Points}>
          <animate
            attributeName="stroke-dasharray"
            attributeType="XML"
            from={`0, ${line2Length / 2}, 0, ${line2Length / 2}`}
            to={`0, 0, ${line2Length}, 0`}
            dur={`${dur}s`}
            begin="0s"
            calcMode="spline"
            keyTimes="0;1"
            keySplines=".4,1,.49,.98"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
    </div>
  )
}
