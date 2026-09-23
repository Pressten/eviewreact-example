# Select → MultipleSelect 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Select`（`mode="multiple"`）⇄ eview `MultipleSelect`
- 定位差异：两者都是「下拉多选」控件。但 eview MultipleSelect 是独立的多选组件（不是在单选 Select 上加 mode）。选项数据 antd 用 `{ label, value }`，eview 用 **`{ text, value, disabled? }`**（注意字段是 `text` 不是 `label`）。**`onChange` 签名差异关键：antd 回传 `(value, option)`，eview 回传 `(value[], changeValue[], event)`——第一参是全部选中值数组，第二参是本次勾上/取消的值。** 占位属性 antd 是 `placeholder`，eview 也是 `placeholder`（与单选 Select 的 `defaultLabel` 不同）。选项禁用字段 eview 是 `disabled`（不是 SelectCard 的 `disable`）。eview 还内置全选（`selectAll`）、搜索（`searchable`）、虚拟滚动（`virtualScroll`）与命令式校验（`ref.validate()`）。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `mode="multiple"` | `type`（隐式） | 综合映射 | antd 用 `mode` 切多选；eview MultipleSelect 本就是多选组件，无需 mode（见 2.1） |
| `options` | `options` | 综合映射 | 数据属性同名，但字段不同：`label→text`（见 2.2） |
| `value` | `value` | 直接改名 | eview `value` 是选中值数组（受控） |
| `defaultValue` | — | ❌ 无法映射 | eview 无默认值；用 `value` 受控初始化 |
| `onChange(value, option)` | `onChange(value[], changeValue[], event)` | 综合映射 | antd 回传 value + option；eview 回传全部选中 + 本次变化项 + event（见 2.3） |
| `onDeselect` / `onSelect` | `onChange` 第二参 | 综合映射 | antd 单独的选中/取消回调；eview 统一在 `onChange` 第二参 `changeValue`（见 2.3） |
| `allowClear` | `enableCloseIcon` | 改名 | antd 清除按钮；eview 已选项带关闭小图标 |
| `autoClearSearchValue` | — | ❌ 无法映射 | eview 无搜索框自动清空开关 |
| `placeholder` | `placeholder` | 直接改名 | 占位文本（与单选 Select 的 `defaultLabel` 不同） |
| `disabled` | `disabled` | 直接改名 | |
| `showSearch` | `searchable` | 改名 | antd `showSearch` → eview `searchable` |
| `searchValue` | `onSearchChange` | 综合映射 | antd 受控搜索值；eview 用 `onSearchChange` 回调监听（见 2.4） |
| `onSearch(value)` | `onSearchChange(value, options?)` | 改名 + 签名调整 | 搜索词变化回调 |
| `optionFilterProp` | — | ❌ 无法映射 | eview 搜索内部按 `text` 过滤，无字段配置 |
| `filterOption` | — | ❌ 无法映射 | eview 无自定义筛选函数 |
| `filterSort` | — | ❌ 无法映射 | eview 无筛选排序 |
| `virtual` | `virtualScroll` | 改名 | antd `virtual` → eview `virtualScroll`（> 100 项生效） |
| `listHeight` | `listHeight` | 直接改名 | 弹窗滚动高度 |
| `maxCount` | — | ❌ 无法映射 | eview 未暴露最大选中数量；用业务校验 |
| `maxTagCount` | `displayItems` | 改名 | antd 最多显示 tag 数；eview 输入框最多预览条数 |
| `maxTagPlaceholder` | — | ❌ 无法映射 | eview 无隐藏 tag 占位内容 |
| `maxTagTextLength` | — | ❌ 无法映射 | eview 无 tag 文本长度限制 |
| `tagRender` | — | ❌ 无法映射 | eview 无自定义 tag 渲染 |
| `labelRender` | — | ❌ 无法映射 | eview 无自定义 label 渲染 |
| `labelInValue` | — | ❌ 无法映射 | eview value 只支持基本类型数组 |
| `menuItemSelectedIcon` | — | ❌ 无法映射 | eview 无自定义选中图标 |
| `removeIcon` | — | ❌ 无法映射 | eview 无自定义清除图标 |
| `suffixIcon` | — | ❌ 无法映射 | eview 无自定义后缀图标 |
| `prefix` | — | ❌ 无法映射 | eview 无前缀 |
| `open` | `showPopUp` | 改名 | antd 受控展开；eview `showPopUp` |
| `defaultOpen` | — | ❌ 无法映射 | eview 无默认展开开关 |
| `onOpenChange` | `onOpenMultipleSelectPopup` | 改名 | 面板开合回调 |
| `onPopupScroll` | — | ❌ 无法映射 | eview 未暴露弹窗滚动回调 |
| `onInputKeyDown` | — | ❌ 无法映射 | eview 未暴露按键回调 |
| `onClear` | — | ❌ 无法映射 | eview 无独立清除回调；用 `enableCloseIcon` + `onChange` |
| `onFocus` / `onBlur` | `onFocus` / `onBlur` | 直接改名 | |
| `notFoundContent` | — | ❌ 无法映射 | eview 无空状态自定义 |
| `loading` | — | ❌ 无法映射 | eview 无加载态；业务自行用 disabled 表达 |
| `size` | — | ❌ 无法映射 | eview 未暴露 size；用 `inputStyle` 近似 |
| `status` | `required` / `hintType` | 综合映射 | antd 校验状态；eview 用 `required` + `hintType` 表达（见 2.5） |
| `variant` | — | ❌ 无法映射 | eview 无形态变体 |
| `placement` | `popupDirection` | 改名 | antd `placement`；eview `popupDirection`（`'top' | 'bottom'`） |
| `fieldNames` | — | ❌ 无法映射 | eview 字段固定 `text` / `value`，需先转数据 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 未暴露弹层父节点 |
| `popupMatchSelectWidth` | — | ❌ 无法映射 | eview 未暴露同宽配置 |
| `popupRender` | — | ❌ 无法映射 | eview 无自定义下拉内容 |
| `optionRender` | — | ❌ 无法映射 | eview 无自定义选项渲染 |
| `optionLabelProp` | — | ❌ 无法映射 | eview 回填固定用 `text` |
| `defaultActiveFirstOption` | — | ❌ 无法映射 | eview 无默认高亮 |
| `autoFocus` | `ref.focus()` | 综合映射 | antd `autoFocus`；eview 用 ref 命令式聚焦 |
| `classNames` / `styles` | `inputStyle` / `selectStyle` / `dropdownStyle` 等 | 综合映射 | eview 按区域分属性 |
| `mode="tags"` | — | ❌ 无法映射 | eview 无 tags 模式（无 tokenSeparators）；用 MultipleSelect 近似 |
| `tokenSeparators` | — | ❌ 无法映射 | eview 无自动分词 |
| — | `selectAll` / `selectAllText` | eview 特有 | 全选项（无 antd 对应） |
| — | `selectedIndex` | eview 特有 | 按下标选中；与 value 同传以 value 为准 |
| — | `label` / `labelPosition` | eview 特有 | 名称文字及位置 |
| — | `required` / `hintType` | eview 特有 | 必填 / 提示形式 |
| — | `displayItems` / `delimiter` | eview 特有 | 预览条数 / 分隔符 |
| — | `virtualScroll` / `smoothScroll` | eview 特有 | 虚拟滚动 / 平滑 |
| — | `popupDirection` / `zIndex` / `showPopUp` | eview 特有 | 弹层方向 / 层级 / 显隐 |
| — | `ref.getValue()` / `ref.validate()` / `ref.focus()` | eview 特有 | 命令式取值 / 校验 / 聚焦 |

### Option props 映射

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `label` | `text` | 直接改名 | 显示文本 |
| `value` | `value` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | 注意是 `disabled`（不是 SelectCard 的 `disable`） |
| `className` | — | ❌ 无法映射 | eview 无选项 class |
| `title` | — | ❌ 无法映射 | eview 无原生 title |

## 2. 处理方式详解

### 2.1 `mode="multiple"` → 独立组件（综合映射）

antd 用 `mode="multiple"` 把 Select 切到多选；eview 直接用 `MultipleSelect` 组件，无需 `mode`。

```jsx
// antd
<Select mode="multiple" options={opts} onChange={setVal} />

// eview
<MultipleSelect options={eviewOpts} onChange={(v) => setVal(v)} />
```

### 2.2 `options` 字段转换（综合映射）

antd 选项 `{ label, value }`，eview 是 `{ text, value, disabled? }`，需转 `label→text`。

```js
function toEviewOptions(antdOptions) {
  return antdOptions.map((o) => ({
    text: o.label,
    value: o.value,
    disabled: o.disabled,        // 注意：不是 disable
  }));
}
```

### 2.3 `onChange` 签名调整（综合映射）

**关键差异**：antd `onChange(value, option)` 回传选中 value + 选中项对象；eview `onChange(value[], changeValue[], event)` 回传三参——第一参是**当前全部选中值**，第二参是**本次勾上/取消的值**。ant 的 `onSelect` / `onDeselect` 统一合并到这里。

```jsx
// antd
<Select mode="multiple" options={opts}
  onChange={(value, option) => setSelected(value)}
  onSelect={(value) => console.log('选了', value)}
  onDeselect={(value) => console.log('取消了', value)}
/>

// eview
<MultipleSelect options={eviewOpts}
  onChange={(value, changeValue, event) => {
    setSelected(value);              // 第一参：全部选中
    // changeValue：本次勾上/取消的值（替代 onSelect/onDeselect）
  }}
/>
```

### 2.4 `searchValue` / `onSearch` → `searchable` + `onSearchChange`（综合映射）

ant 受控搜索用 `searchValue` + `onSearch`；eview 开启搜索用 `searchable`，监听变化用 `onSearchChange(value, options?)`。eview 无受控搜索值属性。

```jsx
// antd
<Select mode="multiple" showSearch searchValue={kw} onSearch={setKw} options={opts} />

// eview
<MultipleSelect searchable onSearchChange={(value) => setKw(value)} options={eviewOpts} />
```

### 2.5 `status` → `required` / `hintType`（综合映射）

antd 用 `status="error"/"warning"` 表达校验态；eview 用 `required`（必填）+ `hintType`（提示形式 `'div' | 'tip'`），命令式校验 `ref.validate()`。

```jsx
// antd
<Select mode="multiple" status="error" options={opts} />

// eview
<MultipleSelect
  ref={selectRef}
  required
  hintType="tip"
  options={eviewOpts}
  onChange={(v) => setVal(v)}
/>
// 提交前：
if (!selectRef.current.validate()) { selectRef.current.focus(); return; }
```

### 2.6 `maxTagCount` → `displayItems`（改值）

antd `maxTagCount` 限制显示 tag 数；eview `displayItems` 限制输入框预览条数。

```jsx
// antd
<Select mode="multiple" maxTagCount={3} options={opts} />

// eview
<MultipleSelect displayItems={3} options={eviewOpts} />
```

## 3. 无法映射的属性与建议处理

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用 `value` 受控初始化 |
| `mode="tags"` / `tokenSeparators` | eview 无 tags 模式，用 MultipleSelect 近似（丢失自动分词） |
| `maxCount` | 用业务校验 `onChange` 里判断长度 |
| `maxTagPlaceholder` / `maxTagTextLength` / `tagRender` / `labelRender` | 无自定义 tag/label 渲染，忽略 |
| `labelInValue` | value 只支持基本类型数组，需自行维护 label 映射 |
| `menuItemSelectedIcon` / `removeIcon` / `suffixIcon` / `prefix` | 无自定义图标，忽略 |
| `optionFilterProp` / `filterOption` / `filterSort` | 搜索内部按 `text` 过滤，无配置 |
| `loading` | 用 `disabled` 表达加载态 |
| `size` / `variant` | 用 `inputStyle` 近似 |
| `notFoundContent` / `optionRender` / `optionLabelProp` / `popupRender` / `popupMatchSelectWidth` / `getPopupContainer` | 无对应，忽略 |
| `defaultActiveFirstOption` / `autoFocus` | 用 `ref.focus()` 命令式 |
| `onPopupScroll` / `onInputKeyDown` / `onClear` | 无对应回调，忽略 |
| `fieldNames` | 字段固定，需先转数据 `label→text` |
| `autoClearSearchValue` | 无搜索框自动清空开关，忽略 |

## 4. 完整示例对照

```jsx
// antd
import { Select } from 'antd';

const antdOpts = [
  { label: '华东', value: 'east' },
  { label: '华南', value: 'south' },
  { label: '华北', value: 'north', disabled: true },
];

<Select
  mode="multiple"
  options={antdOpts}
  placeholder="请选择区域"
  allowClear
  showSearch
  maxTagCount={3}
  virtual
  listHeight={240}
  value={regions}
  onChange={(value) => { setRegions(value); fetchList({ regions: value, page: 1 }); }}
  onSelect={(v) => console.log('选', v)}
  onDeselect={(v) => console.log('取消', v)}
  status="error"
/>

// eview 等价
import MultipleSelect from '@nce/eview-react/MultipleSelect';

const eviewOpts = [
  { text: '华东', value: 'east' },
  { text: '华南', value: 'south' },
  { text: '华北', value: 'north', disabled: true },   // 注意 disabled 不是 disable
];

<MultipleSelect
  ref={regionRef}
  options={eviewOpts}                                   // label→text
  placeholder="请选择区域"
  enableCloseIcon                                       // allowClear → enableCloseIcon
  searchable                                            // showSearch → searchable
  displayItems={3}                                      // maxTagCount → displayItems
  virtualScroll                                        // virtual → virtualScroll
  listHeight={240}
  value={regions}
  onChange={(value, changeValue, event) => {            // 三参：全部选中 + 本次变化
    setRegions(value);
    fetchList({ regions: value, page: 1 });
  }}
  required                                              // status → required + hintType
  hintType="tip"
/>
// onSelect/onDeselect 合并到 onChange 第二参 changeValue
// 提交前用 regionRef.current.validate() 校验
```
