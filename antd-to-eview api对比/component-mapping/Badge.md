# Badge → Badge 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Badge` ⇄ eview `Badge`
- 定位差异：两者都是「右上角标记 / 状态点」。但 antd `Badge` 用 `count` 表数字、`overflowCount` 表封顶、`size` 表圆点大小、`color` 自定义圆点颜色、`status` 含 `processing`（蓝色脉冲）；eview `Badge` 用 `content` 表内容、`max` 表封顶、**无 `size` / `color`**、`status` 用 `off` 表灰态且无脉冲态。eview `Badge` 独立使用时（不包裹子元素）即状态点模式，与 antd 一致。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `count` | `content` | 改名 | antd 收 ReactNode；eview 收 `ReactNode \| string \| number` |
| `dot` | `dot` | 直接改名 | |
| `overflowCount` | `max` | 改名 | 默认均为 `99` |
| `showZero` | `showZero` | 直接改名 | |
| `status` | `status` | 改值 | 值映射：`processing` 无对应（见 2.1） |
| `text` | `text` | 直接改名 | 状态点旁文字，需先设 `status` |
| `offset` | `offset` | 直接改名 | 均为 `[number, number]` |
| `color` | `badgeStyle` | 综合映射 | antd 自定义圆点颜色 → eview 用 `badgeStyle` 的 `background`（见 2.2） |
| `size` | — | ❌ 无法映射 | eview 无圆点大小（default/small） |
| `title` | — | ❌ 无法映射 | eview 无 hover title，可用 `tipText` 近似（见 3.1） |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，用 `badgeClassName` |
| `styles` | — | ❌ 无法映射 | 用 `badgeStyle` |
| `Badge.Ribbon` | — | ❌ 无法映射 | eview 无缎带组件（见 3.2） |
| — | `content` | eview 特有 | antd `count` 改名而来 |
| — | `badgeClassName` / `badgeStyle` | eview 特有 | 徽标本身样式 |
| — | `children` | eview 特有 | 被包裹元素；不传即独立使用 |

## 2. 处理方式详解

### 2.1 `status` 值映射（改值）

antd 五值 → eview 五值，`processing`（蓝色脉冲）无对应，降级为 `default`。

```js
function toEviewStatus(status) {
  switch (status) {
    case 'success':    return 'success';
    case 'error':      return 'error';
    case 'warning':    return 'warning';
    case 'default':    return 'default';
    case 'processing': return 'default';   // 无脉冲态，降级
    default: return 'default';
  }
}
```

注：eview 额外有 `off`（灰态 / 已停止），antd 无直接对应，可按业务状态映射（如 `stopped` → `off`）。

### 2.2 `color` → `badgeStyle`（综合映射）

antd `color` 直接设圆点颜色；eview 无 `color` 属性，需用 `badgeStyle.background`。

```jsx
// antd
<Badge color="#52c41a" />

// eview
<Badge dot status="success" badgeStyle={{ background: '#52c41a' }} />
// 注意：需配合 dot 或 status 才能显示圆点
```

## 3. 无法映射的属性与建议处理

### 3.1 `size` / `title`

eview 无圆点大小，无 hover title。

```jsx
// antd
<Badge count={5} size="small" title="5 条未读" />

// eview：size 忽略；title 用 tipText 近似（无此属性时忽略）
<Badge content={5} title="5 条未读" />   // title 在 eview 是 data 字段，不是 Badge 属性
// Badge 本身无 tooltip，需外层包 Tooltip 或忽略
```

### 3.2 `Badge.Ribbon`（缎带）

eview 无缎带组件，需自行实现（绝对定位 + 旋转样式）。

```jsx
// antd
<Badge.Ribbon text="Hot" color="red">
  <Card>商品</Card>
</Badge.Ribbon>

// eview：自行实现缎带
<div style={{ position: 'relative' }}>
  <Card>商品</Card>
  <div style={{
    position: 'absolute', top: 0, right: -8, background: 'red', color: '#fff',
    padding: '2px 8px', transform: 'rotate(45deg)'
  }}>Hot</div>
</div>
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `classNames` / `styles` | `badgeClassName` / `badgeStyle` |
| `size` | 忽略，无大小配置 |
| `title` | 外层包 Tooltip 或忽略 |

## 4. 完整示例对照

```jsx
// antd
<Badge count={unread} overflowCount={99} showZero offset={[10, 10]}>
  <Button>消息</Button>
</Badge>

// eview 等价
<Badge
  content={unread}            // count → content
  max={99}                    // overflowCount → max
  showZero                    // 直接改名
  offset={[10, 10]}           // 直接改名
>
  <Button text="消息" />
</Badge>
```
