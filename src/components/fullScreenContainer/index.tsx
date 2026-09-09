import { useLayoutEffect } from 'react'
import type { CSSProperties, ReactNode, Ref } from 'react'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { AutoResizeHandle } from '../../types'
import './style.less'

export type FullScreenContainerProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  ref?: Ref<AutoResizeHandle>
}

export function FullScreenContainer({
  children,
  className,
  style,
  ref
}: FullScreenContainerProps) {
  const { domRef } = useAutoResize(ref)

  useLayoutEffect(() => {
    const node = domRef.current
    if (!node) return
    const { width, height } = window.screen
    node.style.width = `${width}px`
    node.style.height = `${height}px`
    node.style.transform = `scale(${document.body.clientWidth / width})`
  })

  return (
    <div id="dv-full-screen-container" className={className} style={style} ref={domRef}>
      {children}
    </div>
  )
}
