# InputNumber → Spinner 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `InputNumber` ⇄ eview `Spinner`
- 定位差异：两者都是「带加减按钮的数值输入框」，都有 `min` / `max` / `step` / `precision`。但 eview `Spinner` 的有效值与无效值分流——`onChange` 只在**有效值**（合法范围 / 合法格式）时触发，超范围或非数字走 `onInputError`，失焦自动修正回合法值；antd `onChange` 无论值是否越界都会触发，越界只标红不修正。eview 还内置 `label` / `required` / `hintType` / `rangeArray`（离散区间）/ `minMaxCycle`（循环）/ `type="time"`（时:分:秒）等 antd 没有的能力。eview **没有** `addonAfter` / `addonBefore` / `controls` / `formatter` / `parser` / `prefix` / `suffix` / `keyboard` / `decimalSeparator` / `stringMode` / `variant` / `status`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `addonAfter` | — | ❌ 无法映射 | 已废弃，antd 建议用 `Space.Compact`；eview 无前后置标签 |
| `addonBefore` | — | ❌ 无法映射 | 同上 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus 属性，用 `ref.focus()` 命令式聚焦（见 3.1） |
| `changeOnBlur` | `disabledBlurFunction` | 改值 | antd 默认 `true`（失焦触发 onChange / 修正），eview 默认也失焦修正；antd `false` → eview `disabledBlurFunction={true}` 禁用失焦修正 |
| `changeOnWheel` | — | ❌ 无法映射 | eview 不支持滚轮改值，忽略 |
| `controls` | — | ❌ 无法映射 | eview 加减按钮固定显示，无法隐藏；`controls={false}` 无对应（见 3.2） |
| `decimalSeparator` | — | ❌ 无法映射 | eview 小数点固定为 `.`，不支持自定义分隔符；可在 `onChange` 后自行格式化展示 |
| `placeholder` | — | ❌ 无法映射 | eview Spinner 无 placeholder（数值框有默认值 0） |
| `defaultValue` | — | ❌ 无法映射 | eview 仅受控 `value`；用 `useState` 初始值近似（见 3.3） |
| `disabled` | `disabled` | 直接改名 | |
| `formatter` | — | ❌ 无法映射 | eview 无展示格式化，靠外部文案 / `customPrefix` 近似（见 3.4） |
| `keyboard` | — | ❌ 无法映射 | eview 键盘行为固定开启，无法关闭 |
| `max` | `max` | 直接改名 | |
| `min` | `min` | 直接改名 | |
| `parser` | — | ❌ 无法映射 | 配合 `formatter` 使用，eview 无；靠 `isCharacterAllowed` 近似 |
| `precision` | `precision` | 直接改名 | |
| `readOnly` | — | ❌ 无法映射 | eview Spinner 无 readOnly；用 `disabled` 近似（视觉差异：灰化） |
| `status` | `onInputError` + `hintType` | 综合映射 | `'error'` / `'warning'` → 用 `onInputError` 回调展示错误 + `hintType`（见 2.1） |
| `prefix` | `customPrefix` / 外层布局 | 综合映射 | eview `customPrefix` 是自定义前缀型（配合 `type="customWithPrefixs"`），或外层布局近似（见 2.2） |
| `suffix` | — | ❌ 无法映射 | eview 无后缀，自行外层布局放单位文案 |
| `size` | — | ❌ 无法映射 | eview 无 size，靠 `style` / `inputClassName` 近似 |
| `step` | `step` | 直接改名 | |
| `stringMode` | — | ❌ 无法映射 | eview 无高精度字符串模式；`onChange` 已可返回 `string`（时间型）或 `number` |
| `value` | `value` | 直接改名 | eview 默认 `0`；时间型为字符串 |
| `variant` | — | ❌ 无法映射 | eview 无形态变体，靠 `style` 自定义 |
| `onChange(value)` | `onChange(value)` | 改名 + 签名调整 | antd 参数 `number \| string \| null`；eview 仅在**有效值**时触发，无效值走 `onInputError`（见 2.3） |
| `onPressEnter(e)` | `onPressEnter(value)` | 改名 + 签名调整 | antd 传 event，eview 传当前值（见 2.4） |
| `onStep(value, info)` | — | ❌ 无法映射 | eview 无上下箭头点击回调；加减变化统一走 `onChange` |
| — | `label` / `labelPosition` | eview 特有 | 内置标签 |
| — | `required` | eview 特有 | 内置必填 + 非空校验 |
| — | `onInputError(value)` | eview 特有 | 无效值（超范围 / 非数字）回调 |
| — | `onBlur(value)` | eview 特有 | 失焦回调，参数是修正后的值（非 event） |
| — | `rangeArray` | eview 特有 | 离散合法区间，如 `[[1,3],[6,9]]` |
| — | `minMaxCycle` | eview 特有 | 到边界后循环 |
| — | `doNotFocusWhenValueUpdate` | eview 特有 | 外部改值时不抢焦点（默认会抢） |
| — | `type="time"` / `timeFormat` / `amPm` / `locale` | eview 特有 | 时间型（hh:mm:ss） |
| — | `hintType` / `focusTip` / `tipStyle` / `noZeroPrecise` | eview 特有 | 提示相关 |
| — | `ref.getValue()` | eview 特有 | 命令式取值 |

## 2. 处理方式详解

### 2.1 `status` → `onInputError` + `hintType`（综合映射）

antd 用 `status='error' | 'warning'` 手动标红；eview 的错误来源是范围 / 格式校验，超范围自动触发 `onInputError`。若需外部一次性置错（如服务端校验），用外部文案展示：

```jsx
// antd：手动置错
<InputNumber status="error" min={0} max={10} value={n} onChange={setN} />

// eview：超范围自动走 onInputError，业务侧展示错误
const [n, setN] = useState(3);
const [err, setErr] = useState('');
<Spinner
  min={0}
  max={10}
  value={n}
  hintType="tip"
  onChange={(value) => { setN(value); setErr(''); }}
  onInputError={(value) => setErr(`"${value}" 超出 0-10`)}
/>
{err ? <div style={{ color: '#f43146' }}>{err}</div> : null}
```

### 2.2 `prefix` → `customPrefix` / 外层布局（综合映射）

eview `customPrefix` 配合 `type="customWithPrefixs"` 是「自定义前缀型」Spinner（如 `+86` 前缀的号码输入），与 antd `prefix` 图标语义不完全一致。简单图标前缀用外层布局近似：

```jsx
// antd
<InputNumber prefix={<DollarOutlined />} min={0} value={price} onChange={setPrice} />

// eview：外层布局近似
<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
  <IconPlusIcPublicMoney />
  <Spinner min={0} value={price} onChange={(v) => setPrice(v)} />
</div>

// 或用 customPrefix（前缀作为类型的一部分，语义不同）
<Spinner type="customWithPrefixs" customPrefix="$" value={price} onChange={(v) => setPrice(v)} />
```

### 2.3 `onChange` 签名与有效值分流

```jsx
// antd：onChange(value: number | string | null)，越界也会触发
<InputNumber min={0} max={10} value={n} onChange={(v) => setN(v)} />

// eview：onChange(value) 只在有效值时触发；无效值走 onInputError
<Spinner
  min={0}
  max={10}
  value={n}
  doNotFocusWhenValueUpdate            // 外部 setN 时不抢焦点
  onChange={(value: number) => setN(value)}
  onInputError={(value) => console.warn('无效值', value)}
/>
```

> ⚠️ eview 受控时 `value` 从外部更新默认会抢焦点，程序化改值（重置 / 联动）务必加 `doNotFocusWhenValueUpdate`。

### 2.4 `onPressEnter` 签名调整

```jsx
// antd：onPressEnter(event)
<InputNumber onPressEnter={(e) => submit()} />

// eview：onPressEnter(value)
<Spinner onPressEnter={(value) => submit(value)} />
```

## 3. 无法映射的属性与建议处理

### 3.1 `autoFocus`（自动聚焦）

eview 无 `autoFocus` 属性，用 `ref.focus()` 命令式聚焦：

```jsx
// antd
<InputNumber autoFocus min={0} />

// eview
const ref = useRef<any>(null);
useEffect(() => { ref.current?.focus(); }, []);
<Spinner ref={ref} min={0} />
```

### 3.2 `controls={false}`（隐藏加减按钮）

eview 加减按钮固定显示，无法隐藏。若只需纯数值输入无加减，改用 `TextField format="number"`：

```jsx
// antd
<InputNumber controls={false} min={0} value={n} onChange={setN} />

// eview：改用 TextField（无加减按钮）
<TextField format="number" value={String(n)} onChange={(v) => setN(Number(v))} />
```

### 3.3 `defaultValue`（非受控初始值）

```jsx
// antd
<InputNumber defaultValue={5} min={0} />

// eview
const [n, setN] = useState(5);
<Spinner min={0} value={n} onChange={(v) => setN(v)} />
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `formatter` / `parser` | 在 `onChange` 后自行格式化展示，或用 `customPrefix` 表达前缀单位；百分比可存原值、外部展示 `${v}%` |
| `decimalSeparator` | 小数点固定 `.`，如需 `,` 在外部文案格式化 |
| `prefix` | 外层布局（见 2.2） |
| `suffix` | 外层布局放单位文案 |
| `size` | `style` / `inputClassName` 近似 |
| `variant` | `style` 自定义 |
| `readOnly` | `disabled` 近似（会灰化） |
| `keyboard` | 固定开启，忽略 |
| `changeOnWheel` | 不支持滚轮改值，忽略 |
| `placeholder` | Spinner 有默认值 0，无占位；如需空态用 `TextField format="number"` |
| `stringMode` | 时间型 `onChange` 已返回 string；高精度场景 eview 不支持 |
| `onStep` | 加减变化统一走 `onChange`，无法单独监听箭头点击 |

## 4. 完整示例对照

```jsx
// antd
<InputNumber
  min={0}
  max={10}
  step={1}
  precision={0}
  disabled={false}
  size="middle"
  prefix={<UserOutlined />}
  formatter={(v) => `${v} 次`}
  value={retry}
  onChange={(v) => setRetry(v)}
  onPressEnter={(e) => submit()}
/>

// eview 等价
const [retry, setRetry] = useState(3);
const [retryErr, setRetryErr] = useState('');
<Spinner
  label="重试次数"                    // label 内置
  min={0}
  max={10}
  step={1}
  precision={0}
  value={retry}
  required                            // 若原 Form.Item required
  hintType="tip"
  doNotFocusWhenValueUpdate           // 外部改值不抢焦点
  onChange={(value: number) => { setRetry(value); setRetryErr(''); }}
  onInputError={(value) => setRetryErr(`"${value}" 超出 0-10`)}   // status=error 近似
  onPressEnter={(value) => submit()}  // onPressEnter(value)
/>
{retryErr ? <div style={{ color: '#f43146' }}>{retryErr}</div> : null}
// prefix 图标 + formatter "次" 单位用外层布局近似：
// <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//   <IconPlusIcPublicUser /><Spinner ... /><span>次</span>
// </div>
```
