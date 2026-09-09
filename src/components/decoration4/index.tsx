import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)']

export type Decoration4Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'reverse' | 'dur' | 'ref'>

export function Decoration4({ reverse = false, dur = 3, className, style, color = [], ref }: Decoration4Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-4', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <div
        className={`container ${reverse ? 'reverse' : 'normal'}`}
        style={
          reverse
            ? { width: `${width}px`, height: '5px', animationDuration: `${dur}s` }
            : { width: '5px', height: `${height}px`, animationDuration: `${dur}s` }
        }
      >
        <svg width={reverse ? width : 5} height={reverse ? 5 : height}>
          <polyline stroke={mergedColor[0]} points={reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`} />
          <polyline
            className="bold-line"
            stroke={mergedColor[1]}
            strokeWidth="3"
            strokeDasharray="20, 80"
            strokeDashoffset="-30"
            points={reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`}
          />
        </svg>
      </div>
    </div>
  )
}
