# Checkbox → Checkbox 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Checkbox` ⇄ eview `Checkbox`（单个复选框）
- antd `Checkbox.Group` ⇄ eview `CheckboxGroup`（复选框组）
- 定位差异：两者都是「复选框 + 半选态」。但 antd `Checkbox` 用 `children` 显示文字、`indeterminate` 表半选、`onChange(e)` 回调且勾选态在 `e.target.checked`；eview `Checkbox` 用 **`label`** 显示文字、**`halfChecked`** 表半选、`onChange(value, checked, event, additionalData)` **第二个参数才是勾选态**。`CheckboxGroup` 方面，antd 用 `options` 数组（`label`/`value`），eview 用 `data` 数组（**`text`**/`value`，非 `label`），且自带 `selectAll` 全选框、`rows` 行列排布、`validtor`（拼写如此）校验。

## 1. 属性映射表（Checkbox 单个）

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `checked` | `checked` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `indeterminate` | `halfChecked` | 改名 | |
| `onChange` | `onChange` | 改名 + 签名调整 | antd `(e: CheckboxChangeEvent)`，勾选态在 `e.target.checked`；eview `(value, checked, event, additionalData)`，**第二参**才是勾选态（见 2.1） |
| `children` | `label` | 改名 | antd 用 children 显示文字；eview 用 `label` |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus，用 `boxTabIndex` 或 mount 时无原生 focus 近似 |
| `defaultChecked` | — | ❌ 无法映射 | eview 无非受控，需改为受控 `checked`（见 3.1） |
| `onBlur` | `onBlur` | 改名 + 签名调整 | antd `function()`；eview `(value, checked, event)`（见 2.2） |
| `onFocus` | `onFocus` | 改名 + 签名调整 | 同上 |
| `blur()` / `focus()` | — | ❌ 无法映射 | eview Checkbox 无 ref 方法 |
| `nativeElement` | — | ❌ 无法映射 | eview 无 DOM 节点获取 |
| `classNames` | — | ❌ 无法映射 | 改用 `className` |
| `styles` | — | ❌ 无法映射 | 改用 `style` |
| — | `label` / `value` | eview 特有 | antd 用 children；eview 用 `label` 显示，`value` 存取值 |
| — | `labelPosition` | eview 特有 | 文字在图标左/右（`before`/`after`，默认 after） |
| — | `onPreChange` | eview 特有 | 返回 `false` 阻止本次切换 |
| — | `additionalData` | eview 特有 | 透传到 `onChange` 第四参 |
| — | `tipText` / `tipData` | eview 特有 | 悬浮提示 |
| — | `name` / `boxTabIndex` | eview 特有 | 表单 name / 方框 tabindex |

## 1b. 属性映射表（Checkbox.Group → CheckboxGroup）

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `options` | `data` | 综合映射 | 字段名：antd `{ label, value, disabled }` → eview `{ text, value, checked?, tipText? }`（见 2.3） |
| `value` | `value` | 直接改名 | 均为选中值数组 |
| `disabled` | `disabled` | 直接改名 | |
| `onChange` | `onChange` | 改名 + 签名调整 | antd `(checkedValue: T[])`；eview `(value, oldValue, event)`（见 2.4） |
| `defaultValue` | `value` | 综合映射 | antd 非受控 → eview 受控 `value`（见 3.2） |
| `name` | — | ❌ 无法映射 | eview CheckboxGroup 无 name，单个 Checkbox 有 `name` |
| `title` | — | ❌ 无法映射 | eview 无 group 级 title |
| `className` | `fieldClassName` / `className` | 综合映射 | antd group class → eview 子项 / 外层 class |
| `style` | `fieldStyle` / `style` | 综合映射 | 同上 |
| — | `selectAll` | eview 特有 | 全选框 `{ text?, checked?, onChange? }`；antd 需自行实现全选 |
| — | `rows` | eview 特有 | 行列排布，如 `"0:1\|2"` |
| — | `required` / `validtor` | eview 特有 | 必填 / 校验（`validtor` 拼写如此，含 `minSelect`/`maxSelect`） |
| — | `hintType` | eview 特有 | 提示形式 `'div'`/`'tip'` |
| — | `label` / `labelPosition` / `itemLabelPosition` | eview 特有 | 组名 / 文字位置 |
| — | `fieldStyle` / `fieldClassName` | eview 特有 | 子项样式 |

## 2. 处理方式详解

### 2.1 `onChange` 签名调整（Checkbox 单个，重点）

antd 回调第一参是事件对象，勾选态在 `e.target.checked`；eview 回调**第二参**才是勾选态，第一参是 `value`。

```jsx
// antd：onChange(e)，勾选态在 e.target.checked
<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>同意协议</Checkbox>

// eview：onChange(value, checked, event, additionalData)
<Checkbox label="同意协议" checked={agreed} onChange={(value, checked) => setAgreed(checked)} />
// 第二参 checked 才是勾选态，切勿把第一参 value 当勾选态
```

### 2.2 `onBlur` / `onFocus` 签名调整

```jsx
// antd：function() 无参
<Checkbox onBlur={() => {}} onFocus={() => {}} />

// eview：(value, checked, event)
<Checkbox
  onBlur={(value, checked, event) => {}}
  onFocus={(value, checked, event) => {}}
/>
```

### 2.3 `options` → `data`（综合映射，CheckboxGroup）

antd 用 `label` 显示，eview 用 **`text`** 显示（与 Cascader 的 `label` 不同，勿混淆）。

```js
// antd options → eview data
function toEviewData(options) {
  return options.map((o) => {
    if (typeof o === 'string') return { text: o, value: o };
    return { text: o.label, value: o.value, disabled: o.disabled };
  });
}
```

```jsx
// antd
<Checkbox.Group options={[{ label: '紧急', value: 1 }, { label: '重要', value: 2 }]} />

// eview
<CheckboxGroup data={[{ text: '紧急', value: 1 }, { text: '重要', value: 2 }]} />
```

### 2.4 `onChange` 签名调整（CheckboxGroup）

```jsx
// antd：onChange(checkedValue: T[])
<Checkbox.Group onChange={(checkedValue) => setLevels(checkedValue)} />

// eview：onChange(value, oldValue, event)
<CheckboxGroup onChange={(value, oldValue, event) => setLevels(value)} />
// 第一参 value 即选中值数组，oldValue / event 可忽略
```

## 3. 无法映射的属性与建议处理

### 3.1 `defaultChecked`（非受控）

eview 无非受控，需改为受控 `checked` + `onChange`。

```jsx
// antd
<Checkbox defaultChecked>记住我</Checkbox>

// eview
const [checked, setChecked] = useState(true);
<Checkbox label="记住我" checked={checked} onChange={(value, c) => setChecked(c)} />
```

### 3.2 `defaultValue`（Group 非受控）

```jsx
// antd
<Checkbox.Group defaultValue={[1, 2]} />

// eview
const [levels, setLevels] = useState([1, 2]);
<CheckboxGroup value={levels} onChange={(value) => setLevels(value)} />
```

### 3.3 `autoFocus` / `blur()` / `focus()` / `nativeElement`

eview Checkbox 无 ref 方法，无 autoFocus。

```jsx
// antd
const ref = useRef();
ref.current.focus();
ref.current.blur();
ref.current.nativeElement;

// eview：无对应，用 boxTabIndex 近似可聚焦
<Checkbox label="..." boxTabIndex={0} />
// focus/blur 需自行获取 DOM（通过 className 查询，非官方推荐）
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `name`（Group） | 单个 Checkbox 有 `name`，Group 无 |
| `title`（Group） | 忽略 |
| `classNames` / `styles` | `className` / `style` |

## 4. 完整示例对照

```jsx
// antd：单个 Checkbox + 半选 + Group
<Checkbox indeterminate={half} checked={all} onChange={(e) => setAll(e.target.checked)}>全选</Checkbox>
<Checkbox.Group
  options={[{ label: '紧急', value: 1 }, { label: '重要', value: 2 }]}
  value={levels}
  onChange={(checkedValue) => setLevels(checkedValue)}
/>

// eview 等价
<Checkbox
  label="全选"                  // children → label
  halfChecked={half}            // indeterminate → halfChecked
  checked={all}
  onChange={(value, checked) => setAll(checked)}   // 签名：第二参是勾选态
/>
<CheckboxGroup
  data={[{ text: '紧急', value: 1 }, { text: '重要', value: 2 }]}  // options → data，label → text
  value={levels}
  onChange={(value, oldValue, event) => setLevels(value)}   // 签名调整
/>
```
