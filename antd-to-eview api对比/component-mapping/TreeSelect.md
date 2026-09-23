# TreeSelect → TreeSelect 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `TreeSelect` ⇄ eview `TreeSelect`
- 定位差异：两者都是「下拉树选择」控件，下拉展开一棵树供选择。但节点字段不同：antd 用 `value` / `title` / `children`，eview 沿用 Tree 的 **`id` / `text` / `children`**（主键字段名由 `nodeKey` 指定）。勾选开关 antd 是 `treeCheckable`，eview 是 **`enableCheckbox`**。多选 antd 用 `multiple`（默认 false），eview 的 `enableMultiSelect` **默认 true**，单选要显式关掉。**最关键的差异在 `onChange`：antd 回传 `value`（string 或数组），eview 回传的是选中节点对象数组 `[{ value, text, tipText }]`，业务需取 `.value`。**

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `treeData` | `treeData` | 直接改名 | 数据属性同名，但节点字段不同：`title→text`、`value→id`（见 2.1） |
| `fieldNames` | `nodeKey` | 综合映射 | antd 可改 `label`/`value`/`children` 字段名；eview 只能改主键字段 `nodeKey`，`text` 固定（见 2.2） |
| `value` | `value` | 直接改名 | eview 受控值（demo 未演示，待实测）；注意类型需与 `onChange` 回传对齐 |
| `defaultValue` | — | ❌ 无法映射 | eview 无默认值；用 `value` 受控初始化 |
| `onChange(value, label, extra)` | `onChange(selectNode[])` | 综合映射 | antd 回传 value（string/数组）；eview 回传**节点对象数组** `[{value, text, tipText}]`，需取 `.value`（见 2.3） |
| `multiple` | `enableMultiSelect` | 改名 + 改值 | antd 默认 false；eview 默认 true，单选要 `enableMultiSelect={false}`（见 2.4） |
| `treeCheckable` | `enableCheckbox` | 直接改名 | 显示勾选框 |
| `treeCheckStrictly` | `disabelCheckAssociated` | 改名 + 改值 | 取消父子联动（注意 eview 属性名为官方拼写） |
| `allowClear` | `enableCloseIcon` | 改名 | antd 清除按钮；eview 已选项关闭小图标 |
| `autoClearSearchValue` | — | ❌ 无法映射 | eview 无搜索框自动清空开关 |
| `disabled` | `disabled` | 直接改名 | |
| `placeholder` | `placeholder` | 直接改名 | 占位文本 |
| `showSearch` | — | ❌ 无法映射 | eview TreeSelect demo 未演示搜索；资料薄，待实测 |
| `searchValue` | — | ❌ 无法映射 | 同上 |
| `onSearch(value)` | — | ❌ 无法映射 | 同上 |
| `treeDefaultExpandAll` | — | ❌ 无法映射 | eview 无默认全展开；eview Tree 资料里是 `expandedKeys`，TreeSelect 未暴露 |
| `treeDefaultExpandedKeys` | — | ❌ 无法映射 | 同上 |
| `treeExpandedKeys` | — | ❌ 无法映射 | eview TreeSelect 未暴露受控展开 keys |
| `onTreeExpand` | — | ❌ 无法映射 | 同上 |
| `treeExpandAction` | — | ❌ 无法映射 | eview 无点击展开动作配置 |
| `treeLine` | — | ❌ 无法映射 | eview TreeSelect 未暴露连线 |
| `treeIcon` | — | ❌ 无法映射 | eview TreeSelect 未暴露树图标开关 |
| `treeLoadedKeys` | — | ❌ 无法映射 | eview TreeSelect 未暴露已加载节点 |
| `loadData` | — | ❌ 无法映射 | eview TreeSelect demo 未演示异步加载 |
| `treeDataSimpleMode` | — | ❌ 无法映射 | eview 无简单格式；先转成 `{id,text,children}` 再传 |
| `treeTitleRender` | — | ❌ 无法映射 | eview 无自定义渲染节点 |
| `switcherIcon` | — | ❌ 无法映射 | eview TreeSelect 未暴露展开/折叠图标 |
| `labelInValue` | — | ❌ 无法映射 | eview `onChange` 本就回传节点对象，无需该开关 |
| `showCheckedStrategy` | — | ❌ 无法映射 | eview 勾选回显策略内部管理，无对应配置 |
| `maxCount` | — | ❌ 无法映射 | eview TreeSelect 未暴露最大数量 |
| `maxTagCount` | — | ❌ 无法映射 | eview 未暴露 tag 数量限制 |
| `maxTagPlaceholder` | — | ❌ 无法映射 | 同上 |
| `maxTagTextLength` | — | ❌ 无法映射 | 同上 |
| `tagRender` | — | ❌ 无法映射 | eview 无自定义 tag 渲染 |
| `open` | — | ❌ 无法映射 | eview 未暴露受控展开（有 `onOpenMultipleSelectPopup` 回调） |
| `defaultOpen` | — | ❌ 无法映射 | eview 无默认展开下拉开关 |
| `onOpenChange` | `onOpenMultipleSelectPopup` | 改名 | 面板开合回调 |
| `notFoundContent` | — | ❌ 无法映射 | eview 无空状态自定义 |
| `suffixIcon` | — | ❌ 无法映射 | eview 无自定义后缀图标 |
| `listHeight` | — | ❌ 无法映射 | eview TreeSelect 未暴露弹窗高度 |
| `virtual` | — | ❌ 无法映射 | eview TreeSelect 未暴露虚拟滚动开关 |
| `popupMatchSelectWidth` | — | ❌ 无法映射 | eview 未暴露同宽配置 |
| `popupRender` | — | ❌ 无法映射 | eview 无自定义下拉内容 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 未暴露弹层父节点 |
| `placement` | — | ❌ 无法映射 | eview 未暴露弹出位置 |
| `size` | — | ❌ 无法映射 | eview TreeSelect 未暴露 size；用 `selectStyle` / `inputStyle` 近似 |
| `status` | `required` / `validator` | 综合映射 | antd 校验状态；eview 用 `required` + `validator` 表达必填与校验（见 2.5） |
| `variant` | — | ❌ 无法映射 | eview 无形态变体 |
| `prefix` | — | ❌ 无法映射 | eview 无前缀 |
| `classNames` / `styles` | `selectClassName` / `selectStyle` 等 | 综合映射 | eview 按区域分属性（见 2.6） |
| `onSelect` / `onPopupScroll` | — | ❌ 无法映射 | eview 未暴露选中回调与弹窗滚动回调 |
| `nodeKey` | — | eview 特有 | 主键字段名（默认 id） |
| `required` / `validator` | — | eview 特有 | 必填 / 自定义校验 |
| `label` / `labelPosition` | — | eview 特有 | 名称文字及位置 |
| `optionSelectEach` | — | eview 特有 | 选中均显示 |
| `enableCloseIcon` / `delimiter` / `tagStyle` / `inputStyle` | — | eview 特有 | 已选预览关闭图标 / 分隔符 / 样式 |
| `selectStyle` / `selectClassName` / `popUpStyle` / `popUpClassName` / `labelStyle` | — | eview 特有 | 各区域样式与标识 |
| `onFocus` / `onBlur` | — | eview 特有 | 聚焦 / 失焦 |

## 2. 处理方式详解

### 2.1 `treeData` 字段转换（综合映射）

antd 节点 `value` / `title` / `children`，eview 是 `id` / `text` / `children`，迁移时递归转换：

```js
function toEviewTreeData(antdNodes) {
  return antdNodes.map((n) => ({
    id: n.value,
    text: n.title,
    children: n.children ? toEviewTreeData(n.children) : undefined,
    disabled: n.disabled,
    isLeaf: n.isLeaf,
  }));
}
```

注：eview `onChange` 回传的节点对象里字段是 `value` / `text`，与数据里的 `id` / `text` 不完全一致——`value` 取自主键字段值。

### 2.2 `fieldNames` → `nodeKey`（综合映射）

antd `fieldNames` 可改 `label` / `value` / `children` 三个字段名；eview 只能用 `nodeKey` 改主键字段名，`text` / `children` 固定。需先把数据规整成 `{ id, text, children }`。

```jsx
// antd
<TreeSelect treeData={data} fieldNames={{ label: 'name', value: 'code', children: 'subs' }} />

// eview：先转数据，再 nodeKey="code"
const eviewData = convert(data); // { name→text, code→id, subs→children }
<TreeSelect treeData={eviewData} nodeKey="code" />
```

### 2.3 `onChange` 签名调整（综合映射）

antd `onChange(value, label, extra)` 回传 value（string 或数组）；eview `onChange(selectNode[])` 回传**节点对象数组** `[{ value, text, tipText }]`。业务侧需取 `.value`。

```jsx
// antd
<TreeSelect treeData={data} onChange={(value, label, extra) => setDeptId(value)} />

// eview
<TreeSelect
  treeData={eviewData}
  nodeKey="id"
  enableMultiSelect={false}
  onChange={(selectNode) => {
    setDept(selectNode);
    const value = selectNode[0]?.value;    // 取 .value
    fetchList({ deptId: value, page: 1 });
  }}
/>
```

### 2.4 `multiple` → `enableMultiSelect`（改值）

注意默认值相反：antd `multiple` 默认 false（单选），eview `enableMultiSelect` 默认 true（多选）。单选务必显式关闭。

```jsx
// antd 单选（默认）
<TreeSelect treeData={data} onChange={...} />

// eview 单选
<TreeSelect treeData={eviewData} nodeKey="id" enableMultiSelect={false} onChange={...} />
```

### 2.5 `status` → `required` / `validator`（综合映射）

antd 用 `status="error"/"warning"` 表达校验态；eview 用 `required`（必填）+ `validator`（自定义校验返回 `{ result, message }`）。

```jsx
// antd
<TreeSelect treeData={data} status="error" />

// eview
<TreeSelect
  treeData={eviewData}
  nodeKey="id"
  required
  validator={(value, id, type) => ({
    result: Array.isArray(value) ? value.length > 0 : !!value,
    message: '请选择所属部门',
  })}
/>
```

### 2.6 `classNames` / `styles` → 区域属性（综合映射）

eview 按区域分属性，无语义化结构 class/style 对象：

```jsx
// antd
<TreeSelect classNames={{ popup: { root: 'my-popup' } }} styles={{ popup: { root: { zIndex: 10 } } }} />

// eview
<TreeSelect popUpClassName="my-popup" popUpStyle={{ zIndex: 10 }} />
```

## 3. 无法映射的属性与建议处理

| antd 属性 | 建议 |
| --- | --- |
| `defaultValue` | 用 `value` 受控初始化 |
| `showSearch` / `searchValue` / `onSearch` | eview TreeSelect 资料薄未演示搜索，待实测；暂用外层 `SearchInput` + 树数据过滤近似 |
| `treeDefaultExpandAll` / `treeDefaultExpandedKeys` / `treeExpandedKeys` / `onTreeExpand` | eview TreeSelect 未暴露受控展开，展开态内部管理 |
| `treeExpandAction` / `treeLine` / `treeIcon` / `switcherIcon` | 无对应，忽略 |
| `loadData` / `treeLoadedKeys` | 待实测，暂用预加载全树替代 |
| `treeDataSimpleMode` | 先扁平转 `{id,text,children}` 再传 |
| `treeTitleRender` | 无自定义渲染，用 `text` |
| `labelInValue` | eview `onChange` 本就回传节点对象，无需该开关 |
| `showCheckedStrategy` | 勾选回显策略内部管理，无配置 |
| `maxCount` / `maxTagCount` / `maxTagPlaceholder` / `maxTagTextLength` / `tagRender` | 无 tag 数量与自定义渲染，忽略 |
| `open` / `defaultOpen` | 用 `onOpenMultipleSelectPopup` 监听开合，无受控展开 |
| `notFoundContent` / `suffixIcon` / `listHeight` / `virtual` / `popupMatchSelectWidth` / `popupRender` / `getPopupContainer` / `placement` / `size` / `variant` / `prefix` | 无对应，忽略或用 `selectStyle` 近似 |
| `onSelect` / `onPopupScroll` | 无对应回调，忽略 |
| `autoClearSearchValue` | 无搜索框，忽略 |

## 4. 完整示例对照

```jsx
// antd
import { TreeSelect } from 'antd';

const antdData = [
  { value: 'hq', title: '总部', children: [
    { value: 'rd', title: '研发部', children: [{ value: 'rd-fe', title: '前端组' }] },
    { value: 'ops', title: '运维部' },
  ] },
];

<TreeSelect
  treeData={antdData}
  treeCheckable
  multiple
  showSearch
  allowClear
  treeDefaultExpandAll
  placeholder="请选择部门"
  onChange={(value) => setDept(value)}
/>

// eview 等价
import TreeSelect from '@nce/eview-react/TreeSelect';

const eviewData = [
  { id: 'hq', text: '总部', children: [
    { id: 'rd', text: '研发部', children: [{ id: 'rd-fe', text: '前端组' }] },
    { id: 'ops', text: '运维部' },
  ] },
];

<TreeSelect
  treeData={eviewData}
  nodeKey="id"
  enableCheckbox               // treeCheckable → enableCheckbox
  enableCloseIcon              // allowClear → enableCloseIcon
  placeholder="请选择部门"
  onChange={(selectNode) => {   // 回传节点对象数组，取 .value
    setDept(selectNode.map((n) => n.value));
  }}
/>
// 多选（enableMultiSelect 默认 true，无需显式传）
// treeDefaultExpandAll / showSearch 无对应，暂忽略
```
