# Radio → Radio 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Radio` ⇄ eview `Radio`
- antd `Radio.Group` ⇄ eview `RadioGroup`
- 定位差异：两者都是「单选框 + 单选组」。最关键的差异是**选项数据来源**：antd `Radio.Group` 既支持 `options` 配置，也支持 `children` 嵌套 `<Radio>`（两种写法）；eview `RadioGroup` **只支持 `data` 属性传选项**，不支持 children 嵌套（component-use 明确）。选项字段名也不同：antd `options` 用 `{ label, value, disabled, ... }`，eview `data` 用 `{ value, text, checked? }`（**`text` 不是 `label`**）。受控标记不同：antd 默认受控（传 `value` 即受控），eview 需显式 `isControlled` 才让 state 真正驱动显示。回调签名不同：antd `onChange(e)`（取 `e.target.value`），eview `RadioGroup.onChange` 参数顺序在资料中冲突（`oldValue, value, event` 与 `value, oldValue, event` 两种说法），需兼容写法。eview `Radio`（单个）的 `onChange(value, event)` 与 antd 单个 Radio 语义一致。eview 无 `Radio.Button` / `buttonStyle` / `optionType` / `block` / `name`，按钮样式用 `SelectCard` 近似。

## 1. 属性映射表

### Radio（单个）

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `autoFocus` | — | ❌ 无法映射 | eview Radio 无 autoFocus，用 `ref.focus()` 近似 |
| `checked` | `checked` | 直接改名 | |
| `defaultChecked` | — | ❌ 无法映射 | eview Radio 需 `isControlled` + `checked` 受控；非受控初始用初始 state |
| `disabled` | `disabled` | 直接改名 | |
| `value` | `value` | 直接改名 | |
| — | `label` / `labelPosition` | eview 特有 | 显示文字 / 文字位置（默认 `after`，即文字在圆点后） |
| — | `isControlled` | eview 特有 | 设为受控组件，要用 state 驱动 checked 必传 |
| — | `onChange(value, event)` | eview 特有 | 选中回调，第一参是新值（见 2.1） |
| — | `tipText` / `tipData` | eview 特有 | 悬浮提示 |
| — | `description` | eview 特有 | label 的描述文字 |

### Radio.Group

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `buttonStyle` (`outline` / `solid`) | — | ❌ 无法映射 | eview 无按钮风格样式，按钮样式改用 `SelectCard`（第二批） |
| `defaultValue` | — | ❌ 无法映射 | eview 仅受控（需 `isControlled`）；用初始 state 近似 |
| `disabled` | `disabled` | 直接改名 | |
| `name` | — | ❌ 无法映射 | eview 无 name 属性，表单内由 `Form.Item` 的 `name` 托管 |
| `options` | `data` | 改名 + 改值 | antd `{ label, value, disabled, ... }` → eview `{ value, text, checked? }`，`label` → `text`（见 2.2） |
| `optionType` (`default` / `button`) | — | ❌ 无法映射 | eview 无按钮型 Radio；`button` 改用 `SelectCard` 或自行样式 |
| `size` | — | ❌ 无法映射 | eview 无 size，按钮样式才生效，eview 无按钮样式故不适用 |
| `value` | `value` | 直接改名 | 需配 `isControlled` 才受控 |
| `block` | — | ❌ 无法映射 | eview 无宽度铺满，靠 `style={{ width: '100%' }}` |
| `onChange(e)` | `onChange(a, b, event)` | 改名 + 签名调整 | antd 取 `e.target.value`；eview 参数顺序冲突，需兼容写法（见 2.3） |
| — | `label` / `labelPosition` / `title` | eview 特有 | 组名及位置 / 组名提示 |
| — | `isControlled` | eview 特有 | 受控标记，要用 state 驱动必传 |
| — | `type` (`horizontal` / `vertical`) | eview 特有 | 排布方向（antd 靠外层布局） |
| — | `rows` / `rowSpacing` / `colSpacing` | eview 特有 | 多行多列排布及间距 |
| — | `required` | eview 特有 | 必填 |

### CheckboxOptionType（options 子项字段）

| antd 字段 | eview `data` 字段 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `label` | `text` | 改值 | 显示文字字段名不同 |
| `value` | `value` | 直接改名 | |
| `disabled` | — | ❌ 无法映射 | eview `data` 项无单独 disabled，整组用 `RadioGroup.disabled` |
| `style` / `className` | — | ❌ 无法映射 | eview `data` 项无单独样式 |
| `title` / `id` | — | ❌ 无法映射 | eview `data` 项无 title / id |
| `onChange` | — | ❌ 无法映射 | eview 单项无独立 onChange，统一走组 `onChange` |
| `required` | — | ❌ 无法映射 | eview `data` 项无单独 required |
| — | `checked` | eview 特有 | 初始选中（与 `value` 同时存在以 `value` 为准） |

## 2. 处理方式详解

### 2.1 单个 `Radio` 的 `onChange(value, event)`

```jsx
// antd：单个 Radio 无 onChange，靠 Group 的 onChange(e.target.value)
<Radio value="day" checked={unit === 'day'}>按天</Radio>

// eview：单个 Radio 有 onChange(value, event)，配合 isControlled + checked
<Radio
  label="按天"
  value="day"
  isControlled
  checked={unit === 'day'}
  onChange={(value: string) => setUnit(value)}
/>
```

### 2.2 `options` → `data`（改值，字段名 `label` → `text`）

```jsx
// antd
<Radio.Group
  value={mode}
  options={[
    { label: '快速创建', value: 'quick' },
    { label: '自定义创建', value: 'custom' },
  ]}
/>

// eview：label → text，用 data 传选项（唯一方式）
<RadioGroup
  isControlled
  value={mode}
  data={[
    { text: '快速创建', value: 'quick' },
    { text: '自定义创建', value: 'custom' },
  ]}
/>
```

> ⚠️ antd `options` 也支持 `string[]` / `number[]` 简写（每项既是 label 又是 value）；eview `data` 不支持简写，需展开成 `{ value, text }`。

### 2.3 `RadioGroup.onChange` 签名调整（参数顺序冲突，兼容写法）

antd `onChange(e)` 取 `e.target.value`；eview `RadioGroup.onChange` 类型声明是 `(oldValue, value, event)`，文字描述是 `(value, oldValue, event)`，**官方示例无调用**，顺序未决。兼容写法：与当前 state 相等的是旧值，另一个是新值。

```jsx
// antd
<Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} />

// eview：兼容两种顺序
<RadioGroup
  isControlled
  value={mode}
  onChange={(a: string, b: string, event) => {
    const next = a === mode ? b : a;   // 与当前值相等的是旧值，另一个是新值
    setMode(next);
  }}
/>
```

> ⚠️ 反面：`<RadioGroup onChange={(value) => setMode(value)} />` 有 50% 概率拿到旧值。

## 3. 无法映射的属性与建议处理

### 3.1 `Radio.Button` / `buttonStyle` / `optionType`（按钮样式）

eview 无按钮型 Radio，按钮样式（描边 / 填色）改用 `SelectCard`（第二批）或自行样式近似：

```jsx
// antd
<Radio.Group buttonStyle="solid" optionType="button">
  <Radio.Button value="a">A</Radio.Button>
  <Radio.Button value="b">B</Radio.Button>
</Radio.Group>

// eview：无对应，改用 SelectCard（第二批）或普通 RadioGroup
<RadioGroup
  isControlled
  value={v}
  data={[{ text: 'A', value: 'a' }, { text: 'B', value: 'b' }]}
  onChange={(a, b) => setV(a === v ? b : a)}
/>
```

### 3.2 children 嵌套写法（不支持）

eview `RadioGroup` **不支持** children 嵌套 `<Radio>`，必须用 `data` 传选项：

```jsx
// antd（不推荐但支持）
<Radio.Group value={v}>
  <Radio value={1}>A</Radio>
  <Radio value={2}>B</Radio>
</Radio.Group>

// eview：必须用 data
<RadioGroup isControlled value={v} data={[{ text: 'A', value: 1 }, { text: 'B', value: 2 }]} onChange={...} />
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultChecked` / `defaultValue` | 用初始 `useState` 值 + `isControlled` 近似 |
| `autoFocus` | `ref.focus()` 命令式 |
| `name` | 表单内由 `Form.Item` 的 `name` 托管；独立使用忽略 |
| `block` | `style={{ width: '100%' }}` |
| `size` | 按钮样式才生效，eview 无按钮样式，忽略 |
| options 子项 `disabled` / `style` / `className` / `title` / `id` | 整组用 `RadioGroup.disabled`；单项样式不支持，忽略 |
| options 子项 `onChange` / `required` | 统一走组 `onChange` / 组 `required` |

## 4. 完整示例对照

```jsx
// antd
<Radio.Group
  value={mode}
  options={[
    { label: '快速创建', value: 'quick' },
    { label: '自定义创建', value: 'custom' },
  ]}
  disabled={false}
  onChange={(e) => setMode(e.target.value)}
/>

// eview 等价
<RadioGroup
  label="创建方式"                    // 内置组名（原 Form.Item label）
  isControlled                         // 受控标记，要用 state 驱动必传
  value={mode}
  data={[
    { text: '快速创建', value: 'quick' },   // label → text
    { text: '自定义创建', value: 'custom' },
  ]}
  onChange={(a: string, b: string) => {      // 参数顺序冲突，兼容写法
    setMode(a === mode ? b : a);
  }}
/>

// 竖排 + 必填（antd 靠外层布局）
// antd: <div style={{ display:'flex', flexDirection:'column' }}><Radio.Group .../></div>
// eview:
<RadioGroup
  label="统计范围"
  type="vertical"                      // 竖排内置
  required
  isControlled
  value={range}
  data={[
    { text: '近 1 天', value: '1d' },
    { text: '近 7 天', value: '7d' },
    { text: '近 30 天', value: '30d' },
  ]}
  onChange={(a, b) => setRange(a === range ? b : a)}
/>
```
