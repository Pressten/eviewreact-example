# Tree → Tree 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Tree` ⇄ eview `Tree`
- 定位差异：两者都是「层级数据展示与选择」的树控件，均有选中 / 勾选 / 展开三套受控状态。但字段名不同：antd 节点用 `title` / `key` / `children`，eview 用 **`text` / `id` / `children`**（主键字段名由 `nodeKey` 指定，默认 `"id"`）。勾选开关 antd 是 `checkable`，eview 是 **`enableCheckbox`**。多选 antd 用 `multiple`（默认 false），eview 的 `enableMultiSelect` **默认 true**，单选场景需显式关掉。eview 内置搜索定位（`ref.findLevelNodes`）与三态图标（`iconLeaf` / `iconExpanded` / `iconCollapsed`），antd 需自行实现。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `treeData` | `data` | 直接改名 | 节点数据；字段名不同，需转换 `title→text`、`key→id`（见 2.1） |
| `fieldNames` | `nodeKey` | 综合映射 | antd 用对象改 `title`/`key`/`children` 字段名；eview 只能改主键字段名 `nodeKey`，`text` 固定（见 2.2） |
| `selectedKeys` | `selectedKeys` | 直接改名 | 类型一致 |
| `onSelect(selectedKeys, e)` | `onSelect(selectedKeys, node, event)` | 改名 + 签名调整 | 第一参 keys 一致；antd 第二参是含 `selected`/`node` 等的对象，eview 第二参直接是 `node`（见 2.3） |
| `defaultSelectedKeys` | — | ❌ 无法映射 | eview 无默认选中；用 `selectedKeys` 受控初始化 |
| `multiple` | `enableMultiSelect` | 改名 + 改值 | antd `multiple` 默认 false；eview `enableMultiSelect` **默认 true**，单选要 `enableMultiSelect={false}`（见 2.4） |
| `selectable` | — | ❌ 无法映射 | eview 无全局可选开关；用 `selectBoxType` 或节点级 `disabled` 近似 |
| `checkable` | `enableCheckbox` | 直接改名 | antd `checkable` → eview `enableCheckbox`（注意 demo 里的 `checkable` 不在 API 表） |
| `checkedKeys` | `checkedKeys` | 直接改名 | 类型一致；eview 不支持 antd 的 `{checked, halfChecked}` 对象形式 |
| `checkStrictly` | `disabelCheckAssociated` | 改名 + 改值 | antd `true` 表示取消联动；eview `disabelCheckAssociated={true}` 取消联动（注意属性名为官方拼写）（见 2.5） |
| `defaultCheckedKeys` | — | ❌ 无法映射 | eview 无默认勾选；用 `checkedKeys` 受控初始化 |
| `expandedKeys` | `expandedKeys` | 直接改名 | |
| `onExpand(expandedKeys, e)` | `onExpand(expandedKeys, node)` | 改名 + 签名调整 | 第一参 keys 一致；eview 第二参直接是 `node` |
| `defaultExpandAll` | — | ❌ 无法映射 | eview 无默认全展开；用 `expandedKeys` 受控或 `expandAll` 方法 |
| `defaultExpandedKeys` | — | ❌ 无法映射 | 同上，用 `expandedKeys` 初始化 |
| `defaultExpandParent` | — | ❌ 无法映射 | eview 无该开关 |
| `autoExpandParent` | — | ❌ 无法映射 | eview 无该开关；展开态完全由 `expandedKeys` 控制 |
| `disabled` | `disabled` | 直接改名 | 整树灰化 |
| `draggable` | `draggable` | 直接改名 | |
| `onDragStart` / `onDragEnd` / `onDrop` | `onDragStart` / `onDragEnd` / `onDrop` | 改名 + 签名调整 | 参数结构不同，eview 顺序更新需自行处理 |
| `onDragEnter` / `onDragLeave` / `onDragOver` | — | ❌ 无法映射 | eview 未暴露这些细粒度拖拽回调 |
| `allowDrop` | — | ❌ 无法映射 | eview 无放置位置控制 |
| `loadData(node)` | `loadData(itemData, callback)` | 综合映射 | antd 接受 Promise 返回子节点；eview 用 callback 回挂子节点（见 2.6） |
| `loadedKeys` | — | ❌ 无法映射 | eview 无已加载节点受控数组 |
| `onLoad` | — | ❌ 无法映射 | eview 无加载完毕回调 |
| `icon` | `iconLeaf` / `iconExpanded` / `iconCollapsed` | 综合映射 | antd 单一 `icon` + `showIcon`；eview 三态分别设，需成套（见 2.7） |
| `showIcon` | — | ❌ 无法映射 | eview 设了图标属性即显示，无独立开关 |
| `switcherIcon` | `iconExpanded` / `iconCollapsed` | 综合映射 | antd 用 `switcherIcon` 控展开/折叠图标；eview 分两属性 |
| `switcherLoadingIcon` | — | ❌ 无法映射 | eview 无独立加载图标 |
| `showLine` | `connectLine` | 直接改名 | 连线样式 |
| `blockNode` | — | ❌ 无法映射 | eview 无节点占整行开关 |
| `filterTreeNode` | `ref.findLevelNodes(value)` | 综合映射 | antd 用函数高亮；eview 用 ref 搜索定位 + 手动写 `expandedKeys`（见 2.8） |
| `titleRender` | — | ❌ 无法映射 | eview 无自定义渲染节点；用节点数据 `text` 或前后缀近似 |
| `height` | `height` | 直接改名 | 开虚拟滚动 |
| `virtual` | `height` / `lazyLoad` | 综合映射 | antd `virtual={false}` 关虚拟滚动；eview 不传 `height` 即不开启，或 `lazyLoad` 减渲染（见 2.9） |
| `rootStyle` | `style` | 直接改名 | eview 直接用 `style` |
| `onRightClick` | `onNodeRightClick` | 直接改名 | |
| `selectTriggerCheck` / `checkWhenSelect` | — | eview 特有 | 点选是否同时勾选（默认 true） |
| `lazyLoad` | — | eview 特有 | 未展开子树不渲染 |
| `connectLine` / `superLevel` | — | eview 特有 | 连线 / 超多级容器 |
| `focusNode` | — | eview 特有 | 滚动到并聚焦节点 |
| `onNodeDoubleClick` / `onClickRightIcon` | — | eview 特有 | 双击 / 右侧图标回调 |
| `treeNodePrefix` / `treeNodeSuffix` / `showRightIcon(Arr)` | — | eview 特有 | 节点前后缀 / 右侧图标 |
| `expandAll` / `cancelAll` | — | eview 特有 | 全展 / 全收方法 |
| `ref.findLevelNodes(value)` | — | eview 特有 | 搜索匹配节点及祖先 |

### TreeNode props 映射

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `title` | `text` | 直接改名 | 显示文本 |
| `key` | `id` | 直接改名 | 主键（字段名可由 `nodeKey` 改） |
| `children` | `children` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `selectable` | — | ❌ 无法映射 | eview 无节点级可选开关 |
| `checkable` | `hideRootCheckbox` | 综合映射 | antd 控单节点是否显示 Checkbox；eview 用 `hideRootCheckbox` 隐藏（语义反向） |
| `disableCheckbox` | — | ❌ 无法映射 | eview 无禁勾；改用 `disabled` 近似 |
| `icon` | `iconLeaf` | 综合映射 | 节点级图标落到 `iconLeaf` |
| `isLeaf` | `isLeaf` | 直接改名 | `false` 强制作为父节点（懒加载用） |

### DirectoryTree props 映射

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `expandAction` | — | ❌ 无法映射 | eview 无目录树专属展开动作；用 `expandedKeys` + `onSelect` 自行实现 |

## 2. 处理方式详解

### 2.1 `treeData` 字段转换（综合映射）

antd 节点字段 `title` / `key`，eview 是 `text` / `id`，迁移时需递归转换：

```js
function toEviewTreeData(antdNodes) {
  return antdNodes.map((n) => ({
    id: n.key,
    text: n.title,
    children: n.children ? toEviewTreeData(n.children) : undefined,
    disabled: n.disabled,
    isLeaf: n.isLeaf,
    hideRootCheckbox: n.checkable === false,
  }));
}
```

### 2.2 `fieldNames` → `nodeKey`（综合映射）

antd 的 `fieldNames` 可改 `title` / `key` / `children` 三个字段名；eview 只能用 `nodeKey` 改主键字段名，`text` / `children` 固定。若 antd 数据用自定义字段，需先把数据规整成 `{ id, text, children }` 再传。

```jsx
// antd
<Tree treeData={data} fieldNames={{ title: 'name', key: 'id', children: 'subs' }} />

// eview：先把数据转成 text/id/children，再 nodeKey="id"
const eviewData = convert(data); // { name→text, id→id, subs→children }
<Tree data={eviewData} nodeKey="id" />
```

### 2.3 `onSelect` / `onExpand` 签名调整

```jsx
// antd：onSelect(selectedKeys, { selected, selectedNodes, node, event })
<Tree onSelect={(keys, { node }) => setSelected(keys)} />

// eview：onSelect(selectedKeys, node, event)
<Tree onSelect={(keys, node, event) => setSelected(keys)} />
// 第二参直接是 node；event 第三参可不用
```

### 2.4 `multiple` → `enableMultiSelect`（改值）

注意默认值相反：antd `multiple` 默认 false（单选），eview `enableMultiSelect` 默认 true（多选）。单选树务必显式关闭。

```jsx
// antd 单选（默认）
<Tree treeData={data} onSelect={...} />

// eview 单选
<Tree data={eviewData} nodeKey="id" enableMultiSelect={false} onSelect={...} />
```

### 2.5 `checkStrictly` → `disabelCheckAssociated`（改值）

两者语义一致（取消父子联动），属性名不同；eview 属性名为官方拼写（注意拼写）。

```jsx
// antd
<Tree checkable checkStrictly checkedKeys={keys} onCheck={setKeys} />

// eview
<Tree enableCheckbox disabelCheckAssociated checkedKeys={keys} onCheck={(keys) => setKeys(keys)} />
```

### 2.6 `loadData` → `loadData(itemData, callback)`（综合映射）

antd `loadData` 接受 `node` 返回 Promise，eview 用 callback 回挂子节点。

```jsx
// antd
<Tree treeData={data} loadData={(node) => fetchChildren(node.key).then(setChildren)} />

// eview
<Tree data={eviewData} nodeKey="id" loadData={(itemData, callback) => {
  api.children(itemData.id).then((list) => callback(list)); // 回挂子节点；无子节点 callback([])
}} />
```

### 2.7 `icon` + `showIcon` → 三态图标（综合映射）

antd 单一 `icon` + `showIcon` 开关；eview 用 `iconLeaf` / `iconExpanded` / `iconCollapsed` 三态，需成套设置。

```jsx
// antd
<Tree treeData={data} showIcon icon={<FileIcon />} />

// eview
import { IconPlusIcPublicFile, IconPlusIcPublicFolderOpen, IconPlusIcPublicFolder } from '@nce/icon-plus';
<Tree data={eviewData} nodeKey="id"
  iconLeaf={<IconPlusIcPublicFile />}
  iconExpanded={<IconPlusIcPublicFolderOpen />}
  iconCollapsed={<IconPlusIcPublicFolder />}
/>
```

### 2.8 `filterTreeNode` → `ref.findLevelNodes`（综合映射）

antd 用函数高亮；eview 无内置高亮过滤，用 ref 搜索匹配节点及祖先，再写回 `expandedKeys` 展开路径。

```jsx
// antd
<Tree treeData={data} filterTreeNode={(node) => node.title.includes(keyword)} />

// eview
const treeRef = useRef(null);
<SearchInput onSearch={(value) => {
  if (!value) { setExpandedKeys(['root']); return; }
  const nodes = treeRef.current.findLevelNodes(value);
  setExpandedKeys(nodes.map((n) => n.id));
}} />
<Tree ref={treeRef} data={eviewData} nodeKey="id" expandedKeys={expandedKeys} onExpand={setExpandedKeys} />
```

### 2.9 `virtual` → `height` / `lazyLoad`（综合映射）

antd `virtual` 默认 true 开虚拟滚动；eview 不传 `height` 即不开启虚拟滚动，传 `height` 开启；`lazyLoad` 控制未展开子树是否渲染。

```jsx
// antd 关虚拟滚动
<Tree treeData={data} virtual={false} />

// eview 不开虚拟滚动（不传 height）
<Tree data={eviewData} nodeKey="id" />

// antd 开虚拟滚动 + 高度
<Tree treeData={data} height={400} />

// eview
<Tree data={eviewData} nodeKey="id" height={400} />
```

## 3. 无法映射的属性与建议处理

| antd 属性 | 建议 |
| --- | --- |
| `defaultSelectedKeys` / `defaultCheckedKeys` / `defaultExpandedKeys` / `defaultExpandAll` / `defaultExpandParent` / `autoExpandParent` | 用受控 `selectedKeys` / `checkedKeys` / `expandedKeys` 初始化 |
| `selectable`（全局可选开关） | 用 `selectBoxType` 或节点级 `disabled` 近似 |
| `titleRender`（自定义渲染节点） | 用节点数据 `text`，或 `treeNodePrefix` / `treeNodeSuffix` 加前后缀近似 |
| `switcherLoadingIcon` | 无对应，忽略 |
| `blockNode` | 用 `style` / `className` 自定义节点宽度 100% |
| `allowDrop` / `onDragEnter` / `onDragLeave` / `onDragOver` | eview 未暴露细粒度拖拽回调，忽略 |
| `loadedKeys` / `onLoad` | 无对应，eview 加载态内部管理 |
| `showIcon` | 设了图标属性即显示，无需开关 |
| `DirectoryTree.expandAction` | 用 `expandedKeys` + `onSelect` 自行实现 click/doubleClick 展开 |
| `checkStrictly` 的 `{checked, halfChecked}` 对象形式 | eview `checkedKeys` 只支持数组，halfChecked 内部管理 |
| TreeNode.`disableCheckbox` / `selectable` | 改用 `disabled` 近似 |

## 4. 完整示例对照

```jsx
// antd
import { Tree } from 'antd';

const antdData = [
  { key: 'hq', title: '总部', children: [
    { key: 'rd', title: '研发部', children: [{ key: 'rd-fe', title: '前端组' }] },
  ] },
];

<Tree
  treeData={antdData}
  checkable
  checkStrictly
  defaultExpandAll
  multiple={false}
  showLine
  selectedKeys={['hq']}
  checkedKeys={{ checked: ['rd-fe'], halfChecked: ['rd'] }}
  onSelect={(keys) => setSelected(keys)}
  onCheck={(keys) => setChecked(keys.checked ?? keys)}
  onExpand={(keys) => setExpanded(keys)}
  loadData={(node) => fetchChildren(node.key)}
/>

// eview 等价
import Tree from '@nce/eview-react/Tree';
import { IconPlusIcPublicFile, IconPlusIcPublicFolderOpen, IconPlusIcPublicFolder } from '@nce/icon-plus';

const eviewData = [
  { id: 'hq', text: '总部', children: [
    { id: 'rd', text: '研发部', children: [{ id: 'rd-fe', text: '前端组' }] },
  ] },
];

<Tree
  data={eviewData}
  nodeKey="id"
  enableCheckbox
  disabelCheckAssociated           // checkStrictly → 取消父子联动
  enableMultiSelect={false}        // multiple=false → 默认 true 需显式关
  connectLine                       // showLine → connectLine
  iconLeaf={<IconPlusIcPublicFile />}
  iconExpanded={<IconPlusIcPublicFolderOpen />}
  iconCollapsed={<IconPlusIcPublicFolder />}
  selectedKeys={selectedKeys}        // 受控替代 defaultExpandAll/defaultSelectedKeys
  expandedKeys={expandedKeys}
  checkedKeys={checkedKeys}         // 数组形式，不支持 {checked,halfChecked}
  onSelect={(keys) => setSelectedKeys(keys)}
  onCheck={(keys) => setCheckedKeys(keys)}
  onExpand={(keys) => setExpandedKeys(keys)}
  loadData={(itemData, callback) => fetchChildren(itemData.id).then(callback)}
/>
```
