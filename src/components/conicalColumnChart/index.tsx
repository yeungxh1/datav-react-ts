import { useMemo } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import type { CSSProperties, Ref } from 'react'
import './style.less'

export type ConicalColumnChartConfig = {
  data?: { name: string; value: number }[]
  img?: string[]
  fontSize?: number
  imgSideLength?: number
  columnColor?: string
  textColor?: string
  showValue?: boolean
}

export type ConicalColumnChartProps = {
  config?: ConicalColumnChartConfig
  className?: string
  style?: CSSProperties
  ref?: Ref<AutoResizeHandle>
}

const defaultConfig: Required<ConicalColumnChartConfig> = {
  data: [],
  img: [],
  fontSize: 12,
  imgSideLength: 30,
  columnColor: 'rgba(0, 194, 255, 0.4)',
  textColor: '#fff',
  showValue: false
}

function sortData(data: { name: string; value: number }[]) {
  const cloned = deepClone(data)
  cloned.sort((a, b) => b.value - a.value)
  const max = cloned[0] ? cloned[0].value : 10
  return cloned.map((item) => ({ ...item, percent: max ? item.value / max : 0 }))
}

export function ConicalColumnChart({ config = {}, className, style, ref }: ConicalColumnChartProps) {
  const { width, height, domRef } = useAutoResize(ref)
  const { mergedConfig, column } = useMemo(() => {
    const merged = deepMerge(deepClone(defaultConfig), config)
    const data = sortData(merged.data)
    const itemNum = data.length
    const gap = width / (itemNum + 1)
    const useAbleHeight = height - merged.imgSideLength - merged.fontSize - 5
    const svgBottom = height - merged.fontSize - 5
    return {
      mergedConfig: { ...merged, data },
      column: data.map((item, i) => {
        const middleXPos = gap * (i + 1)
        const leftXPos = gap * i
        const rightXpos = gap * (i + 2)
        const middleYPos = svgBottom - useAbleHeight * item.percent
        const controlYPos = useAbleHeight * item.percent * 0.6 + middleYPos
        return {
          ...item,
          d: `
        M${leftXPos}, ${svgBottom}
        Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
        M${middleXPos},${middleYPos}
        Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
        L${leftXPos}, ${svgBottom}
        Z
      `,
          x: middleXPos,
          y: middleYPos,
          textY: (svgBottom + middleYPos) / 2 + merged.fontSize / 2
        }
      })
    }
  }, [config, width, height])
  const classNames = useMemo(() => classnames('dv-conical-column-chart', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        {column.map((item, i) => (
          <g key={i}>
            <path d={item.d} fill={mergedConfig.columnColor} />
            <text style={{ fontSize: `${mergedConfig.fontSize}px` }} fill={mergedConfig.textColor} x={item.x} y={height - 4}>
              {item.name}
            </text>
            {!!mergedConfig.img.length && (
              <image
                href={mergedConfig.img[i % mergedConfig.img.length]}
                width={mergedConfig.imgSideLength}
                height={mergedConfig.imgSideLength}
                x={item.x - mergedConfig.imgSideLength / 2}
                y={item.y - mergedConfig.imgSideLength}
              />
            )}
            {mergedConfig.showValue && (
              <text style={{ fontSize: `${mergedConfig.fontSize}px` }} fill={mergedConfig.textColor} x={item.x} y={item.textY}>
                {item.value}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
