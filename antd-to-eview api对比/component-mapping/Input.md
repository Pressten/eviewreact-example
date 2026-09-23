# Input → TextField 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Input` ⇄ eview `TextField`
- 定位差异：antd `Input` 是裸单行输入框，前缀 / 后缀 / 字数统计 / 清除按钮 / 校验状态等靠属性拼装，标签与校验依赖外层 `Form.Item`。eview `TextField` 是「一行表单字段」整体——自带 `label`、必填星号、内置校验（`validator` / `defaultValidator`）与错误提示（`hintType`），值与校验可由内部托管或 `Form.Item` 托管。eview **没有** `prefix` / `allowClear` / `showCount` / `variant` / `size` / `bordered`，密码显隐用 `type="password"`（无 `visibilityToggle` / `iconRender`）。本文只覆盖 antd `Input` 单行输入框，不含 `Input.TextArea` / `Input.Search` / `Input.Password` / `Input.OTP`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `addonAfter` | — | ❌ 无法映射 | 已废弃，antd 建议用 `Space.Compact`；eview 无前后置标签 |
| `addonBefore` | — | ❌ 无法映射 | 同上 |
| `allowClear` | — | ❌ 无法映射 | eview 无清除按钮，自行用 `suffix` 放清除图标 + `onClick` 清空 value（见 3.1） |
| `bordered` | — | ❌ 无法映射 | 已废弃，antd 建议用 `variant`；eview 无 variant，靠 `style` 控制边框 |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，用 `inputStyle` / `labelStyle` / `containerStyle` / `className` |
| `count` | — | ❌ 无法映射 | eview 无字符计数配置，自行 `maxLength` + 外部计数文案（见 3.2） |
| `defaultValue` | — | ❌ 无法映射 | eview 仅受控 `value`；用 `useState` 初始值近似（见 3.3） |
| `disabled` | `disabled` | 直接改名 | |
| `id` | `id` | 直接改名 | |
| `maxLength` | `maxLength` | 直接改名 | |
| `prefix` | — | ❌ 无法映射 | eview 无前缀，自行外层布局或用 `suffix` 近似（位置在右侧，语义不同）（见 3.4） |
| `showCount` | — | ❌ 无法映射 | eview 无字数展示，自行 `maxLength` + 外部文案（见 3.2） |
| `status` | `validator` + `hintType` | 综合映射 | `'error'` / `'warning'` 表达校验失败，用 `validator` 返回 `{ result: false, message }` + `hintType`（见 2.1） |
| `styles` | `inputStyle` / `labelStyle` / `containerStyle` / `tipStyle` / `style` | 综合映射 | 按区域拆到对应局部样式属性（见 2.2） |
| `size` | — | ❌ 无法映射 | eview 无 size，靠 `style` 的 `fontSize` / `padding` 近似；`enableFixWidth` 控 label 与输入框间距，不是尺寸 |
| `suffix` | `suffix` | 直接改名 | |
| `type` | `type` | 改值 | `text` → `text`、`password` → `password` 一致；其他类型（`number` / `email` / `tel`…）eview 不支持，数字用 `format="number"`（见 2.3） |
| `value` | `value` | 直接改名 | |
| `variant` | — | ❌ 无法映射 | eview 无形态变体（outlined/borderless/filled/underlined），靠 `style` 自定义背景 / 边框 |
| `onChange(e)` | `onChange(value, oldValue, event)` | 改名 + 签名调整 | 第一参从 `event` 变为新值 `value`（见 2.4） |
| `onPressEnter(e)` | `onKeyDown(event)` | 综合映射 | eview 无专用回车回调，用 `onKeyDown` 判断 `event.key === 'Enter'`（见 2.5） |
| `onClear()` | — | ❌ 无法映射 | 依赖 `allowClear`，eview 无清除按钮 |
| — | `label` / `labelPosition` | eview 特有 | 内置标签，antd 需外层 `Form.Item` 的 `label` |
| — | `required` / `hideRequiredMark` | eview 特有 | 内置必填校验 + 星号 |
| — | `validator` / `TextField.defaultValidator.*` | eview 特有 | 内置 / 自定义校验规则 |
| — | `hintType` | eview 特有 | 错误提示形式 `'div'` / `'tip'` |
| — | `ruleText` / `focusTip` / `showFocusTipAndError` | eview 特有 | 常驻规则提示 / 聚焦提示 |
| — | `isCharacterAllowed` | eview 特有 | 输入字符白名单拦截 |
| — | `format` | eview 特有 | `'number'` 只允许输数字 |
| — | `readOnly` | eview 特有 | 只读（antd 经原生 input 透传也有 `readOnly`） |
| — | `onBlur(event, value)` | eview 特有 | 失焦回调，注意参数顺序与 `onChange` 不同 |
| — | `autoComplete` / `canPasswordPaste` / `isAllowToModifyPasswordByProps` | eview 特有 | 密码框相关 |
| — | `inputStyle` / `labelStyle` / `containerStyle` / `tipStyle` / `enableFixWidth` | eview 特有 | 局部样式与 label 间距 |
| — | `ref.getValue()` / `ref.validate()` / `ref.focus()` | eview 特有 | 命令式取值 / 触发校验 / 聚焦 |

> antd `Input` 其余属性（`onFocus` / `onBlur` / `onClick` / `onKeyDown` / `readOnly` 等）经原生 input 透传，eview `TextField` 同样透传同名事件（`onFocus` / `onKeyDown` / `onKeyUp` / `onPaste` / `onClick`），签名一致 `(event) => void`，可直接保留。

## 2. 处理方式详解

### 2.1 `status` → `validator` + `hintType`（综合映射）

antd 用 `status='error' | 'warning'` 标红输入框；eview 用 `validator` 返回 `{ result: false, message }` 表达校验失败，`hintType` 控制提示形式。`warning` 与 `error` 的区别需靠 `validator` 返回的 `type` 字段区分（`'error'` / `'tip'`）。

```jsx
// antd
<Input status="error" placeholder="出错了" />

// eview：用 validator 表达「始终错误」；真实场景按业务规则判断
<TextField
  placeholder="出错了"
  validator={(value) => ({ result: false, message: '该名称已存在' })}
  hintType="div"   // 错误提示在输入框下方占位；'tip' 用气泡
/>

// warning 态：validator 返回 type: 'tip' 近似（eview 无独立 warning 视觉）
<TextField
  validator={(value) => ({ result: true, message: '建议填写', type: 'tip' })}
  hintType="tip"
/>
```

注：若只是外部一次性置错（如服务端校验失败），也可不传 `validator`，用 `ruleText` / 外部文案展示，避免 `validator` 在每次输入时重算。

### 2.2 `styles` → 局部样式属性（综合映射）

antd `styles` 按 `SemanticDOM`（`input` / `affix-wrapper` / `prefix` / `suffix` 等）传 CSSProperties；eview 拆成多个局部样式属性。

```jsx
// antd
<Input styles={{ input: { color: '#333' }, suffix: { marginLeft: 8 } }} />

// eview
<TextField inputStyle={{ color: '#333' }} style={{}} /* suffix 直接是 ReactNode，样式写在元素上 */ />
```

映射关系：`input` → `inputStyle`；`label` → `labelStyle`；容器 → `containerStyle`；提示 → `tipStyle`；整体 → `style`。

### 2.3 `type` 非常规值处理（改值）

eview `type` 仅支持 `'text'` / `'password'`。antd 透传的原生 `type`（`number` / `email` / `tel` / `url`…）需转换：

```jsx
// antd 数字输入
<Input type="number" />

// eview：用 format="number" 只允许输数字（值仍是 string）
<TextField format="number" />

// 邮箱：用 validator 校验格式，type 保持 text
<TextField type="text" validator={TextField.defaultValidator.email()} />
```

### 2.4 `onChange` 签名调整

```jsx
// antd：onChange(event)，取值用 e.target.value
<Input value={name} onChange={(e) => setName(e.target.value)} />

// eview：onChange(value, oldValue, event)，第一个参数就是新值
<TextField value={name} onChange={(value, oldValue, event) => setName(value)} />
// oldValue / event 不用可忽略。
```

> ⚠️ 反面：`<TextField onChange={(e) => setName(e.target.value)} />` —— `e` 实际是新值字符串，`e.target` 为 `undefined` 会报错。

### 2.5 `onPressEnter` → `onKeyDown`（综合映射）

```jsx
// antd
<Input onPressEnter={(e) => handleSearch()} />

// eview：用 onKeyDown 判断回车
<TextField onKeyDown={(event) => { if (event.key === 'Enter') handleSearch(); }} />
```

## 3. 无法映射的属性与建议处理

### 3.1 `allowClear`（清除按钮）

eview 无内置清除按钮，用 `suffix` 放一个清除图标，点击时清空受控 `value`：

```jsx
// antd
<Input allowClear value={name} onChange={(e) => setName(e.target.value)} />

// eview
import { IconPlusIcPublicClose } from '@nce/icon-plus';
<TextField
  value={name}
  onChange={(v) => setName(v)}
  suffix={name ? <IconPlusIcPublicClose onClick={() => setName('')} style={{ cursor: 'pointer' }} /> : null}
/>
```

### 3.2 `showCount` / `count`（字符计数）

eview 无字数展示，自行用 `maxLength` + 外部文案：

```jsx
// antd
<Input showCount maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />

// eview
<TextField
  maxLength={20}
  value={name}
  onChange={(v) => setName(v)}
/>
<span>{name.length}/20</span>
```

`count` 的 `strategy`（自定义计数策略）/ `exceedFormatter`（超长裁剪）用 `isCharacterAllowed` 拦截或在外部 `onChange` 里自行处理。

### 3.3 `defaultValue`（非受控初始值）

eview 仅受控 `value`，用 `useState` 初始值近似：

```jsx
// antd
<Input defaultValue="hello" />

// eview
const [name, setName] = useState('hello');
<TextField value={name} onChange={(v) => setName(v)} />
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `prefix` | 外层 `<div>` 横向布局放图标 + `TextField`，或用 `suffix` 近似（位置在右） |
| `variant` (`borderless` / `filled` / `underlined`) | `style` 自定义背景 / 边框；`borderless` 用 `inputStyle={{ border: 'none' }}` |
| `size` (`large` / `small`) | `style={{ fontSize: 14, padding: '4px 11px' }}` 近似 |
| `addonAfter` / `addonBefore` | 已废弃，外层 `Space.Compact` 或自定义布局 |
| `bordered` | 已废弃，用 `variant`；eview 用 `style` 控边框 |
| `classNames` | `inputStyle` / `labelStyle` / `containerStyle` / `className` |
| `onClear` | 同 3.1，在清除图标 `onClick` 里自行调用 |

## 4. 完整示例对照

```jsx
// antd
<Input
  allowClear
  prefix={<UserOutlined />}
  suffix={<span>{name.length}/20</span>}
  showCount
  maxLength={20}
  status="error"
  size="large"
  placeholder="请输入用户名"
  value={name}
  onChange={(e) => setName(e.target.value)}
  onPressEnter={handleSearch}
/>

// eview 等价
import { IconPlusIcPublicUser, IconPlusIcPublicClose } from '@nce/icon-plus';
const [name, setName] = useState('');
<TextField
  label="用户名"                      // label 内置（原 Form.Item label）
  placeholder="请输入用户名"
  maxLength={20}
  required                            // 若原 Form.Item required
  validator={(value) => ({ result: value.length > 0, message: '不能为空' })}  // status=error 近似
  hintType="div"
  value={name}
  onChange={(value) => setName(value)}                 // onChange(value) 签名
  onKeyDown={(event) => { if (event.key === 'Enter') handleSearch(); }}  // onPressEnter → onKeyDown
  inputStyle={{ fontSize: 14, padding: '6px 11px' }}   // size=large 近似
  suffix={
    <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>{name.length}/20</span>                    // showCount 近似
      {name ? <IconPlusIcPublicClose onClick={() => setName('')} style={{ cursor: 'pointer' }} /> : null}
    </span>
  }
/>
// prefix 用外层布局近似：
// <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//   <IconPlusIcPublicUser /><TextField ... />
// </div>
```
