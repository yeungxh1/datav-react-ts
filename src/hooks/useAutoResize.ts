import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import type { Ref, RefObject } from 'react'
import type { AutoResizeHandle } from '../types'
import { debounce } from '../utils'

export function useAutoResize(ref?: Ref<AutoResizeHandle>): {
  width: number
  height: number
  domRef: RefObject<HTMLDivElement | null>
  setWH: () => void
} {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const domRef = useRef<HTMLDivElement | null>(null)

  const setWH = useCallback(() => {
    const node = domRef.current
    const width = node?.clientWidth ?? 0
    const height = node?.clientHeight ?? 0
    setSize({ width, height })
    if (!node) {
      console.warn('DataV: Failed to get dom node, component rendering may be abnormal!')
    } else if (!width || !height) {
      console.warn('DataV: Component width or height is 0px, rendering abnormality may occur!')
    }
  }, [])

  useImperativeHandle(ref, () => ({ setWH }), [setWH])

  useLayoutEffect(() => {
    const onResize = debounce(setWH, 100)
    onResize()
    const node = domRef.current
    const observer = node ? new ResizeObserver(() => onResize()) : null
    if (node && observer) observer.observe(node)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
    }
  }, [setWH])

  return { ...size, domRef, setWH }
}
