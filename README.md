# @datav/react-ts

个人 fork：把停更的 DataV-React 迁到 **React 19 + TypeScript**。不是 npm 上的 `@jiaminghi/data-view-react`，也不会提上游 PR。

- 仓库：https://github.com/yeungxh1/datav-react-ts
- 上游：https://github.com/DataV-Team/DataV-React
- 许可证：MIT（跟随上游 DataV-Team）

## 要求

- 业务项目用 **React 19**
- 打包器能处理 ESM 和 CSS（Vite 最省事）

## 在自己的 React 项目里用

库和业务项目放在相邻目录，例如：

```text
C:\CodeForStudy\DataV-React      ← 这个库
C:\CodeForStudy\your-app         ← 你的 React 19 项目
```

在 `your-app/package.json` 里写本地路径（按实际相对位置改）：

```json
{
  "dependencies": {
    "@datav/react-ts": "file:../DataV-React"
  }
}
```

然后在业务项目里：

```powershell
pnpm add @datav/react-ts@file:../DataV-React
```

或在 `package.json` 里写 `"@datav/react-ts": "file:../DataV-React"` 后再 `pnpm install`。

`file:` 安装时会自动跑库里的 `prepare`（构建 `dist`），不用先手动打包。先在这个库目录执行过一次 `pnpm install`。

```tsx
import { BorderBox1, DigitalFlop } from '@datav/react-ts'
import '@datav/react-ts/style.css'

export function Panel() {
  return (
    <BorderBox1 style={{ width: 360, height: 200 }}>
      <DigitalFlop config={{ number: [9527], content: '{nt}', duration: 800 }} />
    </BorderBox1>
  )
}
```

组件要随容器变尺寸，外层必须有明确宽高（`px`、`%` 或 flex 拉满都可以）。

改了库源码之后，进库目录跑 `pnpm build`，然后重启业务项目的 dev server。

## 和原版的差异

- 包名：`@datav/react-ts`
- 只提供 ESM + 类型 + `style.css`，没有 UMD / CJS
- `ref` 是普通 prop（React 19），不再使用 `forwardRef`
- 去掉通用 `Charts`（折线/柱状图请在业务里自己接 ECharts 等）
- `DigitalFlop` 不再使用 CRender 的 `animationCurve` / `animationFrame`，改用 `duration`（毫秒）
- 无 `@jiaminghi/*` 运行时依赖

## 开发

```powershell
pnpm install
pnpm test
pnpm build
pnpm dev
```

`pnpm dev` 打开本地 playground，只用于核对组件，不发布。本仓库用 pnpm，不要再提交 `package-lock.json`。
