# Table → Table 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Table` ⇄ eview `Table`
- 定位差异：两者都是「列定义驱动的行列数据集展示」。但 eview Table 用 `dataset`（二维数组或对象数组，行顺序与 `columns` 一致）+ `keyIndex`（行主键所在列序号）表达数据源，antd 用 `dataSource + rowKey`。eview 把分页拆成 `enablePagination` / `pagingProps` / `enableAutoPaging`（前台分页）/ `onPageChange`，排序拆成 `enableSort` / `disableEviewSort`（关前台排序，后台排序用）/ `onColumnSort(sortColumn, sortType)`，勾选拆成 `enableCheckBox` / `checkType` / `checkedRows` / `onRowCheck(row, checkedRows, e)`。eview **没有** 树形数据、筛选菜单、`components` 覆盖、`summary` 总结栏、`title/footer`、`sticky`、`showHeader`、`size`、`rowClassName`、`onRow` 返回事件对象等能力。

## 1. 属性映射表

### Table 主属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `dataSource` | `dataset` | 改值 | antd 为 `object[] + rowKey`；eview 可为二维数组或对象数组（key 对应 `columns[].key`），行主键用 `keyIndex` 指定（见 2.1） |
| `columns` | `columns` | 综合映射 | 列对象字段差异大，见 2.2 |
| `rowKey` | `keyIndex` | 改值 | antd 用字段名/函数；eview 用「主键所在列序号」number；不设则用行号 |
| `pagination` | `enablePagination` + `pagingProps` + `enableAutoPaging` | 综合映射 | 见 2.3 |
| `rowSelection` | `enableCheckBox` + `checkType` + `checkedRows` + `onRowCheck` + `onHeaderCheck` | 综合映射 | 见 2.4 |
| `expandable` | `enableRowExpand` + `onRowExpend` + `expandedRow` | 综合映射 | 见 2.5 |
| `scroll` | `height` / `maxHeight` / `width` | 综合映射 | 见 2.6 |
| `loading` | `enableLoading` | 直接改名 | |
| `bordered` | — | ❌ 无法映射 | eview 无外/列边框开关；斑马纹用 `enableZebraCrossing`，边框需自定义 CSS |
| `size="large"/"middle"/"small"` | — | ❌ 无法映射 | eview Table 无尺寸档；用 `style` 字号或固定行高近似 |
| `title(currentPageData)` | — | ❌ 无法映射 | eview 无表格标题；外部用 `<div>` 包裹 |
| `footer(currentPageData)` | — | ❌ 无法映射 | eview 无表尾 |
| `summary(currentData)` | — | ❌ 无法映射 | eview 无总结栏；外部自行渲染 |
| `components` | — | ❌ 无法映射 | eview 不支持覆盖 table 元素 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 无筛选菜单浮层 |
| `locale` | `emptyTableMsg` | 改值 | 仅空数据文案可映射；排序/筛选文案无对应（见 3.1） |
| `rowClassName(record, index)` | — | ❌ 无法映射 | eview 无行类名；用 `onRowClick` + 外部 CSS 选中态近似 |
| `rowHoverable` | — | ❌ 无法映射 | eview 行 hover 交互不可关闭 |
| `showHeader` | — | ❌ 无法映射 | eview 表头不可隐藏 |
| `showSorterTooltip` | — | ❌ 无法映射 | eview 排序无 tooltip 提示 |
| `sortDirections` | `enableOriginSort` | 改值 | antd 控制升降序方向集合；eview 用 `enableOriginSort` 允许「原始顺序」态（见 2.7） |
| `sticky` | — | ❌ 无法映射 | eview 无粘性头部/滚动条粘性；表头固定靠容器滚动 |
| `tableLayout` | — | ❌ 无法映射 | eview 内部管理布局 |
| `virtual` | `virtualScroll` + `virtualShowNum` | 改值 | 开启虚拟滚动（见 2.8） |
| `onChange(pagination, filters, sorter, extra)` | `onPageChange(currentPage)` + `onColumnSort(sortColumn, sortType)` | 综合映射 | antd 单回调合并分页/排序/筛选；eview 按场景拆分（见 2.9） |
| `onRow(record, index) => { onClick, … }` | `onRowClick(row, event)` + `onDoubleClick(evtRow, evtCell, e)` + `onRowRightClick(event, row)` | 综合映射 | antd 返回事件 map；eview 直接给回调，参数顺序各不相同（见 2.10） |
| `onHeaderRow(columns, index)` | — | ❌ 无法映射 | eview 无表头行事件 |
| `onScroll(event)` | — | ❌ 无法映射 | eview 无滚动事件回调（虚拟滚动由内部处理） |
| `onChange` 中 `filters` / `extra.action='filter'` | — | ❌ 无法映射 | eview 无列值筛选；列筛选 `enableColumnFilter` 是列显隐，不触发 onChange |
| — | `enableZebraCrossing` | eview 特有 | 斑马纹，默认 true |
| — | `enableColumnFilter` / `itemOrderChanger` / `onFilterOkClick` | eview 特有 | 列显隐筛选弹窗（非值过滤） |
| — | `enableColumnDrag` / `enableColumnWidthFit` / `freezeColPosition` | eview 特有 | 列拖拽 / 自适应 / 冻结位置 |
| — | `enableAutoPaging` | eview 特有 | 前台分页，`dataset` 传全量 |
| — | `disableEviewSort` / `enableOriginSort` / `customSortFun` | eview 特有 | 关前台排序 / 允许原始顺序态 / 自定义比较 |
| — | `onRowCheck(row, checkedRows, e)` / `onHeaderCheck(checkedRows, checked, checkedRowsData)` | eview 特有 | 勾选回调，`checkedRows` 为主键数组 |
| — | `selectedRowIndex` | eview 特有 | 行选中（非勾选）受控 |
| — | `disableCheckboxIds` | eview 特有 | 禁勾行主键数组 |
| — | `emptyTableMsg` / `showEmptyImage` | eview 特有 | 空态文案 / 图 |
| — | `onColumnSorted` / `isRequiredToUpdateColumns` / `enableColumnCompareUpdate` | eview 特有 | 排序完成 / columns 更新开关 / 比较更新 |
| — | `ref.getCheckedRowsData()` / `getCheckedRowsIndexes()` / `getSelectedRowData()` / `setCheckedRows(keys)` / `getDataset()` / `setRowEditable(id, columns)` | eview 特有 | 命令式方法 |

### Column 列属性（columns 数组项）

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `title` | `title` | 直接改名 | |
| `dataIndex` | `key` | 改值 | antd 支持字符串或嵌套路径数组；eview `key` 是字符串，对应对象行字段名（见 2.2） |
| `key` | `key` | 直接改名 | |
| `width` | `width` | 直接改名 | |
| `align` | `align` | 直接改名 | 值一致 `left`/`center`/`right` |
| `ellipsis` | `ellipsis` | 直接改名 | |
| `render(value, record, index)` | `render(cellValue, rowData, options, row, isEdit)` | 综合映射 | 签名不同：antd 第二参为 record、第三参 index；eview 第二参为行数组、第四参才含完整对象（见 2.11） |
| `sorter` / `sortOrder` / `defaultSortOrder` | `allowSort` / `sort` | 综合映射 | 见 2.7 |
| `fixed` | `freezeCol` + `freezeColPosition` | 改值 | antd `true`/`'left'`/`'right'`；eview `freezeCol: true` + `freezeColPosition` 控制位置（见 2.12） |
| `hidden` | `display` | 改值 | antd `hidden: true` 隐藏；eview `display: false` 隐藏，注意取反 |
| `colSpan` | — | ❌ 无法映射 | eview 无表头列合并 |
| `className` | — | ❌ 无法映射 | 用 `style` / 自定义 render 容器 |
| `defaultFilteredValue` / `filteredValue` / `filters` / `filterDropdown` / `filterDropdownProps` / `filterIcon` / `filterMode` / `filterMultiple` / `filterSearch` / `filterOnClose` / `filtered` / `onFilter` | — | ❌ 无法映射 | eview 无列值筛选；后台过滤由业务在请求层处理（见 3.2） |
| `defaultSortOrder` | `sort` | 改值 | antd `'ascend'`/`'descend'`；eview `'asc'`/`'desc'`/`'origin'` |
| `sortDirections` | `enableOriginSort`（表级） | 改值 | 列级覆盖在 eview 用 `allowSort` + 表级 `enableOriginSort` |
| `sortIcon` | — | ❌ 无法映射 | eview 无自定义排序图标 |
| `showSorterTooltip` | — | ❌ 无法映射 | 同表级 |
| `minWidth` | — | ❌ 无法映射 | eview 无最小列宽 |
| `responsive` | — | ❌ 无法映射 | eview 无响应式断点 |
| `rowScope` | — | ❌ 无法映射 | eview 无列范围 |
| `shouldCellUpdate` | — | ❌ 无法映射 | eview 用 `isRequiredToUpdateColumns` / `enableColumnCompareUpdate`（表级） |
| `onCell(record, rowIndex)` | — | ❌ 无法映射 | eview 无单元格属性回调 |
| `onHeaderCell(column)` | — | ❌ 无法映射 | eview 无表头单元格回调 |
| — | `allowSort` | eview 特有 | 是否允许排序，默认 true |
| — | `display` | eview 特有 | 是否显示该列 |
| — | `tipFormatter` | eview 特有 | 单元格悬浮提示；非文本列必填 |
| — | `renderType` / `isEditable` | eview 特有 | 编辑列 |

### rowSelection → 勾选

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `type="checkbox"/"radio"` | `checkType="multi"/"single"` | 改值 | 需先开 `enableCheckBox`（见 2.4） |
| `selectedRowKeys` | `checkedRows` | 改值 | antd 为 React.Key 数组；eview 为主键数组（配合 `keyIndex`） |
| `preserveSelectedRowKeys` | `preserveCheckedRows` | 直接改名 | 跨页保留 |
| `getCheckboxProps(record)` | `disableCheckboxIds` | 综合映射 | antd 按行返回 props；eview 只支持禁勾主键数组（见 2.4） |
| `onChange(selectedRowKeys, selectedRows, info)` | `onRowCheck(row, checkedRows, e)` + `onHeaderCheck(checkedRows, checked, checkedRowsData)` | 综合映射 | antd 单回调给 keys+rows；eview 拆行勾选/表头勾选，第二参为主键数组（见 2.4） |
| `onSelect` / `onSelectAll` / `onSelectInvert` / `onSelectNone` / `onSelectMultiple` | — | ❌ 无法映射 | eview 不细分选择类型回调；用 `onRowCheck` / `onHeaderCheck` 的 `checkedRows` 自行判断 |
| `checkStrictly` | — | ❌ 无法映射 | eview 无父子联动开关（eview 不做树形） |
| `columnTitle` / `columnWidth` / `align` / `fixed` | — | ❌ 无法映射 | eview 勾选列样式不可定制 |
| `defaultSelectedRowKeys` | — | ❌ 无法映射 | eview 用受控 `checkedRows` |
| `selections` | — | ❌ 无法映射 | eview 无自定义选择项（全选/反选/清空）；用外部按钮 + `ref.setCheckedRows()` |
| `hideSelectAll` | — | ❌ 无法映射 | eview 表头勾选框不可隐藏 |
| `renderCell` | — | ❌ 无法映射 | eview 勾选单元格不可自定义渲染 |
| `getTitleCheckboxProps` | — | ❌ 无法映射 | |
| `onCell` | — | ❌ 无法映射 | |

### expandable → 行展开

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `expandedRowRender(record, index, indent, expanded)` | `onRowExpend(row) => ReactNode` | 综合映射 | antd 给 record+index+indent+expanded；eview 只给 row（见 2.5） |
| `expandedRowKeys` / `defaultExpandedRowKeys` | `expandedRow` | 改值 | 受控展开行主键数组 |
| `defaultExpandAllRows` | — | ❌ 无法映射 | eview 无默认全展开；用 `expandedRow` 受控传入全部 |
| `expandRowByClick` | `onRowClick` + `enableRowExpand` | 综合映射 | eview 需在 `onRowClick` 里自行切换 `expandedRow`（见 2.5） |
| `columnTitle` / `columnWidth` / `expandIcon` / `fixed` / `indentSize` / `rowExpandable` / `showExpandColumn` | — | ❌ 无法映射 | eview 展开列样式/图标/缩进不可定制；`rowExpandable` 用 `disableCheckboxIds` 无关，无对应 |
| `childrenColumnName` | — | ❌ 无法映射 | eview Table 不支持树形数据；用 `TreeTable`（后续批次） |
| `onExpand(expanded, record)` | — | ❌ 无法映射 | eview 无单行展开回调；用 `expandedRow` 受控 + `onRowClick` 判断 |
| `onExpandedRowsChange(expandedRows)` | — | ❌ 无法映射 | eview 无展开变化回调；用 `expandedRow` 受控自管 |

### scroll → 滚动

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `scroll.y` | `maxHeight` / `height` | 改值 | 纵向滚动区域高，像素值 |
| `scroll.x` | `width` | 改值 | 横向滚动；antd 可传 `true`/`'max-content'`，eview 传像素或百分比（见 2.6） |
| `scroll.scrollToFirstRowOnChange` | — | ❌ 无法映射 | eview 无分页后滚顶；翻页时业务自行处理 |

### Table ref

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `nativeElement` | — | ❌ 无法映射 | eview ref 为命令式方法集，无裸 DOM |
| `scrollTo({ index, key, top })` | — | ❌ 无法映射 | eview 无滚动到行方法 |
| — | `ref.getCheckedRowsData()` / `getCheckedRowsIndexes()` / `getSelectedRowData()` / `getSelectedRowIndex()` / `setCheckedRows(keys)` / `getDataset()` / `setRowEditable(id, columns)` | eview 特有 | 命令式取勾选/选中/数据/设勾选/设行可编辑 |

## 2. 处理方式详解

### 2.1 `dataSource + rowKey` → `dataset + keyIndex`（改值）

antd 用 `dataSource`（对象数组）+ `rowKey`（字段名或函数）；eview 用 `dataset`（二维数组或对象数组）+ `keyIndex`（主键所在列序号，number）。

```jsx
// antd
const dataSource = [
  { key: '1', name: '胡彦斌', age: 32 },
];
<Table dataSource={dataSource} rowKey="id" />

// eview —— 对象行：key 与 columns[].key 对应
const rows = list.map((d) => ({ id: d.id, name: d.name, age: d.age }));
<Table dataset={rows} keyIndex={0} />   // 第 0 列（id）作主键
// 不设 keyIndex 则用行号作主键（跨页勾选会错位，建议设）
```

### 2.2 `columns` 字段映射（综合映射）

antd 列用 `dataIndex` 取值；eview 列用 `key` 对应对象行字段名。`title`/`width`/`align`/`ellipsis` 直接对应。

```jsx
// antd
const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '年龄', dataIndex: 'age', align: 'right', sorter: true },
];

// eview
const columns = [
  { title: '姓名', key: 'name', ellipsis: true, tipFormatter: (v) => String(v) },
  { title: '年龄', key: 'age', align: 'right', allowSort: true },
];
// dataIndex → key；sorter → allowSort；非文本列建议加 tipFormatter
```

### 2.3 `pagination` → `enablePagination` + `pagingProps` + `enableAutoPaging`（综合映射）

antd `pagination` 是一个配置对象（或 `false` 关闭）；eview 拆成开关 + 分页器透传 + 前台分页开关。

```jsx
// antd —— 后台分页
<Table pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: [10,20,50], onChange, onShowSizeChange }} />

// eview —— 后台分页：dataset 只传当前页，recordCount 传总数
<Table
  enablePagination
  pagingProps={{
    currentPage: page,
    pageSize,
    recordCount: total,
    pageSizeOptions: [10, 20, 50],
    onPageSizeChange: (size) => { setPageSize(size); setPage(1); },
  }}
  onPageChange={(currentPage) => setPage(currentPage)}
/>

// antd —— 前台分页（传全量数据，组件自己切片）
<Table pagination={{ pageSize: 10 }} dataSource={allRows} />

// eview —— 前台分页
<Table enablePagination enableAutoPaging pageSizeOptions={[10,20,50]} dataset={allRows} />
// enableAutoPaging 时 recordCount 不传，取 dataset.length
```

注：antd `pagination={false}` → eview 不传 `enablePagination`。

### 2.4 `rowSelection` → `enableCheckBox` + `checkType` + `checkedRows` + 回调（综合映射）

```jsx
// antd
<Table
  rowSelection={{
    type: 'checkbox',
    selectedRowKeys: checkedKeys,
    preserveSelectedRowKeys: true,
    getCheckboxProps: (record) => ({ disabled: record.disabled }),
    onChange: (keys, rows) => setCheckedKeys(keys),
    onSelectAll: (selected, rows) => ...,
  }}
/>

// eview
<Table
  enableCheckBox
  checkType="multi"                 // 'single' 对应 antd type="radio"
  checkedRows={checkedIds}         // 主键数组，配合 keyIndex
  preserveCheckedRows              // 跨页保留
  disableCheckboxIds={disabledIds} // 禁勾行主键数组（getCheckboxProps 近似）
  onRowCheck={(row, checkedRows, e) => setCheckedIds(checkedRows)}
  onHeaderCheck={(checkedRows, checked, checkedRowsData) => setCheckedIds(checkedRows)}
/>
// 需要整行数据：tableRef.current.getCheckedRowsData()
```

注：`getCheckboxProps` 只能映射出 `disabled`（落到 `disableCheckboxIds` 主键数组），其他 props（如 `name`/`style`）丢失；`onSelectAll/onSelectInvert/onSelectNone` 无对应，用 `onHeaderCheck` 的 `checkedRows` 判断或外部按钮 + `ref.setCheckedRows([])`。

### 2.5 `expandable` → `enableRowExpand` + `onRowExpend`（综合映射）

```jsx
// antd
<Table
  expandable={{
    expandedRowRender: (record) => <Detail row={record} />,
    expandedRowKeys: openKeys,
    expandRowByClick: true,
    onExpand: (expanded, record) => ...,
  }}
/>

// eview
<Table
  enableRowExpand
  onRowExpend={(row) => <Detail row={row} />}   // 返回展开内容
  expandedRow={openIds}                          // 受控展开行主键数组
  onRowClick={(row, event) => toggleExpand(row)} // 点击行自行切换 expandedRow
/>
```

注：`onRowExpend(row)` 只给 row，无 index/indent/expanded；`onExpand` 无对应，用 `expandedRow` 受控 + `onRowClick` 判断。

### 2.6 `scroll` → `height` / `maxHeight` / `width`（综合映射）

```jsx
// antd
<Table scroll={{ x: 1200, y: 400, scrollToFirstRowOnChange: true }} />

// eview
<Table width={1200} maxHeight={400} />
// scroll.x=true / 'max-content' 无对应，eview 用 width 数值或百分比
// scrollToFirstRowOnChange 无对应，翻页时业务自行处理
```

### 2.7 排序 `sorter` / `sortOrder` / `sortDirections` → `allowSort` / `sort` / `disableEviewSort` / `onColumnSort`（综合映射）

antd 列 `sorter` 排序、`sortOrder` 受控、`sortDirections` 控制升降序集合；eview 列 `allowSort` 是否可排、`sort` 初始态、表级 `disableEviewSort` 关前台排序走后台、`onColumnSort(sortColumn, sortType)` 后台排序回调。

```jsx
// antd —— 后台排序
const columns = [{ title: '年龄', dataIndex: 'age', sorter: true, sortOrder: 'ascend', sortDirections: ['ascend','descend'] }];
<Table onChange={(p, f, sorter) => setSort({ field: sorter.field, order: sorter.order })} />

// eview —— 后台排序：必须关前台排序，否则界面闪两次
const columns = [{ title: '年龄', key: 'age', allowSort: true, sort: 'asc' }];
<Table
  disableEviewSort
  onColumnSort={(sortColumn, sortType) => {
    // sortType: 'asc' | 'desc' | 'origin'
    setSort({ column: sortColumn, type: sortType }); setPage(1);
  }}
/>
```

注：antd `sortOrder: 'ascend'/'descend'` ↔ eview `sort: 'asc'/'desc'`（外加 `'origin'` 原始顺序态，需表级 `enableOriginSort`）。`sortDirections` 无列级对应，用 `allowSort` 开关 + `enableOriginSort` 控制是否允许「原始顺序」态。

### 2.8 `virtual` → `virtualScroll` + `virtualShowNum`（改值）

```jsx
// antd
<Table virtual scroll={{ y: 400 }} />

// eview
<Table virtualScroll virtualShowNum={20} maxHeight={400} />
```

### 2.9 `onChange` 拆分（综合映射）

antd `onChange(pagination, filters, sorter, extra)` 一个回调覆盖分页/排序/筛选；eview 按场景拆成 `onPageChange(currentPage)`、`onColumnSort(sortColumn, sortType)`，无筛选回调（`filters` 与 `extra.action='filter'` 无对应）。

```jsx
// antd
<Table onChange={(pagination, filters, sorter, extra) => {
  if (extra.action === 'paginate') setPage(pagination.current);
  if (extra.action === 'sort') setSort({ field: sorter.field, order: sorter.order });
  if (extra.action === 'filter') setFilters(filters);
}} />

// eview —— 分页与排序各自回调，筛选无对应
<Table
  onPageChange={(currentPage) => setPage(currentPage)}
  onColumnSort={(sortColumn, sortType) => setSort({ column: sortColumn, type: sortType })}
/>
```

### 2.10 `onRow` → `onRowClick` / `onDoubleClick` / `onRowRightClick`（综合映射）

antd `onRow(record, index)` 返回事件 map；eview 直接给回调，**注意参数顺序各不相同**。

```jsx
// antd
<Table onRow={(record, index) => ({
  onClick: (e) => openDetail(record),
  onDoubleClick: (e) => ...,
  onContextMenu: (e) => ...,
})} />

// eview
<Table
  onRowClick={(row, event) => openDetail(row)}         // (row, event)
  onDoubleClick={(evtRow, evtCell, e) => ...}          // (evtRow, evtCell, e)
  onRowRightClick={(event, row) => ...}                // 注意：event 在前，row 在后
/>
```

### 2.11 `render` 签名差异（综合映射）

```jsx
// antd：render(value, record, index)
{ dataIndex: 'state', render: (value, record, index) => <Tag>{value}</Tag> }

// eview：render(cellValue, rowData, options, row, isEdit)
{ key: 'state', render: (cellValue, rowData, options, row) => <Tag>{cellValue}</Tag> }
// cellValue 对应 antd value；rowData 是行数组（顺序=columns）；
// 需要完整对象时用第四参 row；index 无直接对应（可选 options 里取）
```

注：eview 行可以是二维数组（`rowData` 顺序与 columns 一致）或对象（`rowData` 即对象）；推荐对象行，`cellValue` 即 `row[key]`。

### 2.12 `fixed` → `freezeCol` + `freezeColPosition`（改值）

```jsx
// antd
{ title: '操作', fixed: 'right' }
{ title: '名称', fixed: 'left' }

// eview
{ title: '操作', freezeCol: true }            // 冻结该列
// freezeColPosition 控制冻结列位置（表级）
```

## 3. 无法映射的属性与建议处理

### 3.1 `locale`（排序/筛选/空数据文案）

eview 仅 `emptyTableMsg` 映射空数据文案；排序、筛选文案无对应。

```jsx
// antd
<Table locale={{ emptyText: '暂无数据', triggerDesc: '点击降序' }} />

// eview
<Table emptyTableMsg="暂无数据" />
```

### 3.2 列值筛选（`filters` / `filteredValue` / `filterDropdown` / `onFilter` 等）

eview 的 `enableColumnFilter` 是「列显隐」筛选，不是「列值过滤」。antd 的值过滤需在业务层处理。

```jsx
// antd
{
  title: '状态', dataIndex: 'state',
  filters: [{ text: '正常', value: 'normal' }],
  onFilter: (value, record) => record.state === value,
}

// eview —— 后台过滤：筛选条件由业务 state 管理，请求时带上
const [stateFilter, setStateFilter] = useState<string>('');
// 用外部 Select / Tag 组切换 stateFilter → 重新请求
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `bordered` | 自定义 CSS 边框；斑马纹用 `enableZebraCrossing` |
| `size` | `style` 字号 / 固定行高近似 |
| `title` / `footer` / `summary` | 外部 `<div>` 包裹自行渲染 |
| `components` | 无法覆盖；用 `render` 自定义单元格内容 |
| `getPopupContainer` | 无浮层，忽略 |
| `rowClassName` | `onRowClick` + 外部 CSS 选中态 |
| `rowHoverable` | 不可关闭，忽略 |
| `showHeader` | 不可隐藏，忽略 |
| `showSorterTooltip` | 无提示，忽略 |
| `sticky` | 表头固定靠容器 `maxHeight` 滚动 |
| `tableLayout` | 内部管理，忽略 |
| `onHeaderRow` / `onScroll` | 无对应，忽略 |
| `colSpan`（列） | 无表头合并，自定义 render |
| `className`（列） | 用 `style` |
| `minWidth` / `responsive` / `rowScope` / `shouldCellUpdate` / `onCell` / `onHeaderCell`（列） | 无对应，忽略 |
| `checkStrictly` / `columnTitle` / `columnWidth` / `fixed` / `selections` / `hideSelectAll` / `renderCell` / `getTitleCheckboxProps` / `onCell`（rowSelection） | 勾选列样式不可定制；自定义选择项用外部按钮 + `ref.setCheckedRows()` |
| `onSelect` / `onSelectAll` / `onSelectInvert` / `onSelectNone` / `onSelectMultiple` | 用 `onRowCheck` / `onHeaderCheck` 的 `checkedRows` 判断 |
| `childrenColumnName`（expandable） | 树形数据用 `TreeTable`（后续批次） |
| `columnTitle` / `columnWidth` / `expandIcon` / `fixed` / `indentSize` / `rowExpandable` / `showExpandColumn`（expandable） | 展开列样式不可定制 |
| `onExpand` / `onExpandedRowsChange`（expandable） | 用 `expandedRow` 受控自管 |
| `scroll.scrollToFirstRowOnChange` | 翻页时业务自行滚顶 |
| ref `nativeElement` / `scrollTo` | 无对应 |

## 4. 完整示例对照

```jsx
// antd —— 资源列表：后台分页 + 后台排序 + 跨页勾选 + 行展开
<Table
  dataSource={rows}
  rowKey="id"
  columns={[
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '状态', dataIndex: 'state', render: (v) => <Tag>{v}</Tag> },
    { title: 'IP', dataIndex: 'ip', sorter: true },
    { title: '操作', render: (_, r) => <a onClick={() => edit(r)}>编辑</a> },
  ]}
  loading={loading}
  locale={{ emptyText: '暂无设备' }}
  pagination={{ current: page, pageSize, total, pageSizeOptions: [10,20,50], onChange, onShowSizeChange }}
  rowSelection={{ type: 'checkbox', selectedRowKeys: checkedIds, preserveSelectedRowKeys: true, onChange: setCheckedIds }}
  expandable={{ expandedRowRender: (r) => <Detail row={r} /> }}
  scroll={{ y: 500 }}
  onChange={(p, f, sorter) => sorter && setSort({ field: sorter.field, order: sorter.order })}
/>

// eview 等价
<Table
  dataset={rows.map((d) => ({ id: d.id, name: d.name, state: d.state, ip: d.ip, op: null }))}
  keyIndex={0}                                   // id 列作主键
  columns={[
    { title: '名称', key: 'name', ellipsis: true, tipFormatter: (v) => String(v) },
    { title: '状态', key: 'state', allowSort: false, render: (v) => <Tag>{v}</Tag> },
    { title: 'IP', key: 'ip', allowSort: true },
    { title: '操作', key: 'op', allowSort: false, render: (_, __, ___, row) => (
      <Button status="text" text="编辑" onClick={() => edit(row)} />
    )},
  ]}
  enableLoading={loading}                        // loading → enableLoading
  emptyTableMsg="暂无设备"                        // locale.emptyText → emptyTableMsg
  enableCheckBox                                 // rowSelection → enableCheckBox
  checkType="multi"                              // type → checkType
  checkedRows={checkedIds}                       // selectedRowKeys → checkedRows
  preserveCheckedRows                            // preserveSelectedRowKeys → preserveCheckedRows
  onRowCheck={(row, checkedRows) => setCheckedIds(checkedRows)}
  onHeaderCheck={(checkedRows) => setCheckedIds(checkedRows)}
  enablePagination                               // pagination → enablePagination + pagingProps
  pagingProps={{ currentPage: page, pageSize, recordCount: total, pageSizeOptions: [10,20,50], onPageSizeChange: (s) => { setPageSize(s); setPage(1); } }}
  onPageChange={(currentPage) => setPage(currentPage)}
  disableEviewSort                               // 后台排序：关前台排序
  onColumnSort={(sortColumn, sortType) => setSort({ column: sortColumn, type: sortType })}
  enableRowExpand                                // expandable → enableRowExpand
  onRowExpend={(row) => <Detail row={row} />}
  maxHeight={500}                                // scroll.y → maxHeight
/>
```
