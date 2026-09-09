import { useMemo, useRef } from 'react'
import classnames from 'classnames'
import { deepClone, deepMerge, uuid } from '../../utils'
import { useAutoResize } from '../../hooks/useAutoResize'
import type { DecorationProps } from '../../types'
import './style.less'

const defaultColor = ['#00c2ff', 'rgba(0, 194, 255, 0.3)']

export type Decoration10Props = Pick<DecorationProps, 'className' | 'style' | 'color' | 'ref'>

export function Decoration10({ className, style, color = [], ref }: Decoration10Props) {
  const { width, height, domRef } = useAutoResize(ref)
  const ids = useRef({
    animationId1: `d10ani1${uuid()}`,
    animationId2: `d10ani2${uuid()}`,
    animationId3: `d10ani3${uuid()}`,
    animationId4: `d10ani4${uuid()}`,
    animationId5: `d10ani5${uuid()}`,
    animationId6: `d10ani6${uuid()}`,
    animationId7: `d10ani7${uuid()}`
  }).current
  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor), color), [color])
  const classNames = useMemo(() => classnames('dv-decoration-10', className), [className])

  return (
    <div className={classNames} style={style} ref={domRef}>
      <svg width={width} height={height}>
        <polyline stroke={mergedColor[1]} strokeWidth="2" points={`0, ${height / 2} ${width}, ${height / 2}`} />
        <polyline
          stroke={mergedColor[0]}
          strokeWidth="2"
          points={`5, ${height / 2} ${width * 0.2 - 3}, ${height / 2}`}
          strokeDasharray={`0, ${width * 0.2}`}
          fill="freeze"
        >
          <animate
            id={ids.animationId2}
            attributeName="stroke-dasharray"
            values={`0, ${width * 0.2};${width * 0.2}, 0;`}
            dur="3s"
            begin={`${ids.animationId1}.end`}
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`${width * 0.2}, 0;0, ${width * 0.2}`}
            dur="0.01s"
            begin={`${ids.animationId7}.end`}
            fill="freeze"
          />
        </polyline>
        <polyline
          stroke={mergedColor[0]}
          strokeWidth="2"
          points={`${width * 0.2 + 3}, ${height / 2} ${width * 0.8 - 3}, ${height / 2}`}
          strokeDasharray={`0, ${width * 0.6}`}
        >
          <animate
            id={ids.animationId4}
            attributeName="stroke-dasharray"
            values={`0, ${width * 0.6};${width * 0.6}, 0`}
            dur="3s"
            begin={`${ids.animationId3}.end + 1s`}
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`${width * 0.6}, 0;0, ${width * 0.6}`}
            dur="0.01s"
            begin={`${ids.animationId7}.end`}
            fill="freeze"
          />
        </polyline>
        <polyline
          stroke={mergedColor[0]}
          strokeWidth="2"
          points={`${width * 0.8 + 3}, ${height / 2} ${width - 5}, ${height / 2}`}
          strokeDasharray={`0, ${width * 0.2}`}
        >
          <animate
            id={ids.animationId6}
            attributeName="stroke-dasharray"
            values={`0, ${width * 0.2};${width * 0.2}, 0`}
            dur="3s"
            begin={`${ids.animationId5}.end + 1s`}
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`${width * 0.2}, 0;0, ${width * 0.3}`}
            dur="0.01s"
            begin={`${ids.animationId7}.end`}
            fill="freeze"
          />
        </polyline>
        <circle cx="2" cy={height / 2} r="2" fill={mergedColor[1]}>
          <animate
            id={ids.animationId1}
            attributeName="fill"
            values={`${mergedColor[1]};${mergedColor[0]}`}
            begin={`0s;${ids.animationId7}.end`}
            dur="0.3s"
            fill="freeze"
          />
        </circle>
        <circle cx={width * 0.2} cy={height / 2} r="2" fill={mergedColor[1]}>
          <animate id={ids.animationId3} attributeName="fill" values={`${mergedColor[1]};${mergedColor[0]}`} begin={`${ids.animationId2}.end`} dur="0.3s" fill="freeze" />
          <animate attributeName="fill" values={`${mergedColor[1]};${mergedColor[1]}`} dur="0.01s" begin={`${ids.animationId7}.end`} fill="freeze" />
        </circle>
        <circle cx={width * 0.8} cy={height / 2} r="2" fill={mergedColor[1]}>
          <animate id={ids.animationId5} attributeName="fill" values={`${mergedColor[1]};${mergedColor[0]}`} begin={`${ids.animationId4}.end`} dur="0.3s" fill="freeze" />
          <animate attributeName="fill" values={`${mergedColor[1]};${mergedColor[1]}`} dur="0.01s" begin={`${ids.animationId7}.end`} fill="freeze" />
        </circle>
        <circle cx={width - 2} cy={height / 2} r="2" fill={mergedColor[1]}>
          <animate id={ids.animationId7} attributeName="fill" values={`${mergedColor[1]};${mergedColor[0]}`} begin={`${ids.animationId6}.end`} dur="0.3s" fill="freeze" />
          <animate attributeName="fill" values={`${mergedColor[1]};${mergedColor[1]}`} dur="0.01s" begin={`${ids.animationId7}.end`} fill="freeze" />
        </circle>
      </svg>
    </div>
  )
}
