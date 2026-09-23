# Tabs → Tab 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Tabs`（含 `TabPane`/`items`） ⇄ eview `Tab`（含 `TabItem`）
- 定位差异：两者都是「平级版块切换容器」。但 eview Tab 是 **children 驱动**（`<Tab><TabItem title="…">内容</TabItem></Tab>`），没有 `items`/`data` 数组属性，业务要自己 `map`。eview 用 `selectedIndex`（number 下标）表达激活页签，antd 用 `activeKey`（string）。切换回调 eview 叫 `onClick(index, title, event)`，不叫 `onChange`。eview `draggable` 默认 **true**，业务页签通常要显式关掉。eview `type` 只有 `main`（一级，默认）和 `sub`（卡片式二级），antd `type` 有 `line`/`card`/`editable-card`。eview **没有** `animated`/`centered`/`size`/`tabBarGutter`/`addIcon`/`renderTabBar`/`indicator` 等样式与渲染定制能力。

## 1. 属性映射表

### Tabs → Tab 主属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `activeKey` | `selectedIndex` | 综合映射 | antd 用 string key；eview 用 number 下标（见 2.1） |
| `defaultActiveKey` | `selectedIndex` | 综合映射 | 初始选中下标；eview 受控统一用 `selectedIndex` |
| `items: [{ key, label, children }]` | `children`（`TabItem`） | 综合映射 | antd 数组驱动；eview children 驱动，业务需 `map` 成 `TabItem`（见 2.2） |
| `type="line"/"card"/"editable-card"` | `type="main"/"sub"` | 改值 | `line`→`main`；`card`/`editable-card`→`sub`（见 2.3） |
| `tabPosition="top"/"right"/"bottom"/"left"` | `position="top"/"right"/"bottom"/"left"` | 直接改名 | 值一致 |
| `onChange(activeKey)` | `onClick(index, title, event)` | 综合映射 | 回调名与签名均不同（见 2.4） |
| `onEdit(targetKey/action, action)` | `onClose(index, event, title)` | 综合映射 | antd 统一 add/remove；eview 只有 close，新增由业务自管数组（见 2.5） |
| `onTabClick(key, event)` | `onClick(index, title, event)` | 综合映射 | 与切换合并；eview 无单独「点击未激活页签」回调 |
| `destroyOnHidden` | `lazyLoad` | 综合映射 | antd `true`=隐藏即销毁；eview `lazyLoad=true`=激活才渲染（语义近似但反向上）（见 2.6） |
| `destroyInactiveTabPane` | `lazyLoad` | 综合映射 | 废弃属性，同上 |
| `tabBarStyle` | `headStyle` | 改值 | 标题区样式 |
| `addIcon` | — | ❌ 无法映射 | eview 无内置新增按钮；外部 `Button` 自管数组 |
| `removeIcon` | — | ❌ 无法映射 | eview 关闭按钮样式不可定制 |
| `animated` | — | ❌ 无法映射 | eview 切换动画不可配置 |
| `centered` | — | ❌ 无法映射 | eview 页签不居中；用 `headStyle` flex 近似 |
| `hideAdd` | — | ❌ 无法映射 | eview 无内置加号 |
| `indicator` | — | ❌ 无法映射 | eview 指示条不可自定义长度/对齐 |
| `more` | — | ❌ 无法映射 | eview 收纳菜单自动处理，不可配置 |
| `popupClassName` | — | ❌ 无法映射 | eview 收纳菜单无 className |
| `renderTabBar` | — | ❌ 无法映射 | eview 标题头不可二次封装 |
| `size` | — | ❌ 无法映射 | eview Tab 无 large/middle/small |
| `tabBarExtraContent` | — | ❌ 无法映射 | eview 标题区无额外内容槽；用外部布局包 `Tab`（页签内 `titleExtraContent` 见 TabItem） |
| `tabBarGutter` | — | ❌ 无法映射 | eview 页签间距不可调 |
| `onTabScroll({ direction })` | — | ❌ 无法映射 | eview 无滚动回调 |
| — | `draggable` | eview 特有 | 可拖拽排序，默认 true；`ondragEnd(nodeAfterDrag[], event)` 拿新顺序 |
| — | `lazyLoad` | eview 特有 | 激活时才渲染内容 |
| — | `isUpdateContent` | eview 特有 | 非 lazyLoad 时切换是否更新内容区 |
| — | `disabled` / `hover` | eview 特有 | 全部禁用 / hover 切换 |
| — | `isShowCloseBtns` | eview 特有 | 显示「关闭选中/其他/所有」按钮 |
| — | `isAutoClose` | eview 特有 | 页签自动关闭（语义待实测） |
| — | `isCloseByTabIds` / `onBeforeClose(tabIds)` / `onCloseByTabIds(tabIds, buttonIdentify)` | eview 特有 | 由外部元素批量关闭页签 |
| — | `onlyHideNone` | eview 特有 | 收纳项是否只显示被隐藏的标题 |
| — | `headStyle` / `tabContentStyle` / `tabContentClassName` | eview 特有 | 标题区 / 内容区样式 |
| — | `observerWidthChange` / `observerTabItemChange` | eview 特有 | 监听宽度变化重渲染 |

### TabItemType → TabItem

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `key` | `key` / `id` | 直接改名 | |
| `label` | `title` | 改值 | antd 用 `label`；eview 用 `title` |
| `children` | `children` | 直接改名 | |
| `disabled` | `disabled` | 直接改名 | |
| `closable` | `closable` | 直接改名 | |
| `icon` | `icon` | 改值 | antd 接 ReactNode；eview 接 string（icon+ 名）或 ReactElement |
| `closeIcon` | — | ❌ 无法映射 | eview 关闭图标不可自定义；用 `closable` 开关 |
| `destroyOnHidden` / `destroyInactiveTabPane` | `lazyLoad`（表级） | 综合映射 | 见 2.6 |
| `forceRender` | `lazyLoad={false}` | 综合映射 | antd `forceRender=true` 强制渲染；eview 默认即全部渲染（`lazyLoad` 默认 false），取反 |
| — | `titleExtraContent` | eview 特有 | 标题自定义内容（如计数徽标） |
| — | `itemTip` | eview 特有 | 标题悬浮提示 |
| — | `setEditing` / `tabItemStyle` / `id` | eview 特有 | 编辑态 / 标题样式 |

### MoreProps（antd `more`）

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `more.icon` | — | ❌ 无法映射 | eview 收纳图标不可定制 |
| `more`（DropdownProps） | — | ❌ 无法映射 | eview 收纳菜单属性不可透传 |

## 2. 处理方式详解

### 2.1 `activeKey` → `selectedIndex`（综合映射）

antd 用 string key，eview 用 number 下标。需维护 key→index 映射。

```js
// antd：activeKey="tab2"
// eview：找 key 在 items 里的下标
const items = [{ key: 't1', label: '概览' }, { key: 't2', label: '监控' }];
const activeIndex = items.findIndex((i) => i.key === activeKey);
// <Tab selectedIndex={activeIndex}>
```

### 2.2 `items` 数组 → `TabItem` children（综合映射）

```jsx
// antd
<Tabs items={[
  { key: 't1', label: '概览', children: <Overview /> },
  { key: 't2', label: '监控', children: <Monitor /> },
]} activeKey={key} onChange={setKey} />

// eview —— 业务自己 map 成 TabItem
<Tab selectedIndex={activeIndex} draggable={false} onClick={(i) => setKey(items[i].key)}>
  {items.map((it) => (
    <TabItem key={it.key} title={it.label}>
      {it.children}
    </TabItem>
  ))}
</Tab>
```

### 2.3 `type` 改值

```js
// antd type → eview type
// 'line'           → 'main'（默认）
// 'card'           → 'sub'
// 'editable-card'  → 'sub'（可关闭，配合 TabItem closable）
```

### 2.4 `onChange` → `onClick`（综合映射）

```jsx
// antd：onChange(activeKey: string)
<Tabs onChange={(k) => setKey(k)} />

// eview：onClick(index: number, title: string, event)
<Tab onClick={(index, title, event) => setKey(items[index].key)} />
// 多一参 title 和 event；如只关心下标可直接 setIndex(index)
```

### 2.5 `onEdit` → `onClose`（综合映射）

antd `onEdit(action === 'add' ? event : targetKey, action)` 统一新增/删除；eview 只有 `onClose(index, event, title)`，新增由业务自管数组。**注意 onClick/onClose 第二、三参顺序不同。**

```jsx
// antd —— editable-card
<Tabs type="editable-card" onEdit={(targetKeyOrEvent, action) => {
  if (action === 'add') addTab();
  if (action === 'remove') removeTab(targetKey);
}} />

// eview —— type="sub" + closable
<Tab
  type="sub"
  draggable={false}
  onClose={(index, event, title) => {           // 注意：index 在前
    setTabs((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((cur) => (cur >= index && cur > 0 ? cur - 1 : cur));
  }}
>
  {tabs.map((t) => <TabItem key={t.id} title={t.title} closable>{t.content}</TabItem>)}
</Tab>
```

### 2.6 `destroyOnHidden` → `lazyLoad`（综合映射）

antd `destroyOnHidden=true` 表示隐藏即销毁 DOM；eview `lazyLoad=true` 表示激活时才渲染（隐藏即不渲染）。语义近似但触发方向相反。

```jsx
// antd：隐藏即销毁
<Tabs destroyOnHidden />

// eview：激活才渲染（等价于隐藏不渲染）
<Tab lazyLoad>
```

## 3. 无法映射的属性与建议处理

### 3.1 样式与渲染定制（`animated`/`centered`/`size`/`tabBarGutter`/`indicator` 等）

eview Tab 不提供这些样式开关，需用 CSS 近似。

```jsx
// antd
<Tabs size="large" centered animated={false} tabBarGutter={16} />

// eview —— 用 headStyle 近似
<Tab headStyle={{ '--tab-gap': '16px' }} />
// size/centered/animated 无对应，忽略或自定义 CSS
```

### 3.2 标题区额外内容（`tabBarExtraContent`）

eview 标题区无额外内容槽；`tabBarExtraContent` 用外部布局包裹近似。单个页签的额外内容用 `TabItem.titleExtraContent`。

```jsx
// antd
<Tabs tabBarExtraContent={{ right: <Button>刷新</Button> }} />

// eview —— 外部布局
<div style={{ display: 'flex', alignItems: 'center' }}>
  <Tab style={{ flex: 1 }}>…</Tab>
  <Button text="刷新" onClick={reload} />
</div>
// 或页签级：<TabItem title="告警" titleExtraContent={<span className="badge">3</span>}>…</TabItem>
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `addIcon` / `hideAdd` | 外部 `Button` 自管数组新增 |
| `removeIcon` / `closeIcon` | 关闭图标不可定制；用 `closable` 开关 |
| `animated` | 忽略 |
| `centered` | `headStyle` flex 近似 |
| `indicator` | 忽略 |
| `more` / `popupClassName` | 收纳菜单自动处理，不可配 |
| `renderTabBar` | 不可二次封装 |
| `size` | 忽略或 CSS 字号 |
| `tabBarExtraContent` | 外部布局包裹 |
| `tabBarGutter` | CSS 间距近似 |
| `onTabScroll` | 无对应，忽略 |
| `onTabClick` | 与 `onClick` 合并，无单独「点击未激活」回调 |

## 4. 完整示例对照

```jsx
// antd —— 详情页多版块 + 可关闭工作区页签
const [activeKey, setActiveKey] = useState('overview');
<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    { key: 'overview', label: '概览', children: <Overview /> },
    { key: 'config', label: '配置', children: <Config /> },
    { key: 'monitor', label: '监控', children: <Monitor /> },
  ]}
/>

// eview 等价
const [activeIndex, setActiveIndex] = useState(0);
const items = [
  { key: 'overview', label: '概览', children: <Overview /> },
  { key: 'config', label: '配置', children: <Config /> },
  { key: 'monitor', label: '监控', children: <Monitor /> },
];
<Tab
  selectedIndex={activeIndex}
  draggable={false}                    // 业务页签关掉拖拽
  onClick={(index) => setActiveIndex(index)}
>
  {items.map((it) => (
    <TabItem key={it.key} title={it.label}>
      {it.children}
    </TabItem>
  ))}
</Tab>
```
