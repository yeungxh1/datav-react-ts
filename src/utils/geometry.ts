export function getPolylineLength(points: number[][]): number {
  let length = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0]
    const dy = points[i][1] - points[i - 1][1]
    length += Math.hypot(dx, dy)
  }
  return length
}

export function getCircleRadianPoint(
  x: number,
  y: number,
  radius: number,
  radian: number
): [number, number] {
  return [x + Math.cos(radian) * radius, y + Math.sin(radian) * radius]
}

export function getPointDistance(a: number[], b: number[]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

export function randomExtend(minNum: number, maxNum?: number): number {
  if (maxNum == null) return Math.floor(Math.random() * minNum + 1)
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
}
