# Select → Select 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Select`（单选模式） ⇄ eview `Select`
- 定位差异：两者都是「下拉单选」选择器，`options` 数组驱动。但 eview Select 的选项字段是 `text`/`value`（不是 antd 的 `label`/`value`），且不支持 `mode`/`showSearch`/`labelInValue` 等能力——多选场景请用 `MultipleSelect`（见 MultipleSelect.md），可输入搜索请用 `InputSelect`。eview Select 还内置 `required`/`validator`/`enableClear` 校验与清空能力，antd 需借助 Form 实现。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `options` | `options` | 综合映射 | 字段名不同：antd `{ label, value }` → eview `{ text, value }`（见 2.1） |
| `value` | `value` | 直接改名 | 均为受控选中值；eview 可传 `null` 表示未选 |
| `defaultValue` | — | ❌ 无法映射 | eview 无默认值属性，改用 `value` 受控初始化 |
| `placeholder` | `defaultLabel` | 改名 | antd 占位文案 → eview `defaultLabel`（官方注明后续会改名 placeholder） |
| `disabled` | `disabled` | 直接改名 | |
| `allowClear` | `enableClear` | 改名 | antd `allowClear` → eview `enableClear`；eview 仅 boolean |
| `autoClearSearchValue` | — | ❌ 无法映射 | 多选/标签模式属性，单选不涉及；见 MultipleSelect.md |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus，用 `ref.focus()` 命令式聚焦（见 3.1） |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，改用 `selectClassName`/`optionClassName` |
| `styles` | — | ❌ 无法映射 | eview 无语义化结构 style，改用 `selectStyle`/`optionStyle` |
| `defaultActiveFirstOption` | — | ❌ 无法映射 | eview 无此选项 |
| `defaultOpen` | — | ❌ 无法映射 | eview 无默认展开，改用 `onDropdownVisibleChange` + 状态受控 |
| `popupClassName` | `selectClassName` | 改名 | 已废弃属性；下拉框 className 近似用 `selectClassName` |
| `popupMatchSelectWidth` | — | ❌ 无法映射 | eview 下拉宽度固定，忽略 |
| `popupRender` | — | ❌ 无法映射 | eview 无自定义下拉内容渲染 |
| `dropdownRender` | — | ❌ 无法映射 | 已废弃，同 `popupRender` |
| `dropdownStyle` | `selectStyle` | 改名 | 已废弃属性，近似用 `selectStyle` |
| `fieldNames` | — | ❌ 无法映射 | eview 字段固定 `text`/`value`，需在数据层转换（见 2.1） |
| `filterOption` | — | ❌ 无法映射 | eview 单选 Select 无搜索过滤；可输入搜索改用 `InputSelect` |
| `filterSort` | — | ❌ 无法映射 | eview 无筛选排序 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 弹层位置由 `popupDirection` 控制 |
| `labelInValue` | — | ❌ 无法映射 | eview `onChange` 已把 value/text 分开返回，无需 labelInValue（见 2.2） |
| `listHeight` | — | ❌ 无法映射 | eview 用 `virtualScroll` 控制滚动，无高度参数 |
| `loading` | — | ❌ 无法映射 | eview Select 无内置 loading；外层包 `Loading type="local"`（见 3.2） |
| `maxCount` | — | ❌ 无法映射 | 多选模式属性；见 MultipleSelect.md |
| `maxTagCount` | — | ❌ 无法映射 | 多选模式属性 |
| `maxTagPlaceholder` | — | ❌ 无法映射 | 多选模式属性 |
| `maxTagTextLength` | — | ❌ 无法映射 | 多选模式属性 |
| `menuItemSelectedIcon` | — | ❌ 无法映射 | 多选模式属性 |
| `mode` | — | ❌ 无法映射 | 单选模式不设 mode；多选见 MultipleSelect.md |
| `notFoundContent` | — | ❌ 无法映射 | eview 无空列表文案属性 |
| `open` | — | ❌ 无法映射 | eview 用 `onDropdownVisibleChange` 受控，无直接 open 属性 |
| `optionFilterProp` | — | ❌ 无法映射 | 单选无搜索 |
| `optionLabelProp` | — | ❌ 无法映射 | eview 回填固定取 `text` |
| `optionRender` | — | ❌ 无法映射 | eview 选项结构固定，自定义用 `icon`/`iconActive` |
| `placement` | `popupDirection` | 改值 | antd 四向 → eview 两向（见 2.3） |
| `prefix` | — | ❌ 无法映射 | eview 无前缀属性 |
| `removeIcon` | — | ❌ 无法映射 | 多选模式属性 |
| `searchValue` | — | ❌ 无法映射 | 单选无搜索 |
| `showSearch` | — | ❌ 无法映射 | eview 单选 Select 不可搜索，改用 `InputSelect` |
| `size` | — | ❌ 无法映射 | eview Select 无尺寸属性 |
| `status` | — | ❌ 无法映射 | eview 用 `validator` + `hintType` 表达校验态（见 3.3） |
| `suffixIcon` | — | ❌ 无法映射 | eview 后缀图标固定 |
| `tagRender` | — | ❌ 无法映射 | 多选模式属性 |
| `labelRender` | — | ❌ 无法映射 | eview label 固定取 `text` |
| `tokenSeparators` | — | ❌ 无法映射 | tags 模式属性 |
| `variant` | — | ❌ 无法映射 | eview 无形态变体 |
| `virtual` | `virtualScroll` | 改名 | antd `virtual`（默认 true）→ eview `virtualScroll`（>100 项才生效） |
| `onBlur` | `onBlur` | 直接改名 | eview 签名 `(event) => void` |
| `onChange` | `onChange` | 综合映射 | 签名不同：antd `(value, option)` → eview `(value, oldValue, text, oldText, event)`（见 2.2） |
| `onClear` | — | ❌ 无法映射 | eview 清空靠 `enableClear` 内置，无独立回调 |
| `onDeselect` | — | ❌ 无法映射 | 多选模式属性 |
| `onDropdownVisibleChange` | `onDropdownVisibleChange` | 直接改名 | 展开/收起回调，签名一致 `(open) => void` |
| `onOpenChange` | `onDropdownVisibleChange` | 改名 | antd `onOpenChange` → eview `onDropdownVisibleChange` |
| `onFocus` | `onFocus` | 直接改名 | eview 签名 `(event) => void` |
| `onInputKeyDown` | — | ❌ 无法映射 | eview 无按键回调 |
| `onPopupScroll` | — | ❌ 无法映射 | eview 无滚动回调 |
| `onSearch` | — | ❌ 无法映射 | 单选无搜索 |
| `onSelect` | — | ❌ 无法映射 | eview 选中走 `onChange`，无独立 onSelect |
| — | `selectedIndex` | eview 特有 | 按 options 下标选中 |
| — | `defaultLabel` | eview 特有 | 未选中提示文案（对应 antd `placeholder`） |
| — | `label` / `labelPosition` | eview 特有 | 名称文字及位置（antd 用 Form.Item label） |
| — | `required` | eview 特有 | 必填标记 |
| — | `validator` | eview 特有 | 自定义校验 `{ result, message }` |
| — | `hintType` | eview 特有 | 错误提示形式 `'div' \| 'tip'` |
| — | `lazySearch` | eview 特有 | 分页懒加载建议列表 |
| — | `zindex` / `autoZindex` | eview 特有 | 弹层层级 |
| — | `ref.getValue()`/`validate()`/`focus()`/`clear()` | eview 特有 | 命令式方法 |

## 2. 处理方式详解

### 2.1 `options` 字段转换（综合映射）

antd 选项用 `{ label, value }`；eview 选项用 `{ text, value, icon?, iconActive?, tipData? }`。字段名 `label` → `text`，且 `text` 只支持字符串。

```js
function toEviewOptions(antdOptions) {
  return antdOptions.map((o) => ({
    text: typeof o.label === 'string' ? o.label : String(o.label),  // text 只支持字符串
    value: o.value,
    // icon / iconActive / tipData 按需补充
  }));
}
```

若 antd 用了 `fieldNames` 自定义字段，需在数据层统一转换为 `{ text, value }`。

### 2.2 `onChange` 签名转换（综合映射）

antd `onChange(value, option)`；eview `onChange(value, oldValue, text, oldText, event)`——前四个都是值，event 是第五个。

```jsx
// antd：onChange(value, option)
<Select onChange={(value, option) => setStatus(value)} />

// eview：onChange(value, oldValue, text, oldText, event)
<Select
  onChange={(value, oldValue, text, oldText, event) => {
    setStatus(value);        // 选中值
    // text 是选中项的显示文字，替代 labelInValue 的 label
  }}
/>
```

注：antd 的 `labelInValue` 让 value 变成 `{ value, label }`，eview 直接在 `onChange` 把 `value` 与 `text` 分开返回，无需该属性。

### 2.3 `placement` → `popupDirection`（改值）

antd 四向 placement 收敛为 eview 两向。

```js
function toPopupDirection(placement) {
  return placement?.startsWith('top') ? 'top' : 'bottom';  // bottomLeft/bottomRight → bottom
}
```

## 3. 无法映射的属性与建议处理

### 3.1 `autoFocus` → `ref.focus()`

eview 无 autoFocus 属性，用 ref 命令式聚焦。

```jsx
const selectRef = useRef(null);
useEffect(() => { selectRef.current?.focus(); }, []);
<Select ref={selectRef} options={opts} value={v} onChange={setV} />
```

### 3.2 `loading` → 外层 `Loading`

```jsx
import Loading from '@nce/eview-react/Loading';
<div style={{ position: 'relative' }}>
  <Select options={opts} value={v} onChange={setV} />
  <Loading type="local" isOpen={loading} />
</div>
```

### 3.3 `status="error"` → `validator` + `hintType`

```jsx
<Select
  ref={selectRef}
  required
  hintType="tip"
  validator={(value) => ({ result: value != null, message: '请选择' })}
  options={opts}
  value={v}
  onChange={setV}
/>
// 提交前：if (!selectRef.current.validate()) selectRef.current.focus();
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用 `value` 受控初始化 |
| `defaultOpen` | 用 `onDropdownVisibleChange` + 状态受控 |
| `defaultActiveFirstOption` | 忽略 |
| `classNames` / `styles` | `selectClassName` / `selectStyle` / `optionClassName` / `optionStyle` |
| `popupMatchSelectWidth` | 忽略 |
| `popupRender` / `dropdownRender` | 无对应，自定义内容需改用其他组件 |
| `fieldNames` | 数据层转换为 `text`/`value` |
| `filterOption` / `filterSort` / `optionFilterProp` / `searchValue` / `onSearch` / `showSearch` | 改用 `InputSelect` |
| `labelInValue` | 用 `onChange` 的 `text` 参数 |
| `listHeight` | 用 `virtualScroll` |
| `maxCount` / `maxTagCount` / `maxTagPlaceholder` / `maxTagTextLength` / `menuItemSelectedIcon` / `removeIcon` / `tagRender` / `onDeselect` / `mode` / `tokenSeparators` / `autoClearSearchValue` | 多选见 MultipleSelect.md |
| `notFoundContent` | 忽略 |
| `open` | `onDropdownVisibleChange` 受控 |
| `optionLabelProp` / `labelRender` | 忽略 |
| `optionRender` | 用 `icon`/`iconActive` |
| `prefix` | 忽略 |
| `size` | 忽略 |
| `suffixIcon` | 忽略 |
| `variant` | 忽略 |
| `onClear` | `enableClear` 内置处理 |
| `onInputKeyDown` / `onPopupScroll` | 忽略 |
| `onSelect` | 走 `onChange` |
| `getPopupContainer` | `popupDirection` 控制 |

## 4. 完整示例对照

```jsx
// antd
<Select
  showSearch
  allowClear
  placeholder="请选择状态"
  loading={fetching}
  optionFilterProp="label"
  options={[
    { label: '运行中', value: 'running' },
    { label: '已停止', value: 'stopped' },
  ]}
  value={status}
  onChange={(value, option) => setStatus(value)}
/>

// eview 等价（单选；搜索能力改用 InputSelect，此处去掉 showSearch）
import Loading from '@nce/eview-react/Loading';
const statusOptions = [
  { text: '运行中', value: 'running' },   // label → text
  { text: '已停止', value: 'stopped' },
];
<div style={{ position: 'relative' }}>
  <Select
    enableClear                       // allowClear → enableClear
    defaultLabel="请选择状态"           // placeholder → defaultLabel
    options={statusOptions}
    value={status}
    onChange={(value, oldValue, text, oldText, event) => setStatus(value)}  // 签名调整
  />
  <Loading type="local" isOpen={fetching} />  {/* loading → 外层 Loading */}
</div>
```

> 多选模式（`mode="multiple"` / `"tags"`）见 MultipleSelect.md。
