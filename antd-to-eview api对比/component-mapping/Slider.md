# Slider → DragInput 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Slider` ⇄ eview `DragInput`（导入名是 `DragInput`，官网页面叫 Slider）
- 定位差异：两者都是「带刻度的滑动输入器」。但 eview DragInput 的 `value` **永远是数组**（单滑块 `[v]`，区间 `[min, max]`），antd Slider 单滑块用标量 `number`、双滑块用 `range` 布尔开启。eview DragInput 用 `type="range"` 表达区间、用 `markIndexes` 表达刻度位置、用 `labelFormat` 格式化刻度文字，并内置数字输入框（`displayInput`）。eview 无 `tooltip`/`dots`/`included`/`reverse`/`keyboard` 等能力。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `value` | `value` | 综合映射 | 类型不同：antd 标量 `number` → eview 数组 `[number]`；区间 antd `[a,b]` → eview `[a,b]`（见 2.1） |
| `defaultValue` | — | ❌ 无法映射 | eview 无默认值属性，改用 `value` 受控初始化 |
| `min` | `min` | 直接改名 | 默认均 0 |
| `max` | `max` | 直接改名 | antd 默认 100，eview 默认 100 |
| `step` | `precision` | 综合映射 | antd `step`（步长）与 eview `precision`（小数位）语义不同，需换算（见 2.2） |
| `range` | `type="range"` | 改值 | antd 布尔 `range` → eview `type="single" \| "range"`（见 2.3） |
| `marks` | `markIndexes` + `labelFormat` | 综合映射 | antd marks 对象 → eview 下标数组 + 格式化函数（见 2.4） |
| `dots` | — | ❌ 无法映射 | eview 无「只能拖到刻度」开关，`markIndexes` 仅控制显示 |
| `included` | — | ❌ 无法映射 | eview 无包含/并列开关 |
| `disabled` | `disabled` | 直接改名 | |
| `vertical` | — | ❌ 无法映射 | eview DragInput 无竖排方向 |
| `reverse` | — | ❌ 无法映射 | eview 无反向坐标轴 |
| `keyboard` | — | ❌ 无法映射 | eview 无键盘操作开关 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus，用 `ref.focus()`（见 3.1） |
| `tooltip` | — | ❌ 无法映射 | eview 无 Tooltip；需要数值提示时用 `labelFormat` 显示刻度文字（见 3.2） |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，改用 `stickStyle`/`barStyle`/`inputStyle` 对应 className |
| `styles` | — | ❌ 无法映射 | 同上，改用 `stickStyle`/`barStyle`/`inputStyle` |
| `onChange` | `onChange` | 综合映射 | 签名不同：antd `(value)` → eview `(value[], changeValue?)`（见 2.5） |
| `onChangeComplete` | — | ❌ 无法映射 | eview 无「拖拽结束」回调，仅在 `onChange` 里自行防抖（见 3.3） |
| — | `unit` | eview 特有 | 刻度单位；多单位用 `labelFormat` |
| — | `labelFormat` | eview 特有 | 刻度文字格式化 |
| — | `displayInput` | eview 特有 | 是否显示内置输入框，默认 true |
| — | `label` / `labelPosition` | eview 特有 | 标题及位置 |
| — | `stickStyle` / `barStyle` / `inputStyle` | eview 特有 | 刻度条 / 滑块 / 输入框样式 |
| — | `ref.getValue()` | eview 特有 | 命令式取值 |

### range 子属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `range.draggableTrack` | — | ❌ 无法映射 | eview 区间滑块整体拖拽能力无对应 |
| `range.editable` | — | ❌ 无法映射 | eview 无动态增减节点 |
| `range.minCount` / `range.maxCount` | — | ❌ 无法映射 | 同上 |

### tooltip 子属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `tooltip.open` | — | ❌ 无法映射 | eview 无 Tooltip |
| `tooltip.formatter` | `labelFormat` | 综合映射 | 近似：tooltip 数值格式化 → 刻度文字格式化（见 2.4） |
| `tooltip.placement` | — | ❌ 无法映射 | eview 无 |
| `tooltip.autoAdjustOverflow` | — | ❌ 无法映射 | eview 无 |
| `tooltip.getPopupContainer` | — | ❌ 无法映射 | eview 无 |

## 2. 处理方式详解

### 2.1 `value` 标量 → 数组（综合映射）

antd 单滑块 `value` 是 `number`；eview `value` 永远是数组，单滑块 `[v]`，区间 `[min, max]`。

```jsx
// antd 单滑块
<Slider value={50} onChange={(v) => setV(v)} />

// eview 单滑块
const [v, setV] = useState<number[]>([50]);
<DragInput value={v} onChange={(value: number[]) => setV(value)} />   // value = [50]，取值用 v[0]
```

### 2.2 `step` → `precision`（综合映射）

antd `step` 是步长（如 `step={0.1}`）；eview `precision` 是小数位（如 `precision={1}`）。两者语义不同但可换算：`precision = 小数位数(step)`。

```js
function stepToPrecision(step) {
  if (step == null) return 0;
  const s = String(step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;   // 0.1 → 1, 0.01 → 2, 1 → 0
}
```

注：antd `step=null`（仅 marks 可选值）在 eview 无对应，刻度位置用 `markIndexes` 表达但拖拽粒度无法限制。

### 2.3 `range` → `type`（改值）

antd 用 `range` 布尔开启双滑块；eview 用 `type` 字符串。

```jsx
// antd 区间
<Slider range value={[60, 90]} onChange={(v) => setThreshold(v)} />

// eview 区间
const [threshold, setThreshold] = useState<number[]>([60, 90]);
<DragInput type="range" value={threshold} onChange={(value: number[]) => setThreshold(value)} />
```

### 2.4 `marks` → `markIndexes` + `labelFormat`（综合映射）

antd `marks` 是对象 `{ 数值: 文字 }`；eview `markIndexes` 是数值数组（只管位置），`labelFormat` 管文字格式化。

```jsx
// antd
<Slider marks={{ 0: '0%', 50: '50%', 100: '100%' }} />

// eview
<DragInput
  markIndexes={[0, 50, 100]}
  labelFormat={(value?: number) => ({ formatValue: `${value}%` })}   // 所有刻度统一格式
/>
```

注：antd marks 可为每个刻度单独设置不同文字，eview `labelFormat` 是统一函数；若需每刻度不同文字，需在 `labelFormat` 内按 value 分支返回。

```jsx
const MARK_TEXT = { 0: '最小', 50: '中', 100: '最大' };
<DragInput
  markIndexes={[0, 50, 100]}
  labelFormat={(value?: number) => ({ formatValue: MARK_TEXT[value] ?? String(value) })}
/>
```

### 2.5 `onChange` 签名转换（综合映射）

antd `onChange(value)`（标量或数组）；eview `onChange(value[], changeValue?)`——第一参始终是数组。

```jsx
// antd 单滑块：onChange(number)
<Slider onChange={(v: number) => setBandwidth(v)} />

// eview 单滑块：onChange(number[], changeValue?)
<DragInput onChange={(value: number[], changeValue?: number[]) => setBandwidth(value)} />
// 取单滑块值用 value[0]；changeValue 是本次改变的值
```

## 3. 无法映射的属性与建议处理

### 3.1 `autoFocus` → `ref.focus()`

```jsx
const dragRef = useRef(null);
useEffect(() => { dragRef.current?.focus?.(); }, []);
<DragInput ref={dragRef} value={v} onChange={setV} />
```

### 3.2 `tooltip` 数值提示

eview 无拖拽时的浮动 Tooltip。如需显示当前值，保留内置输入框（`displayInput` 默认 true）或用刻度文字 `labelFormat`。

```jsx
<DragInput displayInput value={v} onChange={setV} />   {/* 内置输入框显示当前值 */}
```

### 3.3 `onChangeComplete` 防抖

eview 无「拖拽结束」回调，需在 `onChange` 里自行防抖。

```jsx
const timerRef = useRef(null);
<DragInput
  value={v}
  onChange={(value: number[]) => {
    setV(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 400);  // 停拖 400ms 后提交
  }}
/>
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用 `value` 受控初始化 |
| `dots` | 忽略，`markIndexes` 仅显示刻度 |
| `included` | 忽略 |
| `vertical` | 忽略（eview 无竖排） |
| `reverse` | 忽略 |
| `keyboard` | 忽略 |
| `tooltip.*` | 用 `displayInput` / `labelFormat` 近似 |
| `classNames` / `styles` | `stickStyle` / `barStyle` / `inputStyle` |
| `range.draggableTrack` / `range.editable` / `range.minCount` / `range.maxCount` | 忽略 |

## 4. 完整示例对照

```jsx
// antd
<Slider
  min={0}
  max={1000}
  step={10}
  marks={{ 0: '0', 500: '500', 1000: '1000' }}
  tooltip={{ formatter: (v) => `${v} Mbps` }}
  value={bandwidth}
  onChange={(v) => setBandwidth(v)}
  onChangeComplete={save}
/>

// eview 等价
import DragInput from '@nce/eview-react/DragInput';
const [bandwidth, setBandwidth] = useState<number[]>([200]);
const saveTimer = useRef(null);
<DragInput
  min={0}
  max={1000}
  precision={0}                                          // step={10} → precision 估算（见 2.2）
  markIndexes={[0, 500, 1000]}                           // marks 位置
  labelFormat={(value?: number) => ({ formatValue: `${value} Mbps` })}  // tooltip.formatter 近似
  unit="Mbps"
  value={bandwidth}                                       // [v] 数组
  onChange={(value: number[]) => {
    setBandwidth(value);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(value[0]), 400);  // onChangeComplete 防抖
  }}
/>
```
