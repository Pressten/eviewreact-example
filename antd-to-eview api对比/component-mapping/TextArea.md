# TextArea → TextArea 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Input.TextArea` ⇄ eview `TextArea`
- 定位差异：两者都是「多行文本域」。但 eview TextArea 内置 `label`（名称）、`required`（必填标记）、`validator`（自定义校验，返回 `{ result, message }`）、`ruleText`（规则提示）等表单字段能力，antd `Input.TextArea` 只是个纯输入框，label/校验依赖外层 `Form.Item`。eview `maxLength` 会在右下角自动显示字数统计（无需 `showCount`）。eview `onChange` 签名是 `(targetValue, value, event)`——**第一参是新值**，不是 event；antd `onChange(e)` 第一参是 event。eview 用 `inputStyle={{ resize: 'both' }}` 表达可拉伸高度，antd 用 `autoSize`。eview **没有** `allowClear`/`onClear`/`showCount`（CountConfig）/`status`/`variant`/`size`/`prefix`/`suffix` 等属性。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `value` | `value` | 直接改名 | |
| `defaultValue` | — | ❌ 无法映射 | eview TextArea 无 defaultValue；用受控 `value` + `onChange` |
| `placeholder` | `placeholder` | 直接改名 | |
| `onChange(e)` | `onChange(targetValue, value, event)` | 综合映射 | 签名不同：antd 第一参 event；eview 第一参是新值（见 2.1） |
| `onPressEnter(e)` | `onKeyDown` | 综合映射 | eview 无回车专用回调；用 `onKeyDown` 判断 Enter（见 2.2） |
| `maxLength` | `maxLength` | 直接改名 | eview 会在右下角自动显示 n/maxLength 字数统计 |
| `autoSize` | `rows` + `inputStyle` | 综合映射 | antd `true`/`{minRows,maxRows}`；eview 用 `rows` 固定行数 + `inputStyle={{ resize }}` 控制拉伸（见 2.3） |
| `showCount` / `count`（CountConfig） | `maxLength` + `maxLengthCut` + `maxLengthByte` + `encodingType` | 综合映射 | eview `maxLength` 自带字数统计；`count.strategy`/`count.max`/`count.exceedFormatter` 部分对应（见 2.4） |
| `status="error"/"warning"` | `validator` + `hintType` | 综合映射 | antd 直接设校验状态；eview 用 `validator` 返回 `{result, message}` + `hintType="tip"`（见 2.5） |
| `disabled` | `disabled` | 直接改名 | |
| `id` | `id` | 直接改名 | |
| `classNames` / `styles` | `inputStyle` / `inputClassName` + `labelStyle` / `labelClassName` | 综合映射 | antd 语义化结构 class/style；eview 分输入框与 label（见 2.6） |
| `variant` | — | ❌ 无法映射 | eview 无形态变体（outlined/borderless/filled/underlined） |
| `size="large"/"middle"/"small"` | — | ❌ 无法映射 | eview TextArea 无尺寸档；用 `inputStyle` 字号/行高近似 |
| `allowClear` | — | ❌ 无法映射 | eview 无清除按钮（见 3.1） |
| `onClear` | — | ❌ 无法映射 | eview 无清除回调 |
| `addonAfter` / `addonBefore` | — | ❌ 无法映射 | 已废弃；TextArea 不适用，用外层布局 |
| `prefix` / `suffix` | — | ❌ 无法映射 | TextArea 不适用前/后缀图标 |
| `bordered` | — | ❌ 无法映射 | 已废弃，用 `variant`；eview 无对应 |
| `type` | — | ❌ 无法映射 | TextArea 不适用（原生 textarea 无 type） |
| — | `label` / `labelPosition` | eview 特有 | 名称 / 名称位置（before/after） |
| — | `required` | eview 特有 | 必填标记（label 前加 *） |
| — | `validator` / `validateWhileEmpty` | eview 特有 | 自定义校验，返回 `{ result, message, type? }` |
| — | `hintType` / `ruleText` / `focusTip` | eview 特有 | 提示形式（div/tip）/ 规则提示 / 聚焦提示 |
| — | `rows` / `cols` | eview 特有 | 显示行/列数 |
| — | `readOnly` | eview 特有 | 只读 |
| — | `onBlur` / `onFocus` / `onKeyDown` / `onKeyUp` / `onClick` | eview 特有 | 均只给 `event`（onBlur 无第二参 value） |
| — | `inputStyle` / `inputClassName` | eview 特有 | textarea 样式，如 `{ resize: 'both' }` |
| — | `labelStyle` / `labelClassName` / `style` / `className` | eview 特有 | 常规透传 |
| — | `maxLengthCut` / `maxLengthByte` / `encodingType` | eview 特有 | 超长截取 / 按字节计 / 编码 |
| — | `sizeAuto` | eview 特有 | 表内无说明 |

## 2. 处理方式详解

### 2.1 `onChange(e)` → `onChange(targetValue, value, event)`（综合映射）

**签名差异最关键**：antd 第一参是 event，取值用 `e.target.value`；eview 第一参就是新值。

```jsx
// antd
<TextArea value={remark} onChange={(e) => setRemark(e.target.value)} />

// eview —— 第一参是新值
<TextArea value={remark} onChange={(targetValue, value, event) => setRemark(targetValue)} />
// 第二参 value 通常是旧值或同 targetValue；第三参 event 可忽略
```

注：eview `onBlur(event)` / `onFocus(event)` / `onKeyDown(event)` / `onKeyUp(event)` 均只给 event，不像 TextField 的 `onBlur(event, value)` 有第二参。要值用 state。

### 2.2 `onPressEnter` → `onKeyDown`（综合映射）

```jsx
// antd
<TextArea onPressEnter={(e) => submit()} />

// eview
<TextArea onKeyDown={(event) => {
  if (event.key === 'Enter' && !event.shiftKey) submit();  // Shift+Enter 换行
}} />
```

### 2.3 `autoSize` → `rows` + `inputStyle`（综合映射）

antd `autoSize` 自适应高度（`true`/`{minRows,maxRows}`）；eview 用 `rows` 固定显示行数 + `inputStyle={{ resize }}` 控制是否可拉伸。

```jsx
// antd —— 自适应，最少 2 行最多 6 行
<TextArea autoSize={{ minRows: 2, maxRows: 6 }} />

// eview —— 固定行数 + 可拉伸
<TextArea rows={4} inputStyle={{ resize: 'vertical', minHeight: 64, maxHeight: 200 }} />
// autoSize=true（纯自适应）→ inputStyle={{ resize: 'vertical' }}，min/maxHeight 自定
// autoSize=false（不可拉伸）→ inputStyle={{ resize: 'none' }}
```

注：eview 无真正「按内容自动增高」能力，`minRows/maxRows` 需用 CSS `minHeight/maxHeight` 近似。

### 2.4 `showCount` / `count` → `maxLength` 自带字数（综合映射）

eview `maxLength` 在右下角自动显示 `n/maxLength`，无需 `showCount`。`count` 的 `strategy`（自定义计数）/`max`（标红不截断）/`exceedFormatter` 部分对应。

```jsx
// antd
<TextArea showCount maxLength={200} count={{ max: 500, strategy: (v) => v.length, show: true }} />

// eview —— maxLength 自带 n/200 显示
<TextArea maxLength={200} />
// count.max（标红不截断）→ maxLengthCut={false} + 自定义校验
// count.strategy（自定义计数，如 emoji 算 1）→ 无对应，业务侧自行提示
// 按字节计数 → maxLengthByte + encodingType="utf-8"
<TextArea maxLength={500} maxLengthByte encodingType="utf-8" />
```

### 2.5 `status` → `validator` + `hintType`（综合映射）

antd 直接设 `status="error"/"warning"`；eview 用 `validator` 返回 `{ result, message }`，`result: true` 通过，配 `hintType="tip"`。

```jsx
// antd
<TextArea status="error" />

// eview
<TextArea
  validator={(value) => ({
    result: value.trim().length >= 10,
    message: '至少 10 个字',
  })}
  hintType="tip"
  ruleText="10-200 字"
/>
// status="warning" 无独立对应，用 validator message + 不同 message 文案区分
```

### 2.6 `classNames` / `styles` → `inputStyle` / `inputClassName` + `labelStyle` / `labelClassName`（综合映射）

```jsx
// antd
<TextTextArea
  styles={{ textarea: { resize: 'none' } }}
  classNames={{ textarea: 'my-area' }}
/>

// eview
<TextArea inputStyle={{ resize: 'none' }} inputClassName="my-area" />
// label 样式：labelStyle / labelClassName
```

## 3. 无法映射的属性与建议处理

### 3.1 `allowClear` / `onClear`（清除按钮）

eview TextArea 无清除按钮。用 `value` + `onChange` 自管，或外部放清除按钮。

```jsx
// antd
<TextArea allowClear onClear={() => setRemark('')} value={remark} onChange={(e) => setRemark(e.target.value)} />

// eview —— 外部清除按钮
<div style={{ position: 'relative' }}>
  <TextArea value={remark} onChange={(v) => setRemark(v)} />
  {remark && <Button size="small" status="text" text="清空" onClick={() => setRemark('')} style={{ position: 'absolute', right: 8, bottom: 4 }} />}
</div>
```

### 3.2 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用受控 `value` + `onChange` |
| `allowClear` / `onClear` | 外部清除按钮 + `value` 清空 |
| `variant` | 无形态变体；用 `inputStyle` 自定义边框 |
| `size` | `inputStyle` 字号/行高近似 |
| `addonAfter` / `addonBefore` / `prefix` / `suffix` | 外层布局包裹 |
| `bordered` | 已废弃，用 `inputStyle` 边框 |
| `type` | TextArea 不适用 |
| `count.strategy` / `count.exceedFormatter` | 业务侧自行提示；超长截取用 `maxLengthCut` |

## 4. 完整示例对照

```jsx
// antd —— 带字数统计 + 自适应 + 校验的描述框
<TextArea
  value={remark}
  onChange={(e) => setRemark(e.target.value)}
  onPressEnter={submit}
  showCount
  maxLength={200}
  autoSize={{ minRows: 3, maxRows: 6 }}
  status={remark.length > 200 ? 'error' : undefined}
  placeholder="请输入描述"
  disabled={readOnly}
/>

// eview 等价
<TextArea
  label="描述"
  value={remark}
  onChange={(targetValue) => setRemark(targetValue)}
  onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) submit(); }}
  maxLength={200}                                 // 自动显示 n/200 字数统计（showCount 自带）
  rows={3}
  inputStyle={{ resize: 'vertical', minHeight: 72, maxHeight: 160 }}  // autoSize 近似
  validator={(value) => ({
    result: value.length <= 200,                  // status="error" → validator
    message: '不能超过 200 字',
  })}
  hintType="tip"
  placeholder="请输入描述"
  disabled={readOnly}
/>
```
