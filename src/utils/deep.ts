function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value)) out[key] = deepClone(value[key])
    return out as T
  }
  return value
}

export function deepMerge<T>(target: T, source?: Partial<T> | null): T {
  const base = deepClone(target)
  if (source == null) return base
  if (Array.isArray(base) && Array.isArray(source)) {
    const next = base.slice()
    source.forEach((item, i) => {
      next[i] = deepMerge(next[i], item as never)
    })
    return next as T
  }
  if (isPlainObject(base) && isPlainObject(source)) {
    const next = { ...base } as Record<string, unknown>
    for (const key of Object.keys(source)) {
      next[key] = deepMerge(
        (base as Record<string, unknown>)[key],
        (source as Record<string, unknown>)[key] as never
      )
    }
    return next as T
  }
  return source as T
}
