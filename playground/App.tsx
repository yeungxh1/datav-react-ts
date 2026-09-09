import {
  Decoration1,
  Decoration2,
  Decoration3,
  Decoration4,
  Decoration5,
  Decoration6,
  Decoration7,
  Decoration8,
  Decoration9,
  Decoration10,
  Decoration11,
  Decoration12,
  Decoration13,
  Decoration14,
  Decoration15,
  Decoration16,
  Decoration17,
  Decoration18,
  Decoration19,
  Decoration20,
  Decoration21,
  Decoration22,
  BorderBox1,
  BorderBox2,
  BorderBox3,
  BorderBox4,
  BorderBox5,
  BorderBox6,
  BorderBox7,
  BorderBox8,
  BorderBox9,
  BorderBox10,
  BorderBox11,
  BorderBox12,
  BorderBox13,
  BorderBox14,
  BorderBox15,
  Loading,
  DigitalFlop,
  CapsuleChart,
  PercentPond,
  ConicalColumnChart,
  ScrollBoard,
  ScrollRankingBoard,
  WaterLevelPond,
  ActiveRingChart,
  FlylineChart,
  FlylineChartEnhanced
} from '@datav/react-ts'

const boxes = [
  BorderBox1,
  BorderBox2,
  BorderBox3,
  BorderBox4,
  BorderBox5,
  BorderBox6,
  BorderBox7,
  BorderBox8,
  BorderBox9,
  BorderBox10,
  BorderBox12,
  BorderBox13
]

export function App() {
  return (
    <div className="page">
      <h1>@datav/react-ts</h1>
      <h2>Loading</h2>
      <div className="grid">
        <div className="demo">
          <Loading>Loading...</Loading>
        </div>
      </div>
      <h2>Border boxes</h2>
      <div className="grid">
        {boxes.map((Box, i) => (
          <div className="demo" key={Box.name}>
            <Box>
              <span>BorderBox{i < 10 ? i + 1 : i + 2}</span>
            </Box>
          </div>
        ))}
        <div className="demo">
          <BorderBox11 title="系统总览">title box</BorderBox11>
        </div>
        <div className="demo">
          <BorderBox14>
            <span>BorderBox14</span>
          </BorderBox14>
        </div>
        <div className="demo">
          <BorderBox15>
            <span>BorderBox15</span>
          </BorderBox15>
        </div>
      </div>
      <h2>Decorations</h2>
      <div className="grid">
        <div className="demo"><Decoration1 /></div>
        <div className="demo"><Decoration2 /></div>
        <div className="demo"><Decoration3 /></div>
        <div className="demo"><Decoration4 /></div>
        <div className="demo"><Decoration5 /></div>
        <div className="demo"><Decoration6 /></div>
        <div className="demo"><Decoration7>Deco7</Decoration7></div>
        <div className="demo"><Decoration8 /></div>
        <div className="demo-square"><Decoration9>9</Decoration9></div>
        <div className="demo"><Decoration10 /></div>
        <div className="demo"><Decoration11>11</Decoration11></div>
        <div className="demo-square"><Decoration12>scan</Decoration12></div>
        <div className="demo-square"><Decoration13>LOCK</Decoration13></div>
        <div className="demo-square"><Decoration14 /></div>
        <div className="demo"><Decoration15 /></div>
        <div className="demo"><Decoration16 /></div>
        <div className="demo"><Decoration17 /></div>
        <div className="demo-square"><Decoration18>72%</Decoration18></div>
        <div className="demo"><Decoration19 /></div>
        <div className="demo"><Decoration20>NAV</Decoration20></div>
        <div className="demo"><Decoration21 /></div>
        <div className="demo-square"><Decoration22 /></div>
      </div>
      <h2>Charts and boards</h2>
      <div className="grid">
        <div className="demo"><DigitalFlop config={{ number: [9527], content: '{nt}', duration: 800 }} /></div>
        <div className="demo">
          <CapsuleChart config={{ data: [{ name: 'a', value: 40 }, { name: 'b', value: 80 }], showValue: true }} />
        </div>
        <div className="demo"><PercentPond config={{ value: 66 }} /></div>
        <div className="demo">
          <ConicalColumnChart config={{ data: [{ name: 'A', value: 50 }, { name: 'B', value: 80 }], showValue: true }} />
        </div>
        <div className="demo-wide">
          <ScrollBoard config={{ header: ['A', 'B'], data: [['1', '2'], ['3', '4'], ['5', '6'], ['7', '8']], waitTime: 2000 }} />
        </div>
        <div className="demo-wide">
          <ScrollRankingBoard config={{ data: [{ name: '甲', value: 80 }, { name: '乙', value: 60 }, { name: '丙', value: 40 }] }} />
        </div>
        <div className="demo-square"><WaterLevelPond config={{ data: [55, 45] }} /></div>
        <div className="demo-square">
          <ActiveRingChart config={{ data: [{ name: '一号', value: 30 }, { name: '二号', value: 70 }] }} />
        </div>
        <div className="demo-wide">
          <FlylineChart
            config={{
              centerPoint: [0.5, 0.5],
              points: [[0.2, 0.2], [0.8, 0.7]],
              lineWidth: 2,
              orbitColor: 'rgba(103, 224, 227, .55)',
              flylineRadius: 24,
              halo: { show: true, radius: 28, duration: 20, color: '#fb7293' }
            }}
          />
        </div>
        <div className="demo-wide">
          <FlylineChartEnhanced
            config={{
              points: [
                { name: 'A', coordinate: [0.2, 0.3], text: { show: true } },
                { name: 'B', coordinate: [0.8, 0.7], text: { show: true } }
              ],
              lines: [{ source: 'A', target: 'B', width: 2, color: '#ffde93', orbitColor: 'rgba(103, 224, 227, .55)', radius: 40 }],
              halo: { show: true, color: '#fb7293', radius: 18, duration: [20, 30] }
            }}
          />
        </div>
      </div>
    </div>
  )
}
