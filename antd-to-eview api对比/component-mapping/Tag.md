# Tag → Tag 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Tag`（含 `Tag.CheckableTag`） ⇄ eview `Tag`
- 定位差异：两者都是「关键词/状态/分类的小标签」。但 eview Tag 用 `color`（六种语义色：`default`/`primary`/`success`/`warning`/`caution`/`danger`）+ `fill`（`solid` 实心/`outline` 描边）表达外观，antd 用 `color`（任意色值或预设色名如 `green`/`red`）+ `bordered`。eview Tag **没有 `closable`/`onClose`/`closeIcon`**（antd 最常用的可关闭标签在这里不存在），也没有 `Tag.CheckableTag` 子组件。可选中筛选标签在 eview 用 `onClick` + `fill` 切换表达。eview 额外有 `isMessageTag`（信息标签）+ `hasIcon`/`iconName` 图标能力。

## 1. 属性映射表

### Tag

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `color` | `color` | 综合映射 | antd 接收预设色名（`green`/`red`/`blue`…）或任意色值；eview 只认六种语义色或自定义 `style`，需做色名映射（见 2.1） |
| `icon` | `isMessageTag` + `hasIcon` + `iconName` | 综合映射 | antd 直接放 ReactNode 图标在文字前；eview 需开 `isMessageTag` + `hasIcon` + `iconName`（见 2.2） |
| `bordered` | `fill` | 综合映射 | antd `bordered=true`(默认) 有边框；eview 用 `fill="outline"` 描边 / `"solid"` 实心，语义不同需综合（见 2.3） |
| `closeIcon` | — | ❌ 无法映射 | eview Tag 无关闭图标（见 3.1） |
| `onClose(e)` | — | ❌ 无法映射 | eview Tag 无关闭回调（见 3.1） |
| — | `fill` | eview 特有 | `'solid'`(默认)/`'outline'` 实心/描边 |
| — | `round` | eview 特有 | 圆角，默认 true |
| — | `size` | eview 特有 | `'small'`/`'normal'`(默认)/`'large'` |
| — | `onClick(e)` | eview 特有 | 点击回调（可替代 CheckableTag） |
| — | `isMessageTag` / `hasIcon` / `iconName` / `tagIconProps` | eview 特有 | 信息标签 + 图标 |
| — | `style` | eview 特有 | 自定义 `{ color, background, borderColor, borderRadius, border }`（分类标签用法） |

### Tag.CheckableTag

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `checked` | `fill` | 综合映射 | antd `checked=true` 选中；eview 用 `fill="solid"` 选中 / `"outline"` 未选（见 2.4） |
| `onChange(checked)` | `onClick(e)` | 综合映射 | antd 给新 checked；eview 给 event，需业务自管选中态（见 2.4） |
| `icon` | `isMessageTag` + `hasIcon` + `iconName` | 综合映射 | 同 Tag `icon` |
| — | `color` | eview 特有 | CheckableTag 用 `color="primary"` + `fill` 切换 |

## 2. 处理方式详解

### 2.1 `color` 色名映射（综合映射）

antd `color` 接收预设色名（`green`/`red`/`blue`/`orange`/`success`/`processing`/`error`/`warning`/`default` 等）或任意 CSS 色值；eview `color` 只认六种语义色，其余需用 `style` 自定义。

```js
// antd 预设色名 → eview 语义色
const COLOR_MAP = {
  // 语义
  success: 'success', processing: 'primary', error: 'danger',
  warning: 'warning', default: 'default',
  // 色名
  green: 'success', blue: 'primary', red: 'danger',
  orange: 'warning', yellow: 'warning',
  purple: 'primary', cyan: 'primary', geekblue: 'primary',
  magenta: 'primary', volcano: 'danger', gold: 'warning',
  lime: 'success',
};

function toEviewColor(antdColor) {
  if (!antdColor) return 'default';
  const mapped = COLOR_MAP[antdColor];
  if (mapped) return mapped;
  // 任意色值（#fff / rgb / named）→ 用 style 自定义，color 留 default
  return 'default'; // 配合 style={{ color, background, borderColor }}
}
```

```jsx
// antd
<Tag color="green">正常</Tag>
<Tag color="#f50">自定义</Tag>

// eview
<Tag color="success">正常</Tag>
<Tag color="default" style={{ color: '#fff', background: '#f50', border: 'none' }}>自定义</Tag>
```

### 2.2 `icon` → `isMessageTag` + `hasIcon` + `iconName`（综合映射）

antd 直接把 `icon`（ReactNode）放文字前；eview 需开 `isMessageTag` 信息标签样式 + `hasIcon` + `iconName`。

```jsx
// antd
import { CheckCircleOutlined } from '@ant-design/icons';
<Tag icon={<CheckCircleOutlined />} color="success">已认证</Tag>

// eview
import { IconPlusIcPublicAbout } from '@nce/icon-plus';
<Tag isMessageTag hasIcon iconName={<IconPlusIcPublicAbout />} color="success">已认证</Tag>
// iconName 接 string（icon+ 名）或 ReactElement
```

### 2.3 `bordered` → `fill`（综合映射）

antd `bordered`(默认 true) 控制是否有边框；eview `fill` 控制实心/描边。语义不完全一致：antd `bordered=false` 是无边框实心，eview `fill="outline"` 是有边框描边。

```js
// antd bordered → eview fill
// bordered=true (默认) → 'solid'（实心无边框，近似）或 'outline'（描边有边框）
// bordered=false          → 'solid'（实心无边框）
// 结论：antd 默认 bordered=true 行为接近 eview fill="solid"；
// 想要描边边框效果用 fill="outline"。
```

```jsx
// antd：描边效果
<Tag bordered>标签</Tag>

// eview：用 fill="outline" 表达描边
<Tag fill="outline">标签</Tag>
```

### 2.4 `Tag.CheckableTag` → `Tag` + `fill` 切换（综合映射）

eview 无 CheckableTag 子组件，用 `onClick` + `fill` 切换选中态。

```jsx
// antd
const [checked, setChecked] = useState(false);
<Tag.CheckableTag checked={checked} onChange={setChecked}>筛选项</Tag.CheckableTag>

// eview
const [selected, setSelected] = useState<Set<string>>(new Set());
const toggle = (key) => {
  setSelected((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
};

{filters.map((f) => (
  <Tag
    key={f.key}
    color="primary"
    fill={selected.has(f.key) ? 'solid' : 'outline'}  // 选中实心 / 未选描边
    onClick={() => toggle(f.key)}
    style={{ marginRight: 8, cursor: 'pointer' }}
  >
    {f.text}
  </Tag>
))}
// onChange(checked) → onClick(e)，需业务自管选中集合
```

## 3. 无法映射的属性与建议处理

### 3.1 `closeIcon` / `onClose`（可关闭标签）

eview Tag **没有 `closable`/`onClose`/`closeIcon`**。需要可删除标签列表时，用业务数组 + `onClick` 或旁边放删除按钮自己实现。

```jsx
// antd
<Tag closable onClose={(e) => { e.preventDefault(); remove(tag); }}>
  {tag}
</Tag>

// eview —— 用数组 + 点击移除
const [tags, setTags] = useState<string[]>(['标签1', '标签2']);
{tags.map((t) => (
  <Tag
    key={t}
    isMessageTag
    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
    style={{ marginRight: 8, cursor: 'pointer' }}
  >
    {t} ×
  </Tag>
))}
```

### 3.2 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `closeIcon` | 无关闭按钮，用文字后缀「×」+ `onClick` 移除 |
| `onClose` | 用 `onClick` 业务自管数组 |
| `bordered` | 用 `fill="outline"` 近似描边；`bordered=false` 用 `fill="solid"` |
| `Tag.CheckableTag` | 用 `Tag` + `fill` 切换 + `onClick` 自管选中态 |
| 预设色名（`green`/`red`…） | 映射到六种语义色，或用 `style` 自定义 |

## 4. 完整示例对照

```jsx
// antd —— 状态标签 + 可关闭标签组 + 可选中筛选
<Tag color="green" icon={<CheckCircleOutlined />}>正常</Tag>
<Tag color="red">紧急</Tag>
<Tag closable onClose={(e) => { e.preventDefault(); remove(t); }}>{t}</Tag>
<Tag.CheckableTag checked={on} onChange={setOn}>筛选项</Tag.CheckableTag>

// eview 等价
<Tag color="success" isMessageTag hasIcon iconName={<IconPlusIcPublicAbout />}>正常</Tag>
<Tag color="danger">紧急</Tag>
<Tag isMessageTag onClick={() => setTags((prev) => prev.filter((x) => x !== t))} style={{ cursor: 'pointer' }}>{t} ×</Tag>
<Tag color="primary" fill={on ? 'solid' : 'outline'} onClick={() => setOn(!on)} style={{ cursor: 'pointer' }}>筛选项</Tag>
```
