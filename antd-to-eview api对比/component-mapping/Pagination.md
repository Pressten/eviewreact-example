# Pagination → Paging 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Pagination` ⇄ eview `Paging`
- 定位差异：两者都是「总数驱动的页码分页器」。命名差异最大：antd 用 `total` + `current` + `pageSize`，eview 用 `recordCount` + `currentPage` + `pageSize`。eview 的每页条数切换是独立回调 `onPageSizeChange`（antd 合并在 `onChange(page, pageSize)` 里），且改每页条数后**业务需自行把页码归 1**（eview 不自动归）。eview 内置已选行数计数（`enableSelectedCount`）、翻页拦截（`enablePageJumpTrigger`，`onPageChange` 返回 `false` 不跳）、窄区域简单分页（`type="select"`），antd 需自行实现。eview **没有** `showTotal` / `showQuickJumper`（用 `enableGoInput`）/ `showSizeChanger`（默认显示）/ `size` / `simple` / `align` / `responsive` / `showLessItems` / `showTitle` / `itemRender` / `hideOnSinglePage`。表格场景优先用 `Table` 自带分页（`enablePagination` + `pagingProps`），独立 `Paging` 用于卡片 / 列表。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `total` | `recordCount` | 直接改名 | 总数据条数；eview 必传 |
| `current` | `currentPage` | 直接改名 | 当前页 |
| `defaultCurrent` | — | ❌ 无法映射 | eview 仅受控 `currentPage`；用 `useState` 初始值近似（见 3.1） |
| `pageSize` | `pageSize` | 直接改名 | |
| `defaultPageSize` | — | ❌ 无法映射 | eview 仅受控 `pageSize`；用 `useState` 初始值近似 |
| `pageSizeOptions` | `pageSizeOptions` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `onChange(page, pageSize)` | `onPageChange(currentPage)` + `onPageSizeChange(pageSize)` | 综合映射 | antd 翻页与改每页条数共用一个回调；eview 拆成两个，且改每页条数需自行归页码（见 2.1） |
| `onShowSizeChange(current, size)` | `onPageSizeChange(pageSize)` | 改名 + 签名调整 | antd 传 `current` + `size`；eview 只传 `pageSize`（见 2.2） |
| `showSizeChanger` | — | ❌ 无法映射 | eview 默认显示每页条数下拉，用 `disableSelect` 禁用下拉近似 `false`（见 3.2） |
| `showQuickJumper` | `enableGoInput` | 改值 | antd `true` → eview `enableGoInput`（默认 `true`，且只在总页数 > 7 时显示跳转框） |
| `showTotal(total, range)` | — | ❌ 无法映射 | eview 无自定义总量文案；用 `enableSelectedCount` / `recordCountDisp` / `pagingCountContent` 近似（见 3.3） |
| `size` (`default` / `small`) | — | ❌ 无法映射 | eview 无尺寸属性；`small` 用 `type="select"` 简单分页近似（语义不同） |
| `simple` | `type="select"` | 改值 | antd 简单分页 → eview `type="select"`（窄区域下拉式），形态不完全一致 |
| `align` | `splitPagination` / `style` | 综合映射 | antd `start` / `center` / `end`；eview `splitPagination` 分到右侧，其余靠 `style` flex 对齐（见 2.3） |
| `responsive` | — | ❌ 无法映射 | eview 无响应式自动调整，忽略 |
| `showLessItems` | — | ❌ 无法映射 | eview 页码折叠策略固定，无法配置 |
| `showTitle` | — | ❌ 无法映射 | eview 无原生 tooltip 开关，忽略 |
| `itemRender` | — | ❌ 无法映射 | eview 无自定义页码结构 |
| `hideOnSinglePage` | — | ❌ 无法映射 | eview 无单页隐藏；自行 `{total <= pageSize ? null : <Paging />}` 条件渲染（见 3.4） |
| — | `recordCountDisp` | eview 特有 | 展示用总数文案（页数仍按 `recordCount` 算） |
| — | `enableGoInput` | eview 特有 | 跳转输入框（默认 `true`，页数 > 7 才显示） |
| — | `enablePageJumpTrigger` | eview 特有 | `onPageChange` 返回 `false` 时不跳转（拦截翻页） |
| — | `disableSelect` | eview 特有 | 仅禁用每页条数下拉 |
| — | `enableSelectedCount` / `selectedCount` / `onSelectedCountClick` | eview 特有 | 已选行数文本 |
| — | `type` (`list` / `select`) | eview 特有 | 完整 / 简单分页 |
| — | `pagingCountContent` / `pageSizeDisp` | eview 特有 | 自定义统计内容 / 显示「条/页」 |
| — | `splitPagination` | eview 特有 | 分页切到右侧 |
| — | `popupDirection` / `selectWidth` / `zindex` | eview 特有 | 每页条数下拉弹出方向 / 宽 / 层级 |

## 2. 处理方式详解

### 2.1 `onChange(page, pageSize)` → `onPageChange` + `onPageSizeChange`（综合映射）

antd 翻页与改每页条数共用 `onChange`；eview 拆成两个回调。**关键：改每页条数后业务需自行把页码归 1**（eview 不自动归）。

```jsx
// antd
<Pagination
  total={100}
  current={page}
  pageSize={pageSize}
  onChange={(page, pageSize) => { setPage(page); setPageSize(pageSize); }}
/>

// eview
<Paging
  recordCount={100}
  currentPage={page}
  pageSize={pageSize}
  onPageChange={(currentPage) => setPage(currentPage)}
  onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}   // 改每页条数归第 1 页
/>
```

> ⚠️ 只写 `onPageSizeChange={(size) => setPageSize(size)}` 不归页码，可能停在越界页。

### 2.2 `onShowSizeChange` → `onPageSizeChange`（改名 + 签名调整）

```jsx
// antd：onShowSizeChange(current, size)
<Pagination onShowSizeChange={(current, size) => setSize(size)} />

// eview：onPageSizeChange(pageSize)，只有 size
<Paging onPageSizeChange={(pageSize) => { setPageSize(pageSize); setPage(1); }} />
```

### 2.3 `align` → `splitPagination` / `style`（综合映射）

```jsx
// antd
<Pagination align="end" />

// eview：分到右侧
<Paging splitPagination />

// antd align="center" / "start"：用 style flex 对齐
<Paging style={{ display: 'flex', justifyContent: 'center' }} />   // center
<Paging style={{ display: 'flex', justifyContent: 'flex-start' }} />  // start
```

## 3. 无法映射的属性与建议处理

### 3.1 `defaultCurrent` / `defaultPageSize`（非受控初始值）

eview 仅受控，用 `useState` 初始值近似：

```jsx
// antd
<Pagination defaultCurrent={2} defaultPageSize={20} total={100} />

// eview
const [page, setPage] = useState(2);
const [pageSize, setPageSize] = useState(20);
<Paging recordCount={100} currentPage={page} pageSize={pageSize} onPageChange={setPage} />
```

### 3.2 `showSizeChanger`（每页条数切换器）

eview 默认显示每页条数下拉。`showSizeChanger={false}` 用 `disableSelect` 禁用下拉近似（下拉仍在但不可点），或只传单一 `pageSizeOptions`：

```jsx
// antd
<Pagination showSizeChanger={false} />

// eview：禁用每页条数下拉
<Paging disableSelect pageSizeOptions={[10]} />
```

### 3.3 `showTotal`（总量文案）

eview 无自定义总量回调，用 `recordCountDisp`（展示文案）/ `enableSelectedCount`（已选计数）/ `pagingCountContent`（自定义统计内容）近似：

```jsx
// antd
<Pagination showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`} />

// eview：recordCountDisp 展示总数文案（不含 range）；range 需自行计算
<Paging
  recordCount={total}
  recordCountDisp={`共 ${total} 条`}
  currentPage={page}
  pageSize={pageSize}
  onPageChange={setPage}
/>
// 或用 pagingCountContent 自定义统计区
<Paging pagingCountContent={<span>{(page-1)*pageSize+1}-{Math.min(page*pageSize, total)} 共 {total} 条</span>} />
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `hideOnSinglePage` | `{total <= pageSize ? null : <Paging ... />}` 条件渲染 |
| `size="small"` | `type="select"` 简单分页近似（形态不同）；或 `style` 缩小 |
| `simple` | `type="select"` |
| `responsive` | 忽略，自行按屏幕宽度切换 `type` |
| `showLessItems` | 忽略，页码折叠固定 |
| `showTitle` | 忽略 |
| `itemRender` | eview 无自定义页码结构，忽略 |

## 4. 完整示例对照

```jsx
// antd
<Pagination
  total={100}
  current={page}
  pageSize={pageSize}
  pageSizeOptions={[10, 20, 50, 100]}
  showSizeChanger
  showQuickJumper
  showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
  disabled={loading}
  onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
  onShowSizeChange={(current, size) => setSize(size)}
/>

// eview 等价
<Paging
  recordCount={100}                              // total → recordCount
  currentPage={page}                             // current → currentPage
  pageSize={pageSize}
  pageSizeOptions={[10, 20, 50, 100]}
  enableGoInput                                  // showQuickJumper → enableGoInput（页数 > 7 才显示）
  disabled={loading}
  recordCountDisp={`共 ${100} 条`}               // showTotal 近似（range 需自行算）
  onPageChange={(currentPage) => setPage(currentPage)}                        // onChange 翻页部分
  onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}             // onChange 改条数 + onShowSizeChange 合并，归第 1 页
/>
// showSizeChanger 默认显示，无需额外属性
```
