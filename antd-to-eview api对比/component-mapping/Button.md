# Button → Button 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Button` ⇄ eview `Button`
- 定位差异：两者都是「点一下做一件事」的按钮。但 eview Button 用 `status`（字符串）表达主/次/危险/纯文字，antd 用 `type`（字符串）+ `danger`（布尔）两个属性组合表达。eview Button **没有 loading / block / ghost / shape / href** 等能力，处理中状态需用 `disabled` + 文案切换表达。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `type="primary"` | `status="primary"` | 改值 | type → status，值 primary 一致 |
| `type="default"` | `status="default"` | 改值 | |
| `type="text"` | `status="text"` | 改值 | |
| `type="dashed"` | — | ❌ 无法映射 | eview 无虚线按钮，需自行样式实现描边 |
| `type="link"` | — | ❌ 无法映射 | eview 无链接按钮，可用 `status="text"` + onClick 跳转或外层包 `<a>` |
| `danger` | `status="risk"` | 综合映射 | `danger` 是布尔、`status` 是字符串，需与 `type` 综合为单一 `status`（见 2.1） |
| `size="large"/"middle"/"small"` | `size="large"/"normal"/"small"` | 改值 | `middle` → `normal` |
| `disabled` | `disabled` | 直接改名 | |
| `icon` | `leftIcon` | 改名 + 综合映射 | eview 分左/右图标，需结合 `iconPosition` 决定落到 `leftIcon` 还是 `rightIcon`（见 2.2） |
| `iconPosition="start"/"end"` | `leftIcon` / `rightIcon` | 综合映射 | antd 用 `iconPosition` 控制位置，eview 用不同属性名区分 |
| `loading` | — | ❌ 无法映射 | eview 无 loading，改用 `disabled` + `text` 切换「提交中…」表达（见 3.1） |
| `block` | — | ❌ 无法映射 | eview 无 block，改用 `style={{ width: '100%' }}` |
| `ghost` | — | ❌ 无法映射 | eview 无幽灵属性，需自行定制背景透明样式 |
| `shape` | — | ❌ 无法映射 | eview Button 无形状（circle/round）；圆形图标按钮改用 `IconButton` |
| `href` | — | ❌ 无法映射 | eview Button 无链接化；用 `<a>` 包裹或 `status="text"` + onClick 跳转 |
| `target` | — | ❌ 无法映射 | 同上，依赖 href |
| `htmlType` | — | ❌ 无法映射 | eview Button 内部固定；表单提交用 onClick 调 `formRef.submit()` |
| `onClick(event)` | `onClick(event, additionalData)` | 改名 + 签名调整 | 第一参 event 保留；eview 多第二参 `additionalData`，可忽略；注意 antd 只传 1 参（见 2.3） |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，改用 `className` / `style` |
| `styles` | — | ❌ 无法映射 | 同上，改用 `style` |
| `autoInsertSpace` | — | ❌ 无法映射 | eview 无汉字空格开关 |
| — | `text` / `children` | eview 特有 | antd 用 `children`；eview `text` 与 `children` 等价 |
| — | `focused` | eview 特有 | antd 无默认聚焦属性，可用 `autoFocus` 近似 |
| — | `leftIconProps` / `rightIconProps` | eview 特有 | 多态图标（hover/disabled 态） |
| — | `additionalData` | eview 特有 | 透传业务数据给 onClick 第二参 |
| — | `tipType` / `tipShow` / `tipData` | eview 特有 | 内置提示；antd 需外层包 `Tooltip` |

## 2. 处理方式详解

### 2.1 `type` + `danger` → `status`（综合映射）

antd 用两个属性，eview 只有一个 `status`。优先级：`danger` 最高。

```js
function toEviewStatus(type = 'default', danger = false) {
  if (danger) return 'risk';        // danger 优先
  switch (type) {
    case 'primary': return 'primary';
    case 'text':    return 'text';
    case 'default': return 'default';
    case 'dashed':  return 'default'; // 丢失虚线样式
    case 'link':    return 'text';    // 近似，丢失链接语义
    default: return 'default';
  }
}
```

### 2.2 `icon` + `iconPosition` → `leftIcon` / `rightIcon`（综合映射）

```jsx
// antd
<Button type="primary" icon={<SearchIcon />} iconPosition="end">查询</Button>

// eview
<Button status="primary" text="查询" rightIcon={<IconPlusIcSearch />} />
// iconPosition="start"(默认) → leftIcon；"end" → rightIcon
```

注：antd `icon` 接收 ReactNode；eview `leftIcon`/`rightIcon` 收 string（icon+ 名）或 ReactElement，推荐用 icon+ 组件。

### 2.3 `onClick` 签名调整

```jsx
// antd：onClick(event)
<Button onClick={(e) => doSomething(e)} />

// eview：onClick(event, additionalData)
<Button onClick={(e) => doSomething(e)} />
// 第一参 event 一致；第二参 additionalData 不用可忽略。
// 多按钮共用处理函数时，用 additionalData 区分：
<Button text="编辑" additionalData={{ id: row.id, action: 'edit' }} onClick={handleRowAction} />
<Button text="删除" status="risk" additionalData={{ id: row.id, action: 'delete' }} onClick={handleRowAction} />
const handleRowAction = (event, data) => { /* data 即 additionalData */ };
```

## 3. 无法映射的属性与建议处理

### 3.1 `loading`（处理中状态）

eview Button 无 loading，需用 `disabled` + 文案切换表达：

```jsx
// antd
<Button type="primary" loading={submitting} onClick={handleSubmit}>提交</Button>

// eview
<Button
  status="primary"
  text={submitting ? '提交中...' : '提交'}
  disabled={submitting}
  onClick={async () => {
    if (submitting) return;
    setSubmitting(true);
    try { await api.submit(); } finally { setSubmitting(false); }
  }}
/>
```

### 3.2 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `block` | `style={{ width: '100%' }}` |
| `ghost` | 自定义透明背景 + 边框样式 |
| `shape` (circle/round) | 改用 `IconButton` |
| `href` / `target` | 外层 `<a>` 包裹，或 `status="text"` + onClick 跳转 |
| `htmlType="submit"` | 表单用 `formRef.submit()`；按钮 onClick 调用 |
| `type="dashed"` | 自定义描边样式 |
| `type="link"` | `status="text"` 近似，丢失链接语义 |
| `classNames` / `styles` | `className` / `style` |
| `autoInsertSpace` | 无对应，忽略 |

## 4. 完整示例对照

```jsx
// antd
<Button
  type="primary"
  danger
  size="large"
  icon={<DeleteIcon />}
  loading={deleting}
  onClick={handleDelete}
>
  删除
</Button>

// eview 等价
<Button
  status="risk"                 // type=danger → status=risk
  size="large"
  leftIcon={<IconPlusIcDelete />} // icon → leftIcon
  text={deleting ? '删除中...' : '删除'}
  disabled={deleting}            // loading → disabled + 文案
  onClick={handleDelete}
/>
```
