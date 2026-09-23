# AutoComplete → InputSelect 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `AutoComplete` ⇄ eview `InputSelect`
- 定位差异：两者都是「可输入 + 下拉提示」。但 antd `AutoComplete` 本质是带提示的文本输入框，用户可自由输入、options 仅作辅助；eview `InputSelect` 是「可输入的 Select」，由 **`onlySelect`** 决定输入的文字只用于过滤（失焦清空）还是可作为值保留。迁移 antd `AutoComplete` 时默认应**不传 `onlySelect`**（保持自由输入语义）。此外 eview `InputSelect` 没有 `variant` / `status` / `backfill` / `filterOption` / `getPopupContainer` 等细控能力，过滤逻辑由组件内部固定实现。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `options` | `options` | 综合映射 | 字段名不同：antd `{ label, value }` → eview `{ text, value }`（见 2.1） |
| `value` | `value` | 直接改名 | 均为受控值；eview 还支持 `selectedIndex` |
| `defaultValue` | `value` | 综合映射 | antd 非受控 → eview 无非受控，需改为受控 `value`（见 2.2） |
| `placeholder` | `placeholder` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `allowClear` | `enableClear` | 改名 | 布尔一致；eview 无对象形式 |
| `onClear` | `onClear` | 直接改名 | |
| `onChange` | `onChange` | 改名 + 签名调整 | antd `onChange(value)`；eview `onChange(value, oldValue)`，多第二参可忽略（见 2.3） |
| `onSelect` | `onSelect` | 改名 + 签名调整 | antd `(value, option)`；eview `(value, oldValue)`（见 2.3） |
| `onSearch` | — | ❌ 无法映射 | eview 过滤逻辑内部固定，无搜索回调；可用 `onInputKeyUp` 近似（见 3.1） |
| `onBlur` | — | ❌ 无法映射 | eview InputSelect API 无 onBlur |
| `onFocus` | — | ❌ 无法映射 | eview 无 onFocus 回调，可用 `ref.focus()` 命令式聚焦 |
| `onInputKeyDown` | — | ❌ 无法映射 | eview 有 `onInputEnter` / `onInputKeyUp`，时机不同（见 3.2） |
| `onOpenChange` / `onDropdownVisibleChange` | `onOpenPopup` / `onClosePopup` | 综合映射 | antd 单回调 `(open)` → eview 分展开 / 关闭两个回调（见 2.4） |
| `virtual` | `virtualScroll` | 改名 | 语义一致，> 100 项生效 |
| `notFoundContent` | `showSearchTip` | 综合映射 | antd 自定义空内容 ReactNode → eview 布尔开关（固定显示 "Not Found"）（见 2.5） |
| `filterOption` | `caseInsensitiveFilter` / `searchTrim` | 综合映射 | antd 自定义过滤函数 → eview 布尔配置项，无法等价（见 2.6） |
| `popupMatchSelectWidth` | — | ❌ 无法映射 | eview 无同宽配置；可用 `enableFixWidth` 近似（见 3.3） |
| `open` | — | ❌ 无法映射 | eview 无受控展开属性，仅事件回调 |
| `defaultOpen` | — | ❌ 无法映射 | 同上 |
| `status` | — | ❌ 无法映射 | eview 无 error/warning 校验状态，用 `required` + `validator` + `hintType` 表达（见 3.4） |
| `size` | — | ❌ 无法映射 | eview 无 large/middle/small |
| `variant` | — | ❌ 无法映射 | eview 无形态变体 |
| `popupRender` / `dropdownRender` | — | ❌ 无法映射 | eview 无自定义下拉内容 |
| `popupClassName` / `dropdownClassName` | — | ❌ 无法映射 | 改用 `selectStyle` / `optionStyle` 透传 |
| `dropdownStyle` | — | ❌ 无法映射 | 改用 `selectStyle` |
| `getPopupContainer` | — | ❌ 无法映射 | eview 用 `popupDirection` 控制方向，非容器 |
| `classNames` / `styles` | — | ❌ 无法映射 | 改用 `selectStyle` / `selectClassName` / `optionStyle` |
| `backfill` | — | ❌ 无法映射 | eview 无键盘回填 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus，用 `ref.focus()` 在 mount 时调用 |
| `defaultActiveFirstOption` | — | ❌ 无法映射 | eview 无默认高亮首项配置 |
| `children` | — | ❌ 无法映射 | eview 无自定义输入框，固定渲染 |
| `blur()` / `focus()` | `ref.focus()` / `ref.clear()` | 综合映射 | eview 有 `focus()`，无 `blur()`（见 2.7） |
| — | `onlySelect` | eview 特有 | 默认 `false`，对应 antd AutoComplete「可自由输入」语义；迁移时**不传**此属性 |
| — | `onlySelectLastValue` | eview 特有 | 表内无说明 |
| — | `label` / `labelPosition` | eview 特有 | antd 用 children 包标签，eview 用 `label` |
| — | `required` / `validator` / `hintType` | eview 特有 | 校验 |
| — | `caseInsensitiveFilter` / `searchTrim` / `keepFiter` | eview 特有 | 过滤配置 |
| — | `onInputEnter` / `onInputKeyUp` | eview 特有 | 输入框回车 / 键抬起 |
| — | `popupDirection` / `zindex` / `popUpProps` | eview 特有 | 下拉层 |
| — | `inputProps` / `enableFixWidth` / `selectStyle` / `optionStyle` | eview 特有 | 样式与原生属性透传 |
| — | `ref.getValue()` / `ref.validate()` / `ref.clear()` | eview 特有 | 命令式方法 |

## 2. 处理方式详解

### 2.1 `options` 字段名映射（综合映射）

antd 选项用 `label` 显示，eview InputSelect 用 `text` 显示（**注意与 Cascader 不同**）。

```js
// antd options → eview options
function toEviewOptions(antdOptions) {
  return antdOptions.map((o) => ({ text: o.label, value: o.value }));
}
```

```jsx
// antd
<AutoComplete options={[{ label: '北京', value: 'bj' }]} />

// eview
<InputSelect options={[{ text: '北京', value: 'bj' }]} />
```

### 2.2 `defaultValue` → `value`（综合映射）

eview InputSelect 无非受控 `defaultValue`，需改为受控 `value` + `onChange`。

```jsx
// antd
<AutoComplete defaultValue="bj" options={opts} />

// eview
const [v, setV] = useState('bj');
<InputSelect value={v} options={opts} onChange={(value) => setV(value)} />
```

### 2.3 `onChange` / `onSelect` 签名调整

```jsx
// antd onChange(value)
<AutoComplete onChange={(value) => setV(value)} />

// eview onChange(value, oldValue)
<InputSelect onChange={(value, oldValue) => setV(value)} />
// 第二参 oldValue 可忽略

// antd onSelect(value, option)
<AutoComplete onSelect={(value, option) => {}} />

// eview onSelect(value, oldValue)
<InputSelect onSelect={(value, oldValue) => {}} />
// 第二参为旧值，非 option 对象；如需选项数据，用 value 在 options 中查
```

### 2.4 `onOpenChange` → `onOpenPopup` / `onClosePopup`（综合映射）

antd 单回调传 `open` 布尔；eview 拆为展开 / 关闭两个回调。

```jsx
// antd
<AutoComplete onOpenChange={(open) => console.log(open)} />

// eview
<InputSelect
  onOpenPopup={() => console.log(true)}
  onClosePopup={() => console.log(false)}
/>
```

### 2.5 `notFoundContent` → `showSearchTip`（综合映射）

antd 可自定义空内容 ReactNode；eview 仅布尔开关，固定显示 "Not Found"。

```jsx
// antd
<AutoComplete notFoundContent="无匹配项" />

// eview：只能开关，不能改文案
<InputSelect showSearchTip />
// 自定义文案需改造组件内部，或用 children 覆盖（不支持）
```

### 2.6 `filterOption` → 布尔配置项（综合映射，有损）

antd `filterOption` 支持自定义过滤函数 `(inputValue, option) => boolean`；eview 用 `caseInsensitiveFilter` / `searchTrim` / `keepFiter` 三个布尔开关，**无法等价**自定义逻辑。

```jsx
// antd：自定义过滤
<AutoComplete filterOption={(input, option) => option.value.startsWith(input)} />

// eview：仅能配置大小写忽略 / 去空格
<InputSelect caseInsensitiveFilter searchTrim />
// 自定义过滤逻辑丢失，用 onlySelect + 后端过滤近似
```

### 2.7 `blur()` / `focus()` → `ref` 方法（综合映射）

eview 有 `ref.focus()` 与 `ref.clear()`，无 `blur()`。

```jsx
// antd
const ref = useRef();
ref.current.focus();
ref.current.blur();

// eview
const ref = useRef();
ref.current.focus();
ref.current.clear();    // 替代 blur 近似（清空内容）
// 无 blur，失焦需点击外部
```

## 3. 无法映射的属性与建议处理

### 3.1 `onSearch`（搜索回调）

eview 过滤逻辑内部固定，无搜索回调。可用 `onInputKeyUp` 近似监听输入：

```jsx
// antd
<AutoComplete onSearch={(value) => fetchSuggestions(value)} />

// eview 近似
<InputSelect
  onInputKeyUp={(value) => fetchSuggestions(value)}
  options={suggestions}
/>
// 注意：eview 也会对 options 内部过滤，后端搜索需配合 options 更新
```

### 3.2 `onInputKeyDown`（按键回调）

eview 有 `onInputEnter`（回车）与 `onInputKeyUp`（键抬起），时机不同：

```jsx
// antd
<AutoComplete onInputKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />

// eview
<InputSelect onInputEnter={(e, value) => submit(value)} />
```

### 3.3 `popupMatchSelectWidth`（同宽）

eview 无同宽配置，可用 `enableFixWidth` 近似：

```jsx
// antd
<AutoComplete popupMatchSelectWidth />

// eview 近似
<InputSelect enableFixWidth />
```

### 3.4 `status`（校验状态）

eview 无 error/warning 状态，用 `required` + `validator` + `hintType` 表达校验失败：

```jsx
// antd
<AutoComplete status="error" />

// eview
<InputSelect
  required
  validator={(value) => ({ result: !!(value), message: '请选择或输入' })}
  hintType="tip"
/>
```

### 3.5 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `open` / `defaultOpen` | eview 无受控展开，仅 `onOpenPopup` / `onClosePopup` 事件 |
| `size` | 外层 `style` 控宽 |
| `variant` | 无形态变体，忽略 |
| `popupRender` / `dropdownRender` | 无自定义下拉内容 |
| `popupClassName` / `dropdownClassName` | `selectClassName` / `optionStyle.className` |
| `dropdownStyle` | `selectStyle` |
| `getPopupContainer` | `popupDirection` 控方向 |
| `classNames` / `styles` | `selectStyle` / `selectClassName` / `optionStyle` |
| `backfill` | 无键盘回填，忽略 |
| `autoFocus` | `useEffect(() => ref.current.focus(), [])` |
| `defaultActiveFirstOption` | 无配置，忽略 |
| `children`（自定义输入框） | 无自定义输入框，固定渲染 |

## 4. 完整示例对照

```jsx
// antd
<AutoComplete
  options={[{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }]}
  value={city}
  placeholder="请输入城市"
  allowClear
  filterOption={(input, option) => option.label.includes(input)}
  onChange={(value) => setCity(value)}
  onSearch={(value) => fetchSuggestions(value)}
/>

// eview 等价
<InputSelect
  options={[{ text: '北京', value: 'bj' }, { text: '上海', value: 'sh' }]}  // label → text
  value={city}
  placeholder="请输入城市"
  enableClear                                 // allowClear → enableClear
  caseInsensitiveFilter                       // filterOption 近似（丢失自定义逻辑）
  onChange={(value) => setCity(value)}       // 签名兼容
  onInputKeyUp={(value) => fetchSuggestions(value)}  // onSearch 近似
  // 不传 onlySelect —— 保持 antd AutoComplete 自由输入语义
/>
```
