# Tooltip → TipBox 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Tooltip` ⇄ eview `TipBox`（`type="simple"`）
- 定位差异：两者都是「鼠标移入显示、移出消失的简洁气泡」。但 eview TipBox 是包裹式：`<TipBox content="…" trigger="hover" direction="top"><Button /></TipBox>`，用 `content`（any）放内容、`direction`（12 方位）放方向、`type="simple"` 表示无标题简洁气泡（对应 antd Tooltip）。antd 用 `title` 放内容、`placement`（12 方位）放方向。eview 用 `arrowDirection` 控制箭头方向（`'none'` 隐藏），antd 用 `arrow`（布尔）。eview **没有** `open`/`defaultOpen`/`onOpenChange` 受控显隐能力（`display` 在有 children 时不支持）、`mouseEnterDelay`/`mouseLeaveDelay` 延迟、`getPopupContainer`、`zIndex`、`fresh`、`autoAdjustOverflow` 等。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `title` | `content` | 改值 | antd 用 `title`；eview 用 `content`（any 类型，可 ReactNode） |
| `placement` | `direction` | 改值 | 值名基本一致：`top`/`topLeft`/`topRight`/`bottom`/`bottomLeft`/`bottomRight`/`left`/`leftTop`/`leftBottom`/`right`/`rightTop`/`rightBottom`；默认值 `top` 一致（见 2.1） |
| `trigger` | `trigger` | 直接改名 | 值 `hover`/`focus`/`click` 一致；antd 额外支持 `contextMenu`，eview 不支持（见 2.2） |
| `arrow` | `arrowDirection` | 综合映射 | antd `true`(默认)/`{pointAtCenter}`；eview 用 `arrowDirection` 方向，`'none'` 隐藏（见 2.3） |
| `color` | `style={{ background }}` | 综合映射 | antd `color` 设背景色、文字自适应；eview 用 `style.background` 近似（见 2.4） |
| `overlayClassName` | `className` | 直接改名 | |
| `overlayInnerStyle` / `overlayStyle` | `style` | 改值 | 气泡内部 / 整体样式 |
| `open`（5.10.0，旧名 `visible`） | — | ❌ 无法映射 | eview `display` 在有 children 时不支持，无法受控显隐（见 3.1） |
| `defaultOpen` | — | ❌ 无法映射 | eview 无默认开态 |
| `onOpenChange(open)`（旧名 `onVisibleChange`） | — | ❌ 无法映射 | eview 无显隐变化回调；`onDispose` 仅自动关闭时触发 |
| `mouseEnterDelay` / `mouseLeaveDelay` | `isMouseLeaveClose` | 综合映射 | antd 精确延迟（秒）；eview 仅 `isMouseLeaveClose`(默认 true) 开关移出关闭，无延迟数值（见 2.5） |
| `autoAdjustOverflow` | — | ❌ 无法映射 | eview 自动溢出调整不可配置 |
| `destroyTooltipOnHide` | — | ❌ 无法映射 | eview 无销毁选项；用 key 重挂近似 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 无自定义挂载节点（`autoZindex` 自动层级） |
| `zIndex` | — | ❌ 无法映射 | eview 用 `autoZindex` 自动管理 |
| `openClassName` | — | ❌ 无法映射 | eview 无触发元素开态 class |
| `fresh` | — | ❌ 无法映射 | eview 无内容刷新开关 |
| `afterOpenChange(open)` | — | ❌ 无法映射 | eview 无显隐后回调 |
| `children`（触发元素） | `children` | 直接改名 | eview 推荐包裹式写法 |
| — | `type="simple"` | eview 特有 | 简洁气泡（无标题），对应 antd Tooltip |
| — | `isMouseLeaveClose` | eview 特有 | 鼠标移出自动关，默认 true |
| — | `isClosable` / `onClose` | eview 特有 | 手动关闭按钮（Tooltip 不用） |
| — | `disposeTimeOut` / `onDispose` | eview 特有 | 自动关闭毫秒 / 回调 |
| — | `arrowDirection` | eview 特有 | 箭头方向 / `'none'` 隐藏 |
| — | `titleStyle` / `titleClassName` | eview 特有 | 标题样式（simple 模式无标题） |
| — | `animationTime` / `autoZindex` | eview 特有 | 动画时长 / 自动层级 |
| — | `position` / `display` / `displayMode` | eview 特有 | 传统手动定位 / 显隐（**有 children 时不支持**） |
| — | `isErrorTip` / `errorTitle` / `errorContent` / `errorInputClassName` | eview 特有 | 错误提示样式（控件 `hintType="tip"` 内部使用） |

## 2. 处理方式详解

### 2.1 `placement` → `direction`（改值）

值名基本一致，直接迁移。注意 eview `direction` 默认行为需显式传。

```js
// antd placement → eview direction（值名一致）
'top'        → 'top'
'topLeft'    → 'topLeft'
'topRight'   → 'topRight'
'bottom'     → 'bottom'
'bottomLeft' → 'bottomLeft'
'bottomRight'→ 'bottomRight'
'left'       → 'left'
'leftTop'    → 'leftTop'
'leftBottom' → 'leftBottom'
'right'      → 'right'
'rightTop'   → 'rightTop'
'rightBottom'→ 'rightBottom'
// 默认值均为 'top'
```

### 2.2 `trigger`（直接改名 + 限制）

```jsx
// antd —— trigger 支持数组与 contextMenu
<Tooltip trigger="hover" />
<Tooltip trigger={['hover', 'focus']} />
<Tooltip trigger="contextMenu" />   // ❌ eview 无 contextMenu

// eview —— trigger 也支持数组，但不支持 contextMenu
<TipBox type="simple" content="说明" trigger="hover" />
<TipBox type="simple" content="说明" trigger={['hover', 'focus']} />
// trigger="contextMenu" → ❌ 无对应，改用 click + onContextMenu 业务处理
```

### 2.3 `arrow` → `arrowDirection`（综合映射）

antd `arrow`（布尔，默认 true）或 `{ pointAtCenter: boolean }`；eview `arrowDirection`（方向，默认 `bottom`，`'none'` 隐藏）。

```jsx
// antd
<Tooltip title="说明" arrow={false} />
<Tooltip title="说明" arrow={{ pointAtCenter: true }} />

// eview
<TipBox type="simple" content="说明" arrowDirection="none" />   // arrow=false → none
// arrow=true(默认) → arrowDirection 保持默认（按 direction 自动）
// pointAtCenter 无对应，eview 箭头跟随 direction
```

### 2.4 `color` → `style.background`（综合映射）

antd `color` 设背景色、文字颜色自适应；eview 用 `style.background` + 手动设文字色。

```jsx
// antd
<Tooltip title="说明" color="#0067d1" />

// eview
<TipBox type="simple" content="说明" style={{ background: '#0067d1', color: '#fff' }} />
// 文字色 eview 不会根据背景自动反色，需手动指定 color
```

### 2.5 `mouseEnterDelay` / `mouseLeaveDelay` → `isMouseLeaveClose`（综合映射）

antd 精确延迟（秒）；eview 仅 `isMouseLeaveClose`（默认 true）开关，无延迟数值。

```jsx
// antd —— 移入 0.5 秒后才显示
<Tooltip title="说明" mouseEnterDelay={0.5} mouseLeaveDelay={0.1} />

// eview —— 无延迟数值，仅开关移出关闭
<TipBox type="simple" content="说明" isMouseLeaveClose />
// 延迟无对应，忽略；必须延迟时业务侧用 onMouseEnter/setTimeout 自行实现
```

## 3. 无法映射的属性与建议处理

### 3.1 `open` / `defaultOpen` / `onOpenChange`（受控显隐）

eview `display` 在有 children（包裹式）时**不支持**，无法受控显隐。需程序化显隐时用 key 重挂或改用传统 `position` 定位（不推荐）。

```jsx
// antd —— 受控显隐
const [open, setOpen] = useState(false);
<Tooltip open={open} onOpenChange={setOpen} title={user?.name}>
  <Button>用户</Button>
</Tooltip>

// eview —— 包裹式无法受控；用 key 重挂近似
<TipBox key={open ? 'on' : 'off'} type="simple" content={user?.name ?? ''}>
  <Button>用户</Button>
</TipBox>
// 或改用点击触发 + isClosable + disposeTimeOut 表达自动消失
<TipBox type="simple" content="已复制" trigger="click" disposeTimeOut={1500} arrowDirection="none">
  <Button text="复制" onClick={copy} />
</TipBox>
```

### 3.2 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `defaultOpen` | 用 `open` 受控 + key 重挂，或忽略 |
| `onOpenChange` | 无对应；`onDispose` 仅自动关闭触发 |
| `mouseEnterDelay` / `mouseLeaveDelay` | 无延迟数值；业务侧 setTimeout 自行实现 |
| `autoAdjustOverflow` | 自动处理，不可配置 |
| `destroyTooltipOnHide` | 用 key 重挂近似 |
| `getPopupContainer` | 无自定义挂载节点 |
| `zIndex` | `autoZindex` 自动管理 |
| `openClassName` | 无对应，忽略 |
| `fresh` | 无对应，忽略 |
| `afterOpenChange` | 无对应，忽略 |
| `trigger="contextMenu"` | 改用 `trigger="click"` + 业务处理右键 |

## 4. 完整示例对照

```jsx
// antd —— 字段帮助气泡
<Tooltip title="端口范围 1-65535，1024 以下需管理员权限" placement="top" color="#0067d1">
  <QuestionCircleOutlined />
</Tooltip>

// eview 等价
<TipBox
  type="simple"                                    // 无标题简洁气泡（对应 Tooltip）
  content="端口范围 1-65535，1024 以下需管理员权限"  // title → content
  direction="top"                                  // placement → direction
  trigger="hover"
  style={{ background: '#0067d1', color: '#fff' }} // color → style.background（手动设文字色）
>
  <IconPlusIcPublicQuestion />                       // children 触发元素
</TipBox>
```
