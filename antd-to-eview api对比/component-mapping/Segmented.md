# Segmented → SelectCard 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Segmented` ⇄ eview `SelectCard`（导入名是 `SelectCard`，官网页面叫 Segmented）
- 定位差异：两者都是「一组互斥的选项卡按钮」分段控制器，点一个选一个。但 eview SelectCard 用 `data` 数组驱动（不是 `options`），选项字段是 `text`/`value`（不是 `label`/`value`），禁用属性是 `disable`（不是 `disabled`，组件级与选项级同理）。eview SelectCard 支持 `tipsText` 悬浮提示与 `isTipShow` 开关，antd 无对应能力。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `options` | `data` | 综合映射 | 字段名不同：antd `{ label, value, icon?, disabled?, className? }` → eview `{ text, value, disable?, tipsText? }`（见 2.1） |
| `value` | `value` | 直接改名 | 均为选中项的 value |
| `defaultValue` | — | ❌ 无法映射 | eview 无默认值属性，改用 `value` 受控初始化 |
| `disabled` | `disable` | 改名 | 注意拼写：eview 是 `disable` 不是 `disabled`（见 2.2） |
| `onChange` | `onChange` | 综合映射 | 签名不同：antd `(value)` → eview `(value, event)`（见 2.3） |
| `size` | `type` | 改值 | antd `large`/`middle` → eview `default`；antd `small` → eview `small`（见 2.4） |
| `block` | — | ❌ 无法映射 | eview 无 block，改用 `style={{ width: '100%' }}` |
| `vertical` | — | ❌ 无法映射 | eview SelectCard 无竖排方向，竖排选项改用 `RadioGroup` |
| `shape` | — | ❌ 无法映射 | eview 无圆角形状属性 |
| `name` | — | ❌ 无法映射 | eview 无 input name 属性 |
| — | `label` / `labelPosition` | eview 特有 | 名称文字及位置（antd 用外层标签） |
| — | `required` | eview 特有 | 必填标记 |
| — | `isTipShow` | eview 特有 | 悬浮是否显示提示，默认 true |
| — | `itemStyle` / `itemClassName` | eview 特有 | 单个选项卡样式 |
| — | `labelStyle` / `labelClassName` | eview 特有 | 名称样式 |
| — | `ref.getValue()` | eview 特有 | 命令式取值 |

### SegmentedItemType → SelectCardItem

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `label` | `text` | 改名 | 显示文本字段名转换 |
| `value` | `value` | 直接改名 | |
| `icon` | — | ❌ 无法映射 | eview SelectCard 选项无图标字段，丢失图标 |
| `disabled` | `disable` | 改名 | 拼写差异 |
| `className` | — | ❌ 无法映射 | 改用 `itemStyle` / `itemClassName` |
| — | `tipsText` | eview 特有 | 悬浮提示，不设则显示 text |

## 2. 处理方式详解

### 2.1 `options` → `data` 字段转换（综合映射）

antd 用 `options`，字段 `{ label, value, icon?, disabled?, className? }`；eview 用 `data`，字段 `{ text, value, disable?, tipsText? }`。

```js
function toEviewData(antdOptions) {
  return antdOptions.map((o) => {
    // string/number 简写：antd options={['A','B']} → [{ value: 'A', text: 'A' }, ...]
    if (typeof o === 'string' || typeof o === 'number') {
      return { value: o, text: String(o) };
    }
    return {
      text: typeof o.label === 'string' ? o.label : String(o.label),  // label → text
      value: o.value,
      disable: o.disabled ?? false,                                   // disabled → disable
      // icon 丢失
    };
  });
}
```

### 2.2 `disabled` → `disable`（改名 + 拼写）

eview 的禁用属性是 `disable`（少一个 d），组件级与选项级都是。

```jsx
// antd
<Segmented disabled={submitting} options={opts} value={v} onChange={setV} />

// eview
<SelectCard disable={submitting} data={data} value={v} onChange={setV} />
```

### 2.3 `onChange` 签名转换（综合映射）

antd `onChange(value)`；eview `onChange(value, event)`——多一个 event 参数。

```jsx
// antd：onChange(value)
<Segmented onChange={(value) => setSize(value)} />

// eview：onChange(value, event)
<SelectCard onChange={(value, event) => setSize(value)} />
// 第一参 value 一致；第二参 event 不用可忽略。
```

### 2.4 `size` → `type`（改值）

antd 三档 size 收敛为 eview 两档 type。

```js
function toEviewType(size) {
  return size === 'small' ? 'small' : 'default';   // large/middle → default
}
```

## 3. 无法映射的属性与建议处理

### 3.1 `block` → `style` 宽度

```jsx
// antd
<Segmented block options={opts} value={v} onChange={setV} />

// eview
<SelectCard data={data} value={v} onChange={setV} style={{ width: '100%' }} />
```

### 3.2 `vertical` 竖排

eview SelectCard 无竖排方向。若需竖排互斥选项，改用 `RadioGroup`。

### 3.3 选项级 `icon` 丢失

eview SelectCardItem 无图标字段，带图标的分段控件需改用其他方案（如 `RadioGroup` 配图标）或放弃图标。

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用 `value` 受控初始化 |
| `block` | `style={{ width: '100%' }}` |
| `vertical` | 改用 `RadioGroup` |
| `shape` (round) | 忽略 |
| `name` | 忽略 |
| SegmentedItemType.`icon` | 丢失，改用其他组件或放弃 |
| SegmentedItemType.`className` | `itemStyle` / `itemClassName` |

## 4. 完整示例对照

```jsx
// antd
<Segmented
  block
  size="small"
  disabled={submitting}
  options={[
    { label: '列表', value: 'list', icon: <ListIcon /> },
    { label: '卡片', value: 'card' },
  ]}
  value={view}
  onChange={(value) => setView(value)}
/>

// eview 等价
import SelectCard from '@nce/eview-react/SelectCard';
const viewData = [
  { text: '列表', value: 'list' },     // label → text，icon 丢失
  { text: '卡片', value: 'card' },
];
<SelectCard
  type="small"                       // size → type
  disable={submitting}              // disabled → disable（拼写注意）
  data={viewData}                   // options → data
  value={view}
  onChange={(value, event) => setView(value)}  // 签名调整
  style={{ width: '100%' }}         // block → style 宽度
/>
```
