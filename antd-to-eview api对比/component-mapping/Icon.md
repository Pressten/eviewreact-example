# Icon → Icon 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Icon`（`@ant-design/icons`）⇄ eview `Icon`（icon+ 组件，`@nce/icon-plus`）
- 定位差异：antd 5.x 的 Icon 已从主包拆出，独立为 `@ant-design/icons`，通过命名导出（如 `UserOutlined`）+ 三主题后缀（`Outlined` / `Filled` / `TwoTone`）使用 SVG 图标，并提供底层 `Icon` 组件（`component` prop）承载自定义 SVG、`createFromIconfontCN` 承载 iconfont。eview 侧首推 **icon+ 图标库**（`@nce/icon-plus`），同样是命名导出的 SVG 组件，但用 `type="filled"` 切风格、`iconColor` 数组换色、`iconSize` 离散尺寸；内置 `Icon name="ict_*"` 已被 icon+ 替代、不再推荐。本规则把 antd 命名图标映射到 icon+ 命名图标组件，把 antd 底层 `Icon`（自定义 SVG / iconfont）映射到 eview icon+ 的 `component` 透传或图片三态（`IconButton` 场景）。需要点击 + 气泡的图标，eview 不在图标组件上挂 `onClick`，而是改用 `IconButton`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| 命名图标（`UserOutlined` / `UserFilled` / `UserTwoTone`） | icon+ 命名组件（`IconPlusIc*`）+ `type` | 综合映射 | antd 用三主题后缀区分风格，eview 用同一组件 + `type="filled"` 切风格（见 2.1） |
| `className` | `className` | 直接改名 | icon+ 组件支持 className |
| `style` | `style` | 直接改名 | `fontSize` / `color` 可继续用；尺寸优先改用 `iconSize` |
| `rotate` | `style={{ transform: 'rotate(Ndeg)' }}` | 改值 | eview icon+ 无 rotate prop，转 style（见 2.2） |
| `spin` | `className` + CSS 动画 | 改值 | eview icon+ 无 spin，需自定义 `@keyframes spin` 类（见 2.2） |
| `twoToneColor` | `iconColor` | 综合映射 | antd 双色主色单值，eview `iconColor` 为颜色数组（见 2.3） |
| `component`（自定义 SVG） | icon+ `component` 透传 / `IconButton.iconUrl` | 综合映射 | eview icon+ 组件可承载自定义 SVG；图片图标走 `IconButton` 图片三态（见 2.4） |
| `createFromIconfontCN({ scriptUrl, extraCommonProps })` | — | ❌ 无法映射 | eview 无 iconfont 在线脚本方案，改用 icon+ 命名组件或自定义 SVG（见 3.1） |
| `getTwoToneColor` / `setTwoToneColor(color)` | — | ❌ 无法映射 | eview 无全局双色主色配置；改用每个组件 `iconColor` 局部设置（见 3.2） |
| `Icon` 组件 `component` 接收的 `fill` / `width` / `height` | `iconColor` / `iconSize` | 综合映射 | 自定义 SVG 的 svg 透传 fill/width/height；eview 图标尺寸用 `iconSize` 离散值（见 2.4） |
| 三主题后缀语义（Outlined/Filled/TwoTone） | `type` 取值 | 改值 | `Outlined`（默认线条）→ 不传 `type`；`Filled` → `type="filled"`；`TwoTone` → `iconColor` 双色数组（见 2.1） |
| `onClick`（图标组件直接挂） | `IconButton.onClick` | 综合映射 | eview 不建议给图标组件挂 onClick；点击图标统一用 `IconButton`（见 2.5） |
| — | `iconSize` | eview 特有 | 离散尺寸 12/14/16/20/24/32/36/40/48/60 |
| — | `iconColor` | eview 特有 | 颜色数组，多色 / 单色覆盖 |
| — | `type="filled"` | eview 特有 | 风格切换 |
| — | `IconButton.tipText` / `tipContent` / `tipData` | eview 特有 | 图标按钮气泡提示，二选一 |
| — | `IconButton.iconName` / `iconUrl` / `hoverIconUrl` / `disabledIconUrl` / `iconProps` | eview 特有 | 图标按钮三态 + 颜色配置 |
| — | `IconButton.enableClickHideTip` / `disabled` / `size` | eview 特有 | 气泡交互 / 禁用 / 尺寸 |

## 2. 处理方式详解

### 2.1 三主题后缀 → icon+ `type` / `iconColor`（综合映射）

antd 用组件名后缀区分三主题；eview 用同一组件 + `type` / `iconColor` 区分。

```jsx
// antd
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
<StarOutlined />
<StarFilled />
<StarTwoTone twoToneColor="#eb2f96" />

// eview
import { IconPlusIcPublicStar } from '@nce/icon-plus'; // 示意名，真实名用 icon-plus 接口查得
<IconPlusIcPublicStar />                                  // Outlined 默认
<IconPlusIcPublicStar type="filled" />                    // Filled
<IconPlusIcPublicStar type="filled" iconColor={['#eb2f96', '#f0f0f0']} /> // TwoTone 近似
```

主题后缀映射规则：

| antd 后缀 | eview 处理 |
| --- | --- |
| `XxxOutlined` | 不传 `type`（默认线条） |
| `XxxFilled` | `type="filled"` |
| `XxxTwoTone` | `type="filled"` + `iconColor=[主色, 辅色]`（双色近似） |

### 2.2 `rotate` / `spin` → `style`（改值）

eview icon+ 无 rotate / spin prop，转 CSS。

```jsx
// antd
<LoadingOutlined spin />
<SyncOutlined rotate={180} />

// eview
<IconPlusIcPublicLoading className="app-icon-spin" />
<IconPlusIcPublicRefresh style={{ transform: 'rotate(180deg)' }} />

// CSS
// .app-icon-spin { animation: app-spin 1s linear infinite; }
// @keyframes app-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
```

### 2.3 `twoToneColor` → `iconColor`（综合映射）

antd `twoToneColor` 单值（主色），eview `iconColor` 是数组。

```js
// antd: twoToneColor="#eb2f96"
// eview: iconColor=['#eb2f96', '#f0f0f0']  // [主色, 辅色]
function toIconColor(twoToneColor) {
  if (!twoToneColor) return undefined;
  return [twoToneColor, '#f0f0f0']; // 辅色取默认浅灰，业务可覆盖
}
```

### 2.4 `component`（自定义 SVG）→ icon+ `component` 透传 / `IconButton` 图片三态（综合映射）

antd 底层 `Icon component={Svg}` 承载自定义 SVG；eview 同样可在 icon+ 组件上透传 svg，或对图片图标用 `IconButton` 三态。

```jsx
// antd 自定义 SVG
import Icon from '@ant-design/icons';
import MessageSvg from 'path/to/message.svg';
<Icon component={MessageSvg} style={{ fontSize: 16, color: '#08c' }} />

// eview：在 icon+ 组件透传 svg（推荐）或用 IconButton 图片三态
<IconPlusIcPublicMessage component={MessageSvg} iconSize={16} iconColor={['#08c']} />
// 图片场景：
<IconButton iconUrl={msgPng} hoverIconUrl={msgHoverPng} disabledIconUrl={msgDisabledPng} tipText="消息" />
```

`component` 内部 svg 透传属性对照：

| antd `component` 接收 | eview 处理 |
| --- | --- |
| `fill` | `iconColor={[fill]}` |
| `width` / `height` | `iconSize`（必须落在离散值；非离散值取最近档） |
| `className` / `style` | 直接保留 |

### 2.5 图标 `onClick` → `IconButton`（综合映射）

eview 反对给图标组件直接挂 onClick；可点击图标统一用 `IconButton`，并自带气泡提示、禁用态、键盘可达。

```jsx
// antd
<DeleteOutlined onClick={handleDelete} style={{ color: 'red' }} />

// eview
<IconButton
  iconName={<IconPlusIcPublicTrash iconColor={['red']} />}
  tipText="删除"
  onClick={(event) => handleDelete(event)}
/>
// onClick(event) 签名一致；eview IconButton 仅传 event，无额外参
```

## 3. 无法映射的属性与建议处理

### 3.1 `createFromIconfontCN`（iconfont 在线脚本）

eview 无 iconfont 在线 scriptUrl 方案。建议：

1. 优先用 icon+ 命名组件替代；
2. 必须用自定义图标时，导出 SVG 走 `component` 透传，或转图片走 `IconButton.iconUrl` 三态。

```jsx
// antd
const MyIcon = createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js' });
<MyIcon type="icon-example" />

// eview：用 icon+ 命名组件或自定义 SVG
<IconPlusIcPublicExample />                       // 替代
<IconPlusIcPublicExample component={ExampleSvg} iconSize={20} /> // 自定义 SVG 透传
```

### 3.2 `getTwoToneColor` / `setTwoToneColor`（全局双色主色）

eview 无全局双色主色配置入口，只能逐组件 `iconColor` 设置。建议封装一个工厂函数统一生成。

```js
// antd
import { setTwoToneColor } from '@ant-design/icons';
setTwoToneColor('#eb2f96');

// eview：局部设置 + 工厂
const BRAND_TWO_TONE = ['#eb2f96', '#f0f0f0'];
const makeTwoTone = (Comp) => <Comp type="filled" iconColor={BRAND_TWO_TONE} />;
// 使用：makeTwoTone(IconPlusIcPublicStar)
```

### 3.3 其余无法映射属性一览

| antd 项 | 建议 |
| --- | --- |
| `createFromIconfontCN({ extraCommonProps })` | 用 `iconColor` / `iconSize` / `className` 逐项设置 |
| `createFromIconfontCN({ scriptUrl })` | 改用 icon+ 命名组件或自定义 SVG |
| `getTwoToneColor` / `setTwoToneColor` | 逐组件 `iconColor` + 工厂函数统一 |
| 内置 `Icon name="ict_*"`（eview 已下线） | 改用 icon+ 命名组件 |
| `component` 接收的 `fill` / `width` / `height` 非离散值 | `iconSize` 取最近离散档；`fill` 用 `iconColor` |

## 4. 完整示例对照

```jsx
// antd
import { StarTwoTone, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

<StarTwoTone twoToneColor="#eb2f96" style={{ fontSize: 24 }} />
<LoadingOutlined spin style={{ color: '#1890ff' }} />
<Tooltip title="删除">
  <DeleteOutlined onClick={handleDelete} style={{ color: 'red' }} />
</Tooltip>

// eview 等价
import { IconPlusIcPublicStar, IconPlusIcPublicLoading, IconPlusIcPublicTrash } from '@nce/icon-plus';
import IconButton from '@nce/eview-react/IconButton';

<IconPlusIcPublicStar type="filled" iconColor={['#eb2f96', '#f0f0f0']} iconSize={24} />
<IconPlusIcPublicLoading className="app-icon-spin" iconColor={['#1890ff']} />
<IconButton
  iconName={<IconPlusIcPublicTrash iconColor={['red']} />}
  tipText="删除"
  onClick={(e) => handleDelete(e)}
/>
```
