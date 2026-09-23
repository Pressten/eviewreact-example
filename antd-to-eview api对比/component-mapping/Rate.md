# Rate → Rating 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Rate` ⇄ eview `Rating`
- 定位差异：两者都是「星级评分」。最关键的差异在取值回调：antd 用 `onChange(value)`，eview 用 **`onClick(value)`**（没有 `onChange`，用 `onChange` 永远收不到回调）。eview 的半星用 `half`（不是 `allowHalf`），星总数用 `starCount`（不是 `count`），自定义图标用 `iconName`（不是 `character`）。悬浮预览在 eview 里靠 `onMouseOver(value)` / `onMouseLeave(value)` 自己写回 state（antd 用 `onHoverChange`）。eview 无 `allowClear`（再次点击同分不清零，需自行实现）。eview 内置 `size`（图标大小）/ `starColor`（选中颜色）/ `iconProps`（图标多态颜色），antd 靠 `style` / `className`。eview 无 `tooltips` / `autoFocus` / `keyboard`（用 `onKeyDown`）/ `character` 渲染函数。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `allowClear` | — | ❌ 无法映射 | eview 无「再次点击清除」，自行在 `onClick` 里判断同分清零（见 3.1） |
| `allowHalf` | `half` | 直接改名 | 字段名 `allowHalf` → `half`，布尔 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus，用 `ref.focus()` 近似 |
| `character` | `iconName` | 改值 | antd `ReactNode` 或 `(props) => ReactNode`；eview `iconName` 收 `string \| ReactElement`（icon+ 组件推荐），**不支持渲染函数**（见 2.1） |
| `className` | `className` | 直接改名 | |
| `count` | `starCount` | 直接改名 | 字段名 `count` → `starCount`，默认 `5` |
| `defaultValue` | — | ❌ 无法映射 | eview 仅受控 `value`；用 `useState` 初始值近似（见 3.2） |
| `disabled` | `disabled` | 直接改名 | |
| `keyboard` | `onKeyDown` | 综合映射 | antd `keyboard` 布尔开关；eview 无开关但提供 `onKeyDown(value)` 回调，默认支持键盘（见 2.2） |
| `style` | `style` / `size` / `starColor` | 综合映射 | antd `style` 控整体样式；eview 拆成 `size`（图标大小）/ `starColor`（选中颜色）/ `style`（见 2.3） |
| `tooltips` | — | ❌ 无法映射 | eview 无每项提示信息，自行外层 `Tooltip` |
| `value` | `value` | 直接改名 | |
| `onBlur()` | — | ❌ 无法映射 | eview 无失焦回调，自行外层 `onBlur` 近似 |
| `onChange(value)` | `onClick(value)` | 直接改名 | 取值回调改名 `onChange` → `onClick`，签名一致 `(value: number)`（见 2.4） |
| `onFocus()` | — | ❌ 无法映射 | eview 无聚焦回调，自行外层 `onFocus` 近似 |
| `onHoverChange(value)` | `onMouseOver(value)` + `onMouseLeave(value)` | 综合映射 | antd 单一悬浮回调；eview 拆成进入 + 移出两个，需自己维护预览 state（见 2.5） |
| `onKeyDown(event)` | `onKeyDown(value)` | 改名 + 签名调整 | antd 传 event，eview 传当前 value（见 2.2） |
| — | `size` | eview 特有 | 图标大小（默认 `16`），antd 靠 style |
| — | `starColor` | eview 特有 | 选中颜色（默认 `'#eeba18'`），antd 靠 style |
| — | `iconProps` | eview 特有 | 图标多态颜色 `{ color, hoverColor, disabledColor }` |
| — | `onMouseLeave(value)` | eview 特有 | 移出回调（配 `onMouseOver` 做预览） |

## 2. 处理方式详解

### 2.1 `character` → `iconName`（改值）

antd `character` 收 `ReactNode` 或 `(props) => ReactNode`；eview `iconName` 收 `string`（组件库图标名）或 `ReactElement`（icon+ 组件推荐），**不支持渲染函数**：

```jsx
// antd
import { HeartFilled } from '@ant-design/icons';
<Rate character={<HeartFilled />} />

// eview：用 icon+ 组件
import { IconPlusIcPublicHeart } from '@nce/icon-plus';
<Rating iconName={<IconPlusIcPublicHeart />} />

// antd 渲染函数（动态 character）无对应，eview 不支持
// <Rate character={(props) => <CustomIcon {...props} />} />  // 无 eview 等价
```

### 2.2 `keyboard` / `onKeyDown`（综合映射）

antd `keyboard` 布尔开关控制是否支持键盘；eview 无开关但默认支持键盘，通过 `onKeyDown(value)` 回调取值：

```jsx
// antd
<Rate keyboard value={score} onKeyDown={(e) => {}} />

// eview：默认支持键盘，onKeyDown 传 value
<Rating
  value={score}
  onKeyDown={(value: number) => setScore(value)}
/>
// 若要禁用键盘：eview 无开关，需自行拦截 tabIndex=-1 或外层 onKeyDown preventDefault（不推荐）
```

### 2.3 `style` → `size` / `starColor` / `style`（综合映射）

antd 用 `style` / `className` 控图标大小与颜色；eview 拆成语义属性：

```jsx
// antd
<Rate style={{ fontSize: 24, color: '#f43146' }} value={score} />

// eview
<Rating size={24} starColor="#f43146" value={score} />
// 整体布局样式仍用 style
<Rating size={24} starColor="#f43146" style={{ margin: '0 8px' }} value={score} />
```

### 2.4 `onChange` → `onClick`（直接改名）

```jsx
// antd：onChange(value)
<Rate value={score} onChange={(value) => setScore(value)} />

// eview：onClick(value)，签名一致
<Rating value={score} onClick={(value: number) => setScore(value)} />
```

> ⚠️ 反面：`<Rating value={score} onChange={(v) => setScore(v)} />` —— eview 无 `onChange`，永远收不到回调。

### 2.5 `onHoverChange` → `onMouseOver` + `onMouseLeave`（综合映射）

antd 单一悬浮回调 `onHoverChange(value)`；eview 拆成进入 `onMouseOver(value)` 和移出 `onMouseLeave(value)`，需自己维护预览 state，显示值取 `hoverScore ?? score`：

```jsx
// antd
<Rate value={score} onHoverChange={(value) => setHover(value)} />

// eview
const [hoverScore, setHoverScore] = useState(null);
<Rating
  value={hoverScore ?? score}                  // 显示值：悬浮优先
  onMouseOver={(value: number) => setHoverScore(value)}   // 进入
  onMouseLeave={() => setHoverScore(null)}                // 移出恢复
  onClick={(value: number) => setScore(value)}
/>
```

> ⚠️ 反面：`<Rating value={score} onMouseOver={(v) => setScore(v)} />` —— 悬浮直接改正式分值，移出后分值被污染。

## 3. 无法映射的属性与建议处理

### 3.1 `allowClear`（再次点击清除）

eview 无「再次点击同分清零」，自行在 `onClick` 里判断：

```jsx
// antd
<Rate allowClear value={score} onChange={setScore} />

// eview
<Rating
  value={score}
  onClick={(value: number) => setScore(value === score ? 0 : value)}   // 同分清零
/>
```

### 3.2 `defaultValue`（非受控初始值）

```jsx
// antd
<Rate defaultValue={3} />

// eview
const [score, setScore] = useState(3);
<Rating value={score} onClick={(v) => setScore(v)} />
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `autoFocus` | `ref.focus()` 命令式 |
| `tooltips` | 自行外层 `Tooltip` 包裹，或用外部文案展示当前分值 |
| `onBlur()` / `onFocus()` | 外层 `<div onBlur={...} onFocus={...}>` 近似 |
| `character` 渲染函数 | eview 不支持动态 character，改用静态 `iconName` |

## 4. 完整示例对照

```jsx
// antd
<Rate
  allowHalf
  count={5}
  defaultValue={3}
  character={<StarFilled />}
  style={{ fontSize: 24, color: '#eeba18' }}
  disabled={false}
  tooltips={['差', '一般', '好', '很好', '非常好']}
  onChange={(value) => setScore(value)}
  onHoverChange={(value) => setHover(value)}
/>

// eview 等价
const [score, setScore] = useState(3);          // defaultValue → useState
const [hoverScore, setHoverScore] = useState(null);
<Rating
  half                                // allowHalf → half
  starCount={5}                       // count → starCount
  size={24}                            // style.fontSize → size
  starColor="#eeba18"                  // style.color → starColor
  value={hoverScore ?? score}          // 显示值：悬浮优先
  onClick={(value: number) => setScore(value)}            // onChange → onClick
  onMouseOver={(value: number) => setHoverScore(value)}  // onHoverChange → onMouseOver
  onMouseLeave={() => setHoverScore(null)}                 // + onMouseLeave 恢复
/>
<span>{(hoverScore ?? score).toFixed(1)} 分</span>
// character={<StarFilled />} 默认就是星形，省略 iconName 即可；非星形用 iconName={<IconPlusIcPublicHeart />}
// tooltips：eview 无每项提示，用外部文案展示分值
// allowClear：eview 默认行为不同，如需清除见 3.1
```
