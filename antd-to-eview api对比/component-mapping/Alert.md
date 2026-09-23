# Alert → DivMessage 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Alert` ⇄ eview `DivMessage`
- 定位差异：两者都是「页面内提示条」。但 antd `Alert` 是常驻静态警告条（始终展现、可关闭、不自动消失、支持顶部公告 `banner` 与自定义操作项 `action`）；eview `DivMessage` 是操作后的结果提示条，**默认 10 秒自动消失**，没有 `banner` / `action` / `afterClose` 等能力，且显隐属性是 `display`（不是 `visible`）。要把 antd `Alert` 的「常驻公告」效果做出来，需关掉自动消失（`enableDisposeTimeOut={false}`）。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `type` | `type` | 改值 | 类型值映射：`success`/`info`/`warning`/`error` → `success`/`default`/`warn`/`error`（见 2.1） |
| `message` | `title` / `text` | 综合映射 | antd `message` 是加粗主标题；有 `description` 时落 `title`、无 `description` 时落 `text`（见 2.2） |
| `description` | `text` / `children` | 综合映射 | 辅助文字；有 `message` 时落 `text`，纯 `description` 时落 `children`（见 2.2） |
| `showIcon` | `showIcon` | 直接改名 | |
| `icon` | `icon` | 直接改名 | 两者均收 ReactNode；eview 推荐用 `icon={<IconPlusIc* />}` |
| `closable` | `closeIconDisplay` | 综合映射 | antd 布尔/对象 → eview 布尔控制关闭按钮是否显示（见 2.3） |
| `onClose` | `onClose` | 改名 + 签名调整 | antd `(e: MouseEvent) => void`；eview `(event?) => void`，第一参一致，可忽略差异（见 2.4） |
| `action` | — | ❌ 无法映射 | eview 无自定义操作项，需在 `children` 里自行渲染按钮 |
| `afterClose` | — | ❌ 无法映射 | eview 无关闭动画后回调；自动消失也不触发 `onClose`，靠换 `key` 重挂 |
| `banner` | — | ❌ 无法映射 | eview 无顶部公告模式；近似用 `type="warn"` + `showIcon` + 关闭自动消失 |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，改用 `className` / `style` |
| `styles` | — | ❌ 无法映射 | 同上，改用 `style` |
| — | `display` | eview 特有 | eview 显隐属性；antd Alert 始终展现，迁移时固定 `display` |
| — | `disposeTimeOut` / `enableDisposeTimeOut` | eview 特有 | 自动消失毫秒数 / 是否自动消失；antd Alert 不自动消失，需显式配置 |
| — | `closeIconFocus` / `lastfocus` | eview 特有 | 关闭按钮聚焦 / 关闭后焦点返回 |
| — | `iconClassName` | eview 特有 | 图标 class |
| — | `size` | eview 特有 | 宽高，默认 `['auto','auto']` |

> antd `Alert.ErrorBoundary`（`description` / `message`）无 eview 对应组件，建议自行实现错误边界并用 `DivMessage type="error"` 展示。

## 2. 处理方式详解

### 2.1 `type` 值映射（改值）

antd 四值 → eview 四值，`info` 与 `default` 对应，`warning` 与 `warn` 对应。

```js
function toEviewType(type = 'info') {
  switch (type) {
    case 'success': return 'success';
    case 'info':    return 'default';   // 无 info，用 default
    case 'warning': return 'warn';      // 拼写不同
    case 'error':   return 'error';
    default: return 'default';
  }
}
```

注：`banner` 模式下 antd 默认 `type` 为 `warning`、`showIcon` 为 `true`，迁移时需显式写 `type="warn" showIcon`。

### 2.2 `message` + `description` → `title` / `text` / `children`（综合映射）

antd `message` 是加粗主标题，`description` 是辅助文字；eview `title` 是标题、`text` 是正文、`children` 是完全自定义内容。

```jsx
// antd：有 message + description
<Alert type="success" message="保存成功" description="设置已更新" showIcon closable />

// eview：message → title，description → text
<DivMessage display type="success" title="保存成功" text="设置已更新" showIcon
  enableDisposeTimeOut={false} onClose={() => {}} />

// antd：只有 message
<Alert type="info" message="提示内容" />

// eview：message → text（无标题时用 text）
<DivMessage display type="default" text="提示内容" />

// antd：description 自定义内容（如带链接）
<Alert type="success" message="批量完成" description={<a href="#log">查看日志</a>} />

// eview：用 children 放自定义内容
<DivMessage display type="success" title="批量完成"><a href="#log">查看日志</a></DivMessage>
```

### 2.3 `closable` → `closeIconDisplay`（综合映射）

antd `closable` 收布尔或对象（`{ closeIcon }`）；eview `closeIconDisplay` 收布尔。对象形式的 `closeIcon` 自定义图标无法迁移，统一降级为布尔。

```jsx
// antd
<Alert closable />
<Alert closable={{ closeIcon: <XIcon /> }} />

// eview
<DivMessage display closeIconDisplay />
// 自定义关闭图标 eview 不支持，用默认 ×
```

### 2.4 `onClose` 签名调整

```jsx
// antd：onClose(e: MouseEvent)
<Alert onClose={(e) => setVisible(false)} />

// eview：onClose(event?)
<DivMessage display onClose={(e) => setVisible(false)} />
// 第一参 event 一致；注意：eview 自动消失时不触发 onClose，
// 常驻提示（enableDisposeTimeOut={false}）下用户点 × 才触发。
```

## 3. 无法映射的属性与建议处理

### 3.1 `banner`（顶部公告）

eview 无顶部公告模式，近似用 `type="warn"` + `showIcon` + 关闭自动消失：

```jsx
// antd
<Alert banner message="系统将于今晚维护" type="warning" showIcon />

// eview 近似
<DivMessage
  display
  type="warn"
  showIcon
  text="系统将于今晚维护"
  enableDisposeTimeOut={false}   // 顶栏公告常驻
/>
```

### 3.2 `action`（自定义操作项）

eview 无操作项插槽，需在 `children` 里自行渲染按钮：

```jsx
// antd
<Alert message="草稿未保存" action={<Button size="small">保存</Button>} />

// eview：用 children 自行排
<DivMessage display type="warn" text="草稿未保存">
  <Button size="small" text="保存" onClick={handleSave} />
</DivMessage>
```

### 3.3 `afterClose`（关闭动画后回调）

eview 自动消失不触发 `onClose`，且无关闭后回调。靠换 `key` 重挂 + state 同步实现：

```jsx
// 用 key + state 控制：关闭后 setNotice(null)，下次新提示换 key 重挂
const [notice, setNotice] = useState(null);
{notice ? (
  <DivMessage
    key={notice.key}
    display
    type={notice.type}
    text={notice.text}
    onClose={() => { setNotice(null); /* 此处即 antd afterClose 逻辑 */ }}
  />
) : null}
```

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `classNames` / `styles` | 改用 `className` / `style` |
| `Alert.ErrorBoundary` | 自行用 React Error Boundary 包裹，错误用 `<DivMessage type="error">` 展示 |

## 4. 完整示例对照

```jsx
// antd
<Alert
  type="success"
  showIcon
  message="保存成功"
  description="设置已更新"
  closable
  onClose={() => setVisible(false)}
/>

// eview 等价
<DivMessage
  display                         // 固定显示
  type="success"                  // type 一致
  showIcon                         // 直接改名
  title="保存成功"                  // message → title
  text="设置已更新"                 // description → text
  closeIconDisplay                 // closable → closeIconDisplay
  enableDisposeTimeOut={false}     // antd 不自动消失，需关掉
  onClose={() => setVisible(false)} // 签名兼容
/>
```
