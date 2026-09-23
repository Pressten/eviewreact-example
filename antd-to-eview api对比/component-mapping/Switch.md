# Switch → Toggle 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Switch` ⇄ eview `Toggle`（`Switch` 是 eview 同 API 的超集，多了 `isControlToggled`/`allowPropagation`）
- 定位差异：两者都是「两态开关」。但 eview Toggle 状态属性叫 `toggled`（不是 `checked`），回调叫 `onToggle(value)`（不是 `onChange`）；`value` 来自 `data=[关值, 开值]` 数组，不是直接布尔。开关内文字属性拼写是 `taggledChildren`/`unTaggledChildren`（官方即如此拼，照抄）。eview Toggle 无 `loading`/`size` 能力；需要「切换前二次确认」用 `Switch isControlToggled`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `checked` | `toggled` | 改名 | 状态属性名转换 |
| `value` | `toggled` | 改名 | antd `value` 是 `checked` 别名（5.12.0），同样映射到 `toggled` |
| `defaultChecked` | — | ❌ 无法映射 | eview 无默认值属性，改用 `toggled` 受控初始化 |
| `defaultValue` | — | ❌ 无法映射 | 同上，`defaultChecked` 别名 |
| `checkedChildren` | `taggledChildren` | 改名 | 注意拼写：eview 是 `taggled`（官方即如此），不是 `toggled`（见 2.1） |
| `unCheckedChildren` | `unTaggledChildren` | 改名 | 同上拼写注意 |
| `disabled` | `disabled` | 直接改名 | |
| `onChange` | `onToggle` | 综合映射 | 签名不同：antd `(checked, event)` → eview `(value)`（见 2.2） |
| `onClick` | — | ❌ 无法映射 | eview 无独立点击回调，`onToggle` 已覆盖切换 |
| `loading` | — | ❌ 无法映射 | eview Toggle 无 loading；用 `disabled` + 外层 `Loading type="micro"`（见 3.1） |
| `size` | — | ❌ 无法映射 | eview 无尺寸属性 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus |
| `className` | `className` | 直接改名 | |
| — | `data` | eview 特有 | 两态值集合 `[关值, 开值]`，`onToggle` 回传对应值 |
| — | `label` / `labelPosition` | eview 特有 | 文本及位置 |
| — | `required` | eview 特有 | 必填标记 |
| — | `fieldStyle` / `fieldClassName` | eview 特有 | 字段样式 |
| — | `labelStyle` / `labelClassName` | eview 特有 | 名称样式 |
| — | `style` / `id` | eview 特有 | 最外层 |
| — | `Switch.isControlToggled` | eview 特有 | 外部控制切换（点击后先确认再 setState） |
| — | `Switch.allowPropagation` | eview 特有 | 允许点击事件冒泡 |

## 2. 处理方式详解

### 2.1 `checkedChildren`/`unCheckedChildren` → `taggledChildren`/`unTaggledChildren`（改名 + 拼写）

eview 文案属性拼写是 `taggled`（不是 `toggled`），`unTaggled`（T 大写），官方即如此，照抄。

```jsx
// antd
<Switch checked={on} checkedChildren="开" unCheckedChildren="关" onChange={setOn} />

// eview
<Toggle toggled={on} taggledChildren="开" unTaggledChildren="关" onToggle={setOn} />
```

### 2.2 `onChange` → `onToggle`（综合映射）

antd `onChange(checked, event)`；eview `onToggle(value)`——`value` 来自 `data=[关值, 开值]`，是当前状态对应的值。

```jsx
// antd：onChange(checked, event)
<Switch checked={enabled} onChange={(checked, event) => setEnabled(checked)} />

// eview：onToggle(value)
<Toggle
  data={[false, true]}                         // [关值, 开值]
  toggled={enabled}
  onToggle={(value) => setEnabled(value)}      // value 即 data 中当前态的值
/>
```

注：eview `data` 决定 `onToggle` 回传的值；不传 `data` 时 demo 直接按 `!toggled` 翻转，推荐显式传 `data={[false, true]}` 保证一致。

## 3. 无法映射的属性与建议处理

### 3.1 `loading` → `disabled` + `Loading type="micro"`

eview Toggle 无 loading 态，用 `disabled` 禁用 + 外层微型 Loading 表达。

```jsx
import Loading from '@nce/eview-react/Loading';
<Toggle
  data={[false, true]}
  toggled={enabled}
  disabled={switching}                          // loading → disabled
  onToggle={handleToggle}
/>
<Loading type="micro" isOpen={switching} desc="切换中" />
```

### 3.2 `autoFocus`

eview Toggle 无 autoFocus，无对应方法（Toggle 无公开 focus/blur）。

### 3.3 `size="small"`

eview 无尺寸属性，小尺寸需自定义 `fieldStyle` 缩放。

### 3.4 在 Form 内的绑定差异

antd Switch 在 Form.Item 下需 `valuePropName="checked"`；eview Toggle 需 `valuePropName="toggled"` + `updateTrigger="onToggle"`。

```jsx
// antd
<Form.Item name="enabled" valuePropName="checked">
  <Switch />
</Form.Item>

// eview
<Form.Item name="enabled" valuePropName="toggled" updateTrigger="onToggle">
  <Toggle data={[false, true]} />
</Form.Item>
```

### 3.5 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultChecked` / `defaultValue` | 用 `toggled` 受控初始化 |
| `onClick` | `onToggle` 覆盖 |
| `loading` | `disabled` + `Loading type="micro"` |
| `size` | 自定义 `fieldStyle` |
| `autoFocus` | 忽略 |

## 4. 完整示例对照

```jsx
// antd
<Switch
  checked={enabled}
  defaultChecked={false}
  checkedChildren="开"
  unCheckedChildren="关"
  loading={switching}
  disabled={readonly}
  onChange={(checked, event) => setEnabled(checked)}
/>

// eview 等价
import Toggle from '@nce/eview-react/Toggle';
import Loading from '@nce/eview-react/Loading';
<Toggle
  data={[false, true]}                          // onToggle 回传值的来源
  toggled={enabled}                             // checked → toggled
  taggledChildren="开"                          // checkedChildren → taggledChildren（拼写注意）
  unTaggledChildren="关"                        // unCheckedChildren → unTaggledChildren
  disabled={readonly || switching}             // disabled 保留 + loading 等价
  onToggle={(value) => setEnabled(value)}       // onChange(checked,event) → onToggle(value)
/>
<Loading type="micro" isOpen={switching} desc="切换中" />  {/* loading → micro Loading */}
```
