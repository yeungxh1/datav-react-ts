import type { CSSProperties, ReactNode, Ref } from 'react'

export type AutoResizeHandle = {
  setWH: () => void
}

export type BoxProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  color?: string[]
  backgroundColor?: string
  ref?: Ref<AutoResizeHandle>
}

export type DecorationProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  color?: string[]
  reverse?: boolean
  dur?: number
  scanDur?: number
  haloDur?: number
  ref?: Ref<AutoResizeHandle>
}
