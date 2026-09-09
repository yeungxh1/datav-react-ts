import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { BoxProps } from '../../types'
import './style.less'

const border = ['left-top', 'right-top', 'left-bottom', 'right-bottom']
const defaultColor = ['#1d48c4', '#d3e1f8']

export type BorderBox10Props = BoxProps

export function BorderBox10({
  children,
  className,
  style,
  color = [],
  backgroundColor = 'transparent',
  ref
}: BorderBox10Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-border-box-10', className), [className])
  const styles = useMemo(
    () => ({
      boxShadow: `inset 0 0 25px 3px ${mergedColor[0]}`,
      ...style
    }),
    [style, mergedColor]
  )

  return (
    <div className={classNames} style={styles} ref={domRef}>
      <svg className="dv-border-svg-container" width={width} height={height}>
        <polygon
          fill={backgroundColor}
          points={`
          4, 0 ${width - 4}, 0 ${width}, 4 ${width}, ${height - 4} ${width - 4}, ${height}
          4, ${height} 0, ${height - 4} 0, 4
        `}
        />
      </svg>
      {border.map((borderName) => (
        <svg
          width="150px"
          height="150px"
          key={borderName}
          className={`${borderName} dv-border-svg-container`}
        >
          <polygon fill={mergedColor[1]} points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3" />
        </svg>
      ))}
      <div className="border-box-content">{children}</div>
    </div>
  )
}
