import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import classnames from 'classnames'
import { co, deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import './style.less'

export type ScrollRankingRow = { name: string; value: number }

export type ScrollRankingBoardConfig = {
  data?: ScrollRankingRow[]
  rowNum?: number
  waitTime?: number
  carousel?: 'single' | 'page'
  unit?: string
  sort?: boolean
  valueFormatter?: ((row: ScrollRankingRow & { ranking: number; percent: number }) => string) | null
}

export type ScrollRankingBoardProps = {
  config?: ScrollRankingBoardConfig
  className?: string
  style?: CSSProperties
  ref?: Ref<AutoResizeHandle>
}

type RankRow = ScrollRankingRow & { ranking: number; percent: number; scroll: number }

const defaultConfig: Required<ScrollRankingBoardConfig> = {
  data: [],
  rowNum: 5,
  waitTime: 2000,
  carousel: 'single',
  unit: '',
  sort: true,
  valueFormatter: null
}

function calcRows({ data, rowNum, sort }: Required<ScrollRankingBoardConfig>): RankRow[] {
  const cloned = deepClone(data)
  if (sort) cloned.sort((a, b) => b.value - a.value)
  const values = cloned.map(({ value }) => value)
  const min = Math.min(...values) || 0
  const max = Math.max(...values) || 0
  const total = Math.abs(max) + Math.abs(min)
  let rows: RankRow[] = cloned.map((row, i) => ({
    ...row,
    ranking: i + 1,
    percent: total ? ((row.value + Math.abs(min)) / total) * 100 : 0,
    scroll: i
  }))
  if (rows.length > rowNum && rows.length < 2 * rowNum) rows = [...rows, ...rows]
  return rows.map((d, i) => ({ ...d, scroll: i }))
}

export function ScrollRankingBoard({ config = {}, className, style, ref }: ScrollRankingBoardProps) {
  const { height, domRef } = useAutoResize(ref)
  const [state, setState] = useState({
    mergedConfig: null as Required<ScrollRankingBoardConfig> | null,
    rows: [] as RankRow[],
    heights: [] as number[]
  })
  const { mergedConfig, rows, heights } = state
  const stateRef = useRef({
    ...state,
    rowsData: [] as RankRow[],
    avgHeight: 0,
    animationIndex: 0
  })
  Object.assign(stateRef.current, state)

  useEffect(() => {
    const merged = deepMerge(deepClone(defaultConfig), config)
    const nextRows = calcRows(merged)
    const avgHeight = height / merged.rowNum
    const nextHeights = new Array(nextRows.length).fill(avgHeight)
    const data = { mergedConfig: merged, rows: nextRows, heights: nextHeights }
    Object.assign(stateRef.current, data, { rowsData: nextRows, animationIndex: 0, avgHeight })
    setState((prev) => ({ ...prev, ...data }))
    if (merged.rowNum >= nextRows.length) return

    let start = true
    function* animation(first = false): Generator<Promise<void>> {
      const current = stateRef.current
      const { avgHeight, rowsData } = current
      let { animationIndex } = current
      const { waitTime, carousel, rowNum } = current.mergedConfig!
      const rowLength = rowsData.length
      if (first) yield new Promise((resolve) => setTimeout(resolve, waitTime))
      const animationNum = carousel === 'single' ? 1 : rowNum
      let view = rowsData.slice(animationIndex)
      view.push(...rowsData.slice(0, animationIndex))
      view = view.slice(0, rowNum + 1)
      const nextH = new Array(rowLength).fill(avgHeight)
      setState((prev) => ({ ...prev, rows: view, heights: nextH }))
      yield new Promise((resolve) => setTimeout(resolve, 300))
      animationIndex += animationNum
      const back = animationIndex - rowLength
      if (back >= 0) animationIndex = back
      const newHeights = [...nextH]
      newHeights.splice(0, animationNum, ...new Array(animationNum).fill(0))
      stateRef.current.animationIndex = animationIndex
      setState((prev) => ({ ...prev, heights: newHeights }))
    }
    function* loop(): Generator<Promise<void>> {
      while (true) {
        yield* animation(start)
        start = false
        yield new Promise((resolve) => setTimeout(resolve, stateRef.current.mergedConfig!.waitTime - 300))
      }
    }
    const control = co(loop)
    if (typeof control === 'function') return
    return () => control.end()
  }, [config, height])

  const classNames = useMemo(() => classnames('dv-scroll-ranking-board', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      {rows.map((item, i) => (
        <div className="row-item" key={`${item.name}-${item.scroll}`} style={{ height: `${heights[i]}px` }}>
          <div className="ranking-info">
            <div className="rank">No.{item.ranking}</div>
            <div className="info-name" dangerouslySetInnerHTML={{ __html: item.name }} />
            <div className="ranking-value">
              {mergedConfig?.valueFormatter ? mergedConfig.valueFormatter(item) : item.value + (mergedConfig?.unit ?? '')}
            </div>
          </div>
          <div className="ranking-column">
            <div className="inside-column" style={{ width: `${item.percent}%` }}>
              <div className="shine" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
