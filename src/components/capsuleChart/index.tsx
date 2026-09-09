import { Fragment, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge } from '../../utils'
import './style.less'

export type CapsuleChartConfig = {
  data?: { name: string; value: number }[]
  colors?: string[]
  unit?: string
  showValue?: boolean
}

export type CapsuleChartProps = {
  config?: CapsuleChartConfig
  className?: string
  style?: CSSProperties
}

const defaultConfig: Required<CapsuleChartConfig> = {
  data: [],
  colors: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],
  unit: '',
  showValue: false
}

export function CapsuleChart({ config = {}, className, style }: CapsuleChartProps) {
  const [{ mergedConfig, labelData, capsuleLength, capsuleValue }, setState] = useState({
    mergedConfig: null as Required<CapsuleChartConfig> | null,
    labelData: [] as number[],
    capsuleLength: [] as number[],
    capsuleValue: [] as number[]
  })

  useEffect(() => {
    const next = deepMerge(deepClone(defaultConfig), config)
    const { data } = next
    if (!data.length) {
      setState({ mergedConfig: next, labelData: [], capsuleLength: [], capsuleValue: [] })
      return
    }
    const values = data.map(({ value }) => value)
    const maxValue = Math.max(...values)
    const oneFifth = maxValue / 5
    setState({
      mergedConfig: next,
      capsuleValue: values,
      capsuleLength: values.map((v) => (maxValue ? v / maxValue : 0)),
      labelData: [...new Set(new Array(6).fill(0).map((_, i) => Math.ceil(i * oneFifth)))]
    })
  }, [config])

  const classNames = useMemo(() => classnames('dv-capsule-chart', className), [className])

  return (
    <div className={classNames} style={style}>
      {!!mergedConfig && (
        <Fragment>
          <div className="label-column">
            {mergedConfig.data.map(({ name }) => (
              <div key={name}>{name}</div>
            ))}
            <div>&nbsp;</div>
          </div>
          <div className="capsule-container">
            {capsuleLength.map((capsule, index) => (
              <div className="capsule-item" key={index}>
                <div
                  className="capsule-item-column"
                  style={{
                    width: `${capsule * 100}%`,
                    backgroundColor: `${mergedConfig.colors[index % mergedConfig.colors.length]}`
                  }}
                >
                  {mergedConfig.showValue && <div className="capsule-item-value">{capsuleValue[index]}</div>}
                </div>
              </div>
            ))}
            <div className="unit-label">
              {labelData.map((label, index) => (
                <div key={`${label}-${index}`}>{label}</div>
              ))}
            </div>
          </div>
          {!!mergedConfig.unit && <div className="unit-text">{mergedConfig.unit}</div>}
        </Fragment>
      )}
    </div>
  )
}
