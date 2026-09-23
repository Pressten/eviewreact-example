# Breadcrumb → Crumbs 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Breadcrumb` ⇄ eview `Crumbs`
- 定位差异：两者都是「面包屑路径导航」。但 antd `Breadcrumb` 用 `items` 数组 + 可选 `itemRender` 自定义渲染（常与 react-router 配合），每项有独立 `onClick`；eview `Crumbs` 用 `data` 数组驱动，**只有组件级一个 `onClick(data, event)`**（不是每项自己的 onClick），且用 `url` 字段标记可点（有 `url` 才可点，最后一项省略）。eview 无 `itemRender` / `params` / `path` 拼接 / `menu` 下拉 / `dropdownProps` 等能力。分隔符属性拼写是 **`seprator`**（官方如此，非 `separator`）。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `items` | `data` | 综合映射 | 字段名映射：`title` → `title`，`href`/`path` → `url`（见 2.1） |
| `separator` | `seprator` | 改名 | 拼写不同（eview 官方即 `seprator`）；eview 仅收 string，antd 收 ReactNode |
| `items[].title` | `data[].title` | 直接改名 | |
| `items[].href` | `data[].url` | 改名 | 链接目标字段重命名 |
| `items[].path` | `data[].url` | 综合映射 | antd `path` 用于拼接路径；eview `url` 为完整跳转地址（见 2.1） |
| `items[].onClick` | `onClick` | 综合映射 | antd 每项独立 onClick → eview 组件级 `onClick(data, event)`（见 2.2） |
| `itemRender` | — | ❌ 无法映射 | eview 无自定义渲染函数，用 `onClick` + 路由 `navigate` 替代（见 3.1） |
| `params` | — | ❌ 无法映射 | eview 无路由参数概念 |
| `items[].className` | `itemStyle` / `className` | 综合映射 | antd 每项 class → eview `itemStyle`（见 3.2） |
| `items[].menu` | — | ❌ 无法映射 | eview 无下拉菜单配置 |
| `items[].dropdownProps` | — | ❌ 无法映射 | eview 无下拉菜单 |
| `SeparatorType`（`type: 'separator'`） | — | ❌ 无法映射 | eview 用单一 `seprator` 统一分隔，无独立分隔项 |
| `classNames` | — | ❌ 无法映射 | 改用 `className` / `itemStyle` |
| `styles` | — | ❌ 无法映射 | 改用 `style` / `itemStyle` |
| — | `title` | eview 特有 | 面包屑前标题（如"当前位置"），antd 无 |
| — | `splitIcon` | eview 特有 | 自定义分隔图标（icon+ 组件），antd 用 `separator` |
| — | `countLimit` | eview 特有 | 超过则折叠为下拉，默认 6 |
| — | `itemTip` | eview 特有 | 悬浮显示项文本提示 |
| — | `data[].enable` | eview 特有 | 是否禁用某项 |
| — | `data[].icon` | eview 特有 | 项图标（icon+ 组件或图片 url） |
| — | `data[].id` | eview 特有 | 便于 `onClick` 识别 |

## 2. 处理方式详解

### 2.1 `items` → `data`（综合映射）

字段名映射：`title` 一致；`href` 或 `path` → `url`（取 `href` 优先，无则用 `path`）。最后一项（当前页）不传 `url`。

```js
function toEviewData(items) {
  return items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const data = { title: item.title };
    if (!isLast && (item.href || item.path)) {
      data.url = item.href || item.path;
    }
    return data;
  });
}
```

```jsx
// antd
<Breadcrumb items={[{ title: '首页', href: '/' }, { title: '用户管理', href: '/users' }, { title: '编辑' }]} />

// eview
<Crumbs data={[{ title: '首页', url: '/' }, { title: '用户管理', url: '/users' }, { title: '编辑' }]} />
// 最后一项不传 url，即当前页
```

### 2.2 `items[].onClick` → 组件级 `onClick`（综合映射）

antd 每项独立 `onClick(e)`；eview 只有一个组件级 `onClick(data, event)`，通过回传的 `data` 识别点击项。

```jsx
// antd
<Breadcrumb items={[
  { title: '首页', href: '/', onClick: (e) => navigate('/') },
  { title: '用户管理', href: '/users', onClick: (e) => navigate('/users') },
  { title: '编辑' },
]} />

// eview
<Crumbs
  data={[
    { id: 'home', title: '首页', url: '/' },
    { id: 'users', title: '用户管理', url: '/users' },
    { title: '编辑' },
  ]}
  onClick={(item, event) => {
    event?.preventDefault?.();
    navigate(item.url);    // 用 data.url 跳转
  }}
/>
```

## 3. 无法映射的属性与建议处理

### 3.1 `itemRender`（自定义渲染）

eview 无自定义渲染函数，与 react-router 集成时用 `onClick` + `navigate` 替代。

```jsx
// antd：与 react-router 配合
const itemRender = (route, params, items, paths) => {
  const isLast = route.path === items[items.length - 1].path;
  return isLast ? <span>{route.title}</span> : <Link to={`/${paths.join('/')}`}>{route.title}</Link>;
};
<Breadcrumb itemRender={itemRender} items={items} />

// eview：用 onClick + navigate
<Crumbs
  data={items.map((i) => ({ title: i.title, url: i.path }))}
  onClick={(item, event) => {
    event?.preventDefault?.();
    navigate(item.url);
  }}
/>
```

### 3.2 `items[].className` / `items[].menu` / `items[].dropdownProps`

eview 无每项 class、无下拉菜单。每项样式用 `itemStyle`；下拉折叠用 `countLimit` 自动实现。

```jsx
// antd：某项带下拉菜单
<Breadcrumb items={[{ title: '首页', href: '/', menu: { items: [...] } }]} />

// eview：无下拉菜单，改用 countLimit 折叠或忽略
<Crumbs data={[{ title: '首页', url: '/' }]} countLimit={6} />
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `params` | 忽略，路由参数在 `onClick` 里自行处理 |
| `SeparatorType`（`type: 'separator'`） | 用 `seprator` 统一分隔符 |
| `classNames` / `styles` | `className` / `style` / `itemStyle` |

## 4. 完整示例对照

```jsx
// antd
<Breadcrumb
  separator="/"
  items={[
    { title: '首页', href: '/' },
    { title: '系统管理', href: '/system' },
    { title: '用户管理', href: '/system/users' },
    { title: '编辑用户' },
  ]}
/>

// eview 等价
<Crumbs
  seprator="/"              // separator → seprator（注意拼写）
  data={[
    { title: '首页', url: '/' },                 // href → url
    { title: '系统管理', url: '/system' },
    { title: '用户管理', url: '/system/users' },
    { title: '编辑用户' },                        // 最后一项不传 url
  ]}
  onClick={(item, event) => {
    event?.preventDefault?.();
    navigate(item.url);     // itemRender 的路由跳转改用 onClick
  }}
/>
```
