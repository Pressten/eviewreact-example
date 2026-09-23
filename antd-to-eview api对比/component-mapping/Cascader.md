# Cascader → Cascader 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Cascader` ⇄ eview `Cascader`
- 定位差异：两者都是「级联选择器」，省/市/区、目录/分类逐级选到底。但 antd `Cascader` 配置极其丰富（`fieldNames` / `loadData` 动态加载 / `displayRender` 自定义展示 / `showSearch` 搜索 / `expandTrigger` / `variant` / `status` / 语义化 class/style 等）；eview `Cascader` 极简，**仅支持**单选/多选、`changeOnSelect`、`multiLimit`、`disabled`、`placeholder`、`selectStyle`。字段名与 antd **一致**用 `label`（eview 中唯一用 `label` 而非 `text` 的组件）。值属性名是 **`selectedValue`**（非 `value`），值为路径数组。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `options` | `options` | 综合映射 | 字段名一致（`label`/`value`/`children`/`disabled`），但 `isLeaf` 不支持（见 2.1） |
| `value` | `selectedValue` | 改名 | antd `value` → eview `selectedValue`；均为路径数组，`multiple` 时为二维数组 |
| `defaultValue` | `selectedValue` | 综合映射 | antd 非受控 → eview 无非受控，需改为受控 `selectedValue`（见 2.2） |
| `onChange` | `onChange` | 改名 + 签名调整 | antd `(value, selectedOptions)`；eview `(value)` 仅一参（见 2.3） |
| `changeOnSelect` | `changeOnSelect` | 直接改名 | |
| `multiple` | `multiple` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `placeholder` | `placeholder` | 直接改名 | |
| `maxTagCount` | `multiLimit` | 综合映射 | antd 数字或 `responsive` → eview 数字（仅多选预览个数，见 2.4） |
| `className` | `className` | 直接改名 | |
| `allowClear` | — | ❌ 无法映射 | eview 无清除按钮（见 3.1） |
| `autoClearSearchValue` | — | ❌ 无法映射 | eview 无搜索框 |
| `autoFocus` | — | ❌ 无法映射 | eview 无 autoFocus |
| `classNames` | — | ❌ 无法映射 | 改用 `selectClassName` / `itemClassName` |
| `defaultOpen` | — | ❌ 无法映射 | eview 无受控展开 |
| `displayRender` | — | ❌ 无法映射 | eview 无自定义展示渲染（见 3.2） |
| `tagRender` | — | ❌ 无法映射 | eview 无自定义 tag 渲染 |
| `popupClassName` / `dropdownClassName` | `selectClassName` / `itemClassName` | 综合映射 | 浮层 class → 选择框 / 下拉项 class（见 3.3） |
| `popupRender` / `dropdownRender` | — | ❌ 无法映射 | eview 无自定义浮层内容 |
| `dropdownStyle` | — | ❌ 无法映射 | 改用 `selectStyle` |
| `expandIcon` | — | ❌ 无法映射 | eview 无自定义展开图标 |
| `expandTrigger` | — | ❌ 无法映射 | eview 固定 click 展开 |
| `fieldNames` | — | ❌ 无法映射 | eview 字段名固定为 `label`/`value`/`children`（见 3.4） |
| `getPopupContainer` | — | ❌ 无法映射 | eview 无容器配置 |
| `loadData` | — | ❌ 无法映射 | eview 无动态加载（见 3.5） |
| `maxTagPlaceholder` | — | ❌ 无法映射 | eview 无隐藏 tag 占位 |
| `maxTagTextLength` | — | ❌ 无法映射 | eview 无 tag 文本长度限制 |
| `notFoundContent` | — | ❌ 无法映射 | eview 无空内容配置 |
| `open` | — | ❌ 无法映射 | eview 无受控展开 |
| `placement` | — | ❌ 无法映射 | eview 无浮层位置配置 |
| `prefix` | — | ❌ 无法映射 | eview 无前缀 |
| `showSearch` | — | ❌ 无法映射 | eview Cascader 无搜索框（见 3.6） |
| `searchValue` | — | ❌ 无法映射 | 同上 |
| `onSearch` | — | ❌ 无法映射 | 同上 |
| `size` | — | ❌ 无法映射 | eview 无 large/middle/small |
| `status` | — | ❌ 无法映射 | eview 无 error/warning 状态 |
| `styles` | — | ❌ 无法映射 | 改用 `selectStyle` |
| `suffixIcon` | — | ❌ 无法映射 | eview 无自定义后缀图标 |
| `variant` | — | ❌ 无法映射 | eview 无形态变体 |
| `showCheckedStrategy` | — | ❌ 无法映射 | eview demo 有但不在 props 表，待实测，勿依赖（见 3.7） |
| `removeIcon` | — | ❌ 无法映射 | eview 无自定义清除图标 |
| `popupMenuColumnStyle` / `dropdownMenuColumnStyle` | — | ❌ 无法映射 | eview 无列样式 |
| `optionRender` | — | ❌ 无法映射 | eview 无自定义选项渲染 |
| `onOpenChange` / `onDropdownVisibleChange` | — | ❌ 无法映射 | eview 无展开回调 |
| `blur()` / `focus()` | — | ❌ 无法映射 | eview Cascader 无 ref 方法 |
| — | `multiLimit` | eview 特有 | 多选预览最多展示个数（antd `maxTagCount` 近似） |
| — | `selectStyle` / `selectClassName` / `itemClassName` | eview 特有 | 选择框 / 下拉项样式 |
| — | `id` | eview 特有 | 外层标识 |

## 2. 处理方式详解

### 2.1 `options` 字段名映射（综合映射）

字段名与 antd 一致（`label`/`value`/`children`/`disabled`），但 antd 的 `isLeaf`（标记叶子节点，配合 `loadData`）eview 不支持，需忽略或确保 `children` 结构完整。

```js
// antd options 字段一致，仅去掉 isLeaf
function toEviewOptions(antdOptions) {
  return antdOptions.map(({ isLeaf, ...rest }) => ({
    ...rest,
    children: rest.children ? toEviewOptions(rest.children) : undefined,
  }));
}
```

```jsx
// antd
const options = [{ label: '江苏', value: 'jiangsu', isLeaf: false, children: [...] }];

// eview：去掉 isLeaf
const options = [{ label: '江苏', value: 'jiangsu', children: [...] }];
```

### 2.2 `defaultValue` → `selectedValue`（综合映射）

eview 无非受控 `defaultValue`，需改为受控 `selectedValue` + `onChange`。

```jsx
// antd
<Cascader defaultValue={['jiangsu', 'nanjing']} options={options} />

// eview
const [region, setRegion] = useState(['jiangsu', 'nanjing']);
<Cascader selectedValue={region} options={options} onChange={(value) => setRegion(value)} />
```

### 2.3 `onChange` 签名调整

```jsx
// antd：onChange(value, selectedOptions)
<Cascader onChange={(value, selectedOptions) => {}} />

// eview：onChange(value) —— 只有第一参
<Cascader onChange={(value) => {}} />
// 如需 selectedOptions，用 value 在 options 中递归查 label
```

### 2.4 `maxTagCount` → `multiLimit`（综合映射）

antd `maxTagCount` 收数字或 `responsive`（响应式）；eview `multiLimit` 仅数字（预览最多展示个数），`responsive` 丢失。

```jsx
// antd
<Cascader multiple maxTagCount={3} />

// eview
<Cascader multiple multiLimit={3} />
```

## 3. 无法映射的属性与建议处理

### 3.1 `allowClear`（清除）

eview 无清除按钮，需外部控制 `selectedValue` 置空：

```jsx
// antd
<Cascader allowClear />

// eview：外部加按钮置空
<Cascader selectedValue={region} onChange={setRegion} />
<Button status="text" text="清除" onClick={() => setRegion([])} />
```

### 3.2 `displayRender`（自定义展示）

eview 无自定义展示渲染，展示格式固定。如需自定义摘要，自行用 value 在 options 中递归查 label 渲染：

```jsx
// antd
<Cascader displayRender={(label) => label.join(' / ')} />

// eview：自行渲染摘要
const labelsOf = (opts, path) => {
  const out = []; let level = opts;
  for (const v of path) {
    const hit = level.find((o) => o.value === v);
    if (!hit) break;
    out.push(hit.label); level = hit.children ?? [];
  }
  return out.join(' / ');
};
<div>{labelsOf(options, region)}</div>
```

### 3.3 `popupClassName` / `dropdownStyle`

eview 用 `selectClassName` / `selectStyle` / `itemClassName` 透传样式。

```jsx
// antd
<Cascader popupClassName="my-popup" dropdownStyle={{ width: 300 }} />

// eview
<Cascader selectClassName="my-popup" selectStyle={{ width: 300 }} />
```

### 3.4 `fieldNames`（自定义字段名）

eview 字段名固定为 `label`/`value`/`children`，需在传入前转换数据：

```jsx
// antd：自定义字段名
<Cascader fieldNames={{ label: 'name', value: 'id', children: 'subs' }} options={data} />

// eview：转换数据
const toCascaderOptions = (data) => data.map((d) => ({
  label: d.name, value: d.id,
  children: d.subs ? toCascaderOptions(d.subs) : undefined,
}));
<Cascader options={toCascaderOptions(data)} />
```

### 3.5 `loadData`（动态加载）

eview 无动态加载，需一次性加载完整 options：

```jsx
// antd：动态加载子项
<Cascader loadData={(selectedOptions) => fetchChildren(selectedOptions)} />

// eview：一次性拉取完整树
useEffect(() => { fetchFullTree().then(setOptions); }, []);
<Cascader options={options} />
// 树过深时改用 TreeSelect
```

### 3.6 `showSearch`（搜索）

eview Cascader 无搜索框。层级深且需搜索时改用 TreeSelect，或用两个 Select 级联。

```jsx
// antd
<Cascader showSearch />

// eview：改用 TreeSelect 或前端过滤 options
```

### 3.7 `showCheckedStrategy`

eview demo 出现 `showCheckedStrategy="SHOW_PARENT" | "SHOW_CHILD"`，但**不在官方 props 表中**，待实测，勿作为默认写法。

### 3.8 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `autoClearSearchValue` / `searchValue` / `onSearch` | 无搜索框，忽略 |
| `autoFocus` / `defaultOpen` / `open` / `onOpenChange` | 无受控展开，忽略 |
| `expandIcon` / `expandTrigger` | 固定 click 展开，忽略 |
| `tagRender` / `maxTagPlaceholder` / `maxTagTextLength` | 用 `multiLimit` 近似预览个数 |
| `notFoundContent` | 忽略 |
| `placement` / `prefix` / `suffixIcon` | 忽略 |
| `size` / `status` / `variant` | 外层 `selectStyle` 控宽 |
| `removeIcon` / `popupMenuColumnStyle` / `optionRender` | 忽略 |
| `blur()` / `focus()` | 无 ref 方法 |

## 4. 完整示例对照

```jsx
// antd
<Cascader
  options={options}
  value={region}
  onChange={(value, selectedOptions) => setRegion(value)}
  placeholder="请选择地区"
  changeOnSelect
  allowClear
  displayRender={(label) => label.join(' / ')}
/>

// eview 等价
<Cascader
  options={options}              // 字段一致，去 isLeaf
  selectedValue={region}          // value → selectedValue
  onChange={(value) => setRegion(value)}   // 签名仅一参
  placeholder="请选择地区"
  changeOnSelect                  // 直接改名
/>
// allowClear / displayRender 丢失，需外部按钮置空 + 自行渲染摘要
```
