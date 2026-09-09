export function uuid(hasHyphen?: boolean): string {
  const pattern = hasHyphen
    ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
  return pattern.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
