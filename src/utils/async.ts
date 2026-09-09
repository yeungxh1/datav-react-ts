export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay = 600,
  runFirstFn = true
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let shouldRunFirst = runFirstFn

  return function (this: unknown, ...rest: Parameters<T>) {
    if (timer) clearTimeout(timer)
    if (shouldRunFirst) {
      fn.apply(this, rest)
      shouldRunFirst = false
      return
    }
    timer = setTimeout(() => fn.apply(this, rest), delay)
  }
}

export type CoControl = {
  end: () => void
  pause: () => void
  resume: () => void
}

type CoGen = Generator<unknown, unknown, unknown>

export function co(gen: CoGen | (() => CoGen)): CoControl | (() => Record<string, never>) {
  let destroyed = false
  let stop = false
  let val: unknown = null
  let iterator: CoGen | null = typeof gen === 'function' ? gen() : gen

  if (!iterator || typeof iterator.next !== 'function') {
    return () => ({})
  }

  Promise.resolve().then(() => {
    if (!destroyed && iterator) next(iterator.next())
  })

  function next(ret: IteratorResult<unknown>): unknown {
    if (!iterator) return undefined
    if (ret.done) return ret.value
    val = ret.value
    return Promise.resolve(ret.value).then(() => {
      if (!destroyed && !stop && iterator) next(iterator.next())
    })
  }

  return {
    end() {
      destroyed = true
      Promise.resolve().then(() => {
        iterator?.return(undefined)
        iterator = null
      })
    },
    pause() {
      if (!destroyed) stop = true
    },
    resume() {
      const oldVal = val
      if (!destroyed && stop) {
        stop = false
        Promise.resolve(val).then(() => {
          if (!destroyed && !stop && oldVal === val && iterator) next(iterator.next())
        })
      }
    }
  }
}
