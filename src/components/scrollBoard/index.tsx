import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import classnames from 'classnames'
import { co, deepClone, deepMerge } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import type { CoControl } from '../../utils'
import './style.less'

export type ScrollBoardConfig = {
  header?: string[]
  data?: (string | number)[][]
  rowNum?: number
  headerBGC?: string
  oddRowBGC?: string
  evenRowBGC?: string
  waitTime?: number
  headerHeight?: number
  columnWidth?: number[]
  align?: Array<'left' | 'center' | 'right'>
  index?: boolean
  indexHeader?: string
  carousel?: 'single' | 'page'
  hoverPause?: boolean
}

export type ScrollBoardEvent = {
  row: (string | number)[]
  ceil: string | number
  rowIndex: number
  columnIndex: number
}

export type ScrollBoardProps = {
  config?: ScrollBoardConfig
  className?: string
  style?: CSSProperties
  onClick?: (event: ScrollBoardEvent) => void
  onMouseOver?: (event: ScrollBoardEvent) => void
  ref?: Ref<AutoResizeHandle>
}

type BoardRow = { ceils: (string | number)[]; rowIndex: number; scroll: number }

const defaultConfig: Required<ScrollBoardConfig> = {
  header: [],
  data: [],
  rowNum: 5,
  headerBGC: '#00BAFF',
  oddRowBGC: '#003B51',
  evenRowBGC: '#0A2732',
  waitTime: 2000,
  headerHeight: 35,
  columnWidth: [],
  align: [],
  index: false,
  indexHeader: '#',
  carousel: 'single',
  hoverPause: true
}

function calcHeaderData({ header, index, indexHeader }: Required<ScrollBoardConfig>) {
  if (!header.length) return []
  const next = [...header]
  if (index) next.unshift(indexHeader)
  return next
}

function calcRows({ data, index, headerBGC, rowNum }: Required<ScrollBoardConfig>): BoardRow[] {
  let rows = data.map((row, i) => {
    const ceils = [...row]
    if (index) {
      ceils.unshift(`<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`)
    }
    return { ceils, rowIndex: i, scroll: i }
  })
  if (rows.length > rowNum && rows.length < 2 * rowNum) {
    rows = [...rows, ...rows]
  }
  return rows.map((d, i) => ({ ...d, scroll: i }))
}

export function ScrollBoard({
  onClick,
  config = {},
  className,
  style,
  onMouseOver,
  ref
}: ScrollBoardProps) {
  const { width, height, domRef } = useAutoResize(ref)
  const [state, setState] = useState({
    mergedConfig: null as Required<ScrollBoardConfig> | null,
    header: [] as string[],
    rows: [] as BoardRow[],
    widths: [] as number[],
    heights: [] as number[],
    aligns: [] as string[]
  })
  const { mergedConfig, header, rows, widths, heights, aligns } = state
  const stateRef = useRef({
    ...state,
    rowsData: [] as BoardRow[],
    avgHeight: 0,
    animationIndex: 0
  })
  Object.assign(stateRef.current, state)
  const task = useRef<CoControl | null>(null)

  function calcWidths(merged: Required<ScrollBoardConfig>, rowsData: BoardRow[]) {
    const usedWidth = merged.columnWidth.reduce((all, w) => all + w, 0)
    let columnNum = 0
    if (rowsData[0]) columnNum = rowsData[0].ceils.length
    else if (merged.header.length) columnNum = calcHeaderData(merged).length
    const avgWidth = (width - usedWidth) / Math.max(columnNum - merged.columnWidth.length, 1)
    return deepMerge(new Array(columnNum).fill(avgWidth), merged.columnWidth)
  }

  function calcHeights(merged: Required<ScrollBoardConfig>, headerItems: string[]) {
    let allHeight = height
    if (headerItems.length) allHeight -= merged.headerHeight
    const avgHeight = allHeight / merged.rowNum
    stateRef.current.avgHeight = avgHeight
    return new Array(merged.data.length).fill(avgHeight)
  }

  useEffect(() => {
    const merged = deepMerge(deepClone(defaultConfig), config)
    const headerItems = calcHeaderData(merged)
    const nextRows = calcRows(merged)
    const nextWidths = calcWidths(merged, nextRows)
    const nextHeights = calcHeights(merged, headerItems)
    const nextAligns = deepMerge(new Array(headerItems.length).fill('left'), merged.align)
    const data = {
      mergedConfig: merged,
      header: headerItems,
      rows: nextRows,
      widths: nextWidths,
      aligns: nextAligns,
      heights: nextHeights
    }
    Object.assign(stateRef.current, data, { rowsData: nextRows, animationIndex: 0 })
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
      view = view.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1)
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
        const waitTime = stateRef.current.mergedConfig!.waitTime
        yield new Promise((resolve) => setTimeout(resolve, waitTime - 300))
      }
    }
    const control = co(loop)
    if (typeof control === 'function') return
    task.current = control
    return () => control.end()
  }, [config, width, height])

  function emitEvent(
    handle: ScrollBoardProps['onClick'],
    ri: number,
    ci: number,
    row: BoardRow,
    ceil: string | number
  ) {
    handle?.({ row: row.ceils, ceil, rowIndex: row.rowIndex, columnIndex: ci })
  }

  function handleHover(enter: boolean, ri?: number, ci?: number, row?: BoardRow, ceil?: string | number) {
    if (enter && row && ci != null && ri != null && ceil != null) emitEvent(onMouseOver, ri, ci, row, ceil)
    if (!mergedConfig?.hoverPause) return
    const control = task.current
    if (!control) return
    if (enter) control.pause()
    else control.resume()
  }

  const classNames = useMemo(() => classnames('dv-scroll-board', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      {!!header.length && !!mergedConfig && (
        <div className="header" style={{ backgroundColor: `${mergedConfig.headerBGC}` }}>
          {header.map((headerItem, i) => (
            <div
              className="header-item"
              key={`${headerItem}-${i}`}
              style={{
                height: `${mergedConfig.headerHeight}px`,
                lineHeight: `${mergedConfig.headerHeight}px`,
                width: `${widths[i]}px`,
                textAlign: (aligns[i] as 'left' | 'center' | 'right') || 'left'
              }}
              dangerouslySetInnerHTML={{ __html: headerItem }}
            />
          ))}
        </div>
      )}
      {!!mergedConfig && (
        <div className="rows" style={{ height: `${height - (header.length ? mergedConfig.headerHeight : 0)}px` }}>
          {rows.map((row, ri) => (
            <div
              className="row-item"
              key={`${row.rowIndex}-${row.scroll}`}
              style={{
                height: `${heights[ri]}px`,
                lineHeight: `${heights[ri]}px`,
                backgroundColor: `${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']}`
              }}
            >
              {row.ceils.map((ceil, ci) => (
                <div
                  className="ceil"
                  key={`${ceil}-${ri}-${ci}`}
                  style={{
                    width: `${widths[ci]}px`,
                    textAlign: (aligns[ci] as 'left' | 'center' | 'right') || 'left'
                  }}
                  dangerouslySetInnerHTML={{ __html: String(ceil) }}
                  onClick={() => emitEvent(onClick, ri, ci, row, ceil)}
                  onMouseEnter={() => handleHover(true, ri, ci, row, ceil)}
                  onMouseLeave={() => handleHover(false)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
