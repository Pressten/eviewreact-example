# Divider → Divider 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Divider` ⇄ eview `Divider`
- 定位差异：两者都是「内容分割线」，支持水平 / 垂直、虚线、带标题文字。但 eview Divider 的线型只用一个布尔 `dashed` 表达，antd 另有 `variant`（`dashed` / `dotted` / `solid`）能区分点线；eview 标题位置用 `orientation`（`left` / `right` / `center`），antd 用同名 `orientation` 但取值为 `start` / `end` / `center`，且 antd 还有 `orientationMargin` / `plain` / `size` 三个 eview 不具备的属性，迁移时需降级或丢弃。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `children` | `children` | 直接改名 | 标题内容，两者一致 |
| `className` | `className` | 直接改名 | |
| `style` | `style` | 直接改名 | |
| `type="horizontal"/"vertical"` | `type="horizontal"/"vertical"` | 直接改名 | 取值与默认值均一致 |
| `dashed` | `dashed` | 直接改名 | 布尔，两者一致 |
| `variant="dashed"/"dotted"/"solid"` | `dashed` | 综合映射 | `variant` 三态压缩为布尔 `dashed`，`dotted` 样式丢失（见 2.1） |
| `orientation="start"/"end"/"center"` | `orientation="left"/"right"/"center"` | 改值 | `start`→`left`、`end`→`right`、`center` 不变（见 2.2） |
| `orientationMargin` | — | ❌ 无法映射 | eview 无标题边距属性，改用 `style` 调整（见 3.1） |
| `plain` | — | ❌ 无法映射 | eview 无普通正文样式开关，改用 `style` 覆盖标题字号 / 颜色（见 3.2） |
| `size="small"/"middle"/"large"` | — | ❌ 无法映射 | eview 无间距尺寸，改用 `style` 的 margin 控制（见 3.3） |
| — | `id` | eview 特有 | antd Divider 未在 API 表暴露 id（属通用属性），eview 显式支持最外层容器 id |

## 2. 处理方式详解

### 2.1 `variant` → `dashed`（综合映射）

antd `variant` 是三值枚举（`solid` / `dashed` / `dotted`），eview 只有一个布尔 `dashed`。规则：非 `solid` 即为虚线。

```js
function toEviewDashed(variant = 'solid') {
  // dashed / dotted → true；solid → false
  return variant !== 'solid';
}
```

```jsx
// antd
<Divider variant="dotted">标题</Divider>

// eview（dotted 样式丢失，退化为普通虚线）
<Divider dashed>标题</Divider>
```

注：若必须保留点线视觉，需在 `style` 中自行覆盖 `borderStyle: 'dotted'`。

### 2.2 `orientation` 取值改写（改值）

antd 用 `start` / `end` / `center`，eview 用 `left` / `right` / `center`，方向语义一致仅命名不同。

```jsx
// antd
<Divider orientation="start">基本信息</Divider>
<Divider orientation="end">高级配置</Divider>

// eview
<Divider orientation="left">基本信息</Divider>
<Divider orientation="right">高级配置</Divider>
```

映射表：

| antd | eview |
| --- | --- |
| `start` | `left` |
| `end` | `right` |
| `center` | `center` |

## 3. 无法映射的属性与建议处理

### 3.1 `orientationMargin`（标题与边框距离）

eview 无此属性，标题边距只能通过 `style` 在外层或标题元素上近似：

```jsx
// antd
<Divider orientation="start" orientationMargin={24}>标题</Divider>

// eview 近似：orientation 已用 left，边距靠 style 模拟
<Divider orientation="left" style={{ paddingInline: 24 }}>标题</Divider>
```

### 3.2 `plain`（普通正文样式）

eview 无 `plain` 开关，标题默认即为加粗强调样式；要弱化为普通正文，覆盖标题样式：

```jsx
// antd
<Divider plain>标题</Divider>

// eview：用 children 包裹 span 并覆盖样式
<Divider>
  <span style={{ fontWeight: 'normal', color: 'rgba(0,0,0,0.65)' }}>标题</span>
</Divider>
```

### 3.3 `size`（间距大小）

eview 无 `size`，上下间距靠 `style.margin` 控制：

```jsx
// antd
<Divider size="small" />
<Divider size="large" />

// eview
<Divider style={{ margin: '8px 0' }} />   {/* small */}
<Divider style={{ margin: '24px 0' }} />  {/* large */}
```

近似对照：

| antd `size` | 建议 margin |
| --- | --- |
| `small` | `8px 0` |
| `middle` | `16px 0`（默认） |
| `large` | `24px 0` |

## 4. 完整示例对照

```jsx
// antd
<Divider
  type="horizontal"
  variant="dashed"
  orientation="start"
  orientationMargin={16}
  plain
  size="large"
>
  高级配置
</Divider>

// eview 等价
// variant=dashed → dashed；start → left；
// size/orientationMargin/plain 无对应，分别用 style.margin / style.paddingInline / children span 近似
<Divider
  type="horizontal"
  dashed
  orientation="left"
  style={{ margin: '24px 0', paddingInline: 16 }}
>
  <span style={{ fontWeight: 'normal', color: 'rgba(0,0,0,0.65)' }}>
    高级配置
  </span>
</Divider>
```
