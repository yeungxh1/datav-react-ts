import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#2cf7fe', '#00c2ff']

export type Decoration20Props = Pick<DecorationProps, 'children' | 'className' | 'style' | 'color'>

export function Decoration20({ children, className, style, color = [] }: Decoration20Props) {
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-20', className), [className])

  return (
    <div className={classNames} style={style}>
      <svg width="46px" height="22px">
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="2" points="36,1 45,11 36,21" />
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points="26,1 35,11 26,21" />
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="1.2" points="2,4 18,4" />
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="1.2" points="2,18 18,18" />
        {[6, 10, 14].map((x) => (
          <line key={x} x1={x} y1="7" x2={x} y2="15" stroke={mergedColor[1]} strokeWidth="1" />
        ))}
      </svg>
      {children}
      <svg width="46px" height="22px">
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="2" points="10,1 1,11 10,21" />
        <polyline fill="transparent" stroke={mergedColor[1]} strokeWidth="2" points="20,1 11,11 20,21" />
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="1.2" points="28,4 44,4" />
        <polyline fill="transparent" stroke={mergedColor[0]} strokeWidth="1.2" points="28,18 44,18" />
        {[32, 36, 40].map((x) => (
          <line key={x} x1={x} y1="7" x2={x} y2="15" stroke={mergedColor[1]} strokeWidth="1" />
        ))}
      </svg>
    </div>
  )
}
