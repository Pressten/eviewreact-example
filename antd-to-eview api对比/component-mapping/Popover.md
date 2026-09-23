# Popover → TipBox 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Popover` ⇄ eview `TipBox`（`type="normal"`）
- 定位差异：两者都是「可承载更复杂内容（标题 + 内容）的悬浮卡片」。但 eview TipBox 是包裹式：`<TipBox title="…" content={…} trigger="hover" direction="top"><Button /></TipBox>`，`type="normal"` 表示有标题气泡（对应 antd Popover）。antd Popover 用 `content`（ReactNode）+ `title`（ReactNode）放内容与标题；eview `content` 是 `any`（可 ReactNode）、`title` 是 `string`（仅纯文本）。eview 用 `direction`（12 方位）放方向、`arrowDirection` 控制箭头，antd 用 `placement` + `arrow`。eview **没有** `open`/`defaultOpen`/`onOpenChange` 受控显隐（`display` 在有 children 时不支持）、`mouseEnterDelay`/`mouseLeaveDelay` 延迟、`getPopupContainer`、`zIndex` 等。两者都要求被包裹元素支持 `onMouseEnter`/`onMouseLeave`/`onFocus`/`onClick` 事件。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `content` | `content` | 直接改名 | antd `content` 为 ReactNode；eview `content` 为 `any`（可 ReactNode），类型兼容 |
| `title` | `title` | 改值 | antd `title` 为 ReactNode（可含标记）；eview `title` 为 `string`（仅纯文本），含标记时需移入 `content`（见 2.1） |
| `placement` | `direction` | 改值 | 值名一致：`top`/`topLeft`/…/`rightBottom`；默认值 `top` 一致（见 2.2） |
| `trigger` | `trigger` | 直接改名 | 值 `hover`/`focus`/`click` 一致；antd 额外支持 `contextMenu`，eview 不支持（见 2.3） |
| `arrow` | `arrowDirection` | 综合映射 | antd `true`(默认)/`{pointAtCenter}`；eview `arrowDirection` 方向，`'none'` 隐藏（见 2.4） |
| `overlayClassName` | `className` | 直接改名 | |
| `overlayInnerStyle` / `overlayStyle` | `style` / `titleStyle` | 改值 | 气泡整体样式 → `style`；标题样式 → `titleStyle` |
| `open`（5.10.0，旧名 `visible`） | — | ❌ 无法映射 | eview `display` 在有 children 时不支持，无法受控显隐（见 3.1） |
| `defaultOpen` | — | ❌ 无法映射 | eview 无默认开态 |
| `onOpenChange(open)`（旧名 `onVisibleChange`） | — | ❌ 无法映射 | eview 无显隐变化回调；`onDispose` 仅自动关闭触发 |
| `mouseEnterDelay` / `mouseLeaveDelay` | `isMouseLeaveClose` | 综合映射 | antd 精确延迟（秒）；eview 仅 `isMouseLeaveClose`(默认 true) 开关，无延迟数值（见 2.5） |
| `autoAdjustOverflow` | — | ❌ 无法映射 | eview 自动溢出调整不可配置 |
| `destroyTooltipOnHide` | — | ❌ 无法映射 | eview 无销毁选项；用 key 重挂近似 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 无自定义挂载节点（`autoZindex` 自动层级） |
| `zIndex` | — | ❌ 无法映射 | eview 用 `autoZindex` 自动管理 |
| `openClassName` | — | ❌ 无法映射 | eview 无触发元素开态 class |
| `afterOpenChange(open)` | — | ❌ 无法映射 | eview 无显隐后回调 |
| `children`（触发元素） | `children` | 直接改名 | eview 推荐包裹式写法 |
| — | `type="normal"` | eview 特有 | 有标题气泡，对应 antd Popover |
| — | `isMouseLeaveClose` | eview 特有 | 鼠标移出自动关，默认 true |
| — | `isClosable` / `onClose` | eview 特有 | 手动关闭按钮 |
| — | `disposeTimeOut` / `onDispose` | eview 特有 | 自动关闭毫秒 / 回调 |
| — | `arrowDirection` | eview 特有 | 箭头方向 / `'none'` 隐藏 |
| — | `titleClassName` | eview 特有 | 标题类名 |
| — | `animationTime` / `autoZindex` | eview 特有 | 动画时长 / 自动层级 |
| — | `position` / `display` / `displayMode` | eview 特有 | 传统手动定位 / 显隐（**有 children 时不支持**） |
| — | `isErrorTip` / `errorTitle` / `errorContent` / `errorInputClassName` | eview 特有 | 错误提示样式（控件 `hintType="tip"` 内部使用） |

## 2. 处理方式详解

### 2.1 `title` 类型收窄（改值）

antd `title` 为 ReactNode（可含 `<a>`/`<b>` 等标记）；eview `title` 为 `string`。含标记的标题需移入 `content`，或用纯文本。

```jsx
// antd —— title 含标记
<Popover title={<strong>策略说明</strong>} content={<div>…</div>} />

// eview —— 含标记 title 移入 content（title 用纯文本）
<TipBox type="normal" title="策略说明" content={<div>…</div>} />
// 若必须保留标题标记，把整块（含标题）放入 content，title 留空
<TipBox type="normal" content={<div><strong>策略说明</strong><div>…</div></div>} />
```

### 2.2 `placement` → `direction`（改值）

值名一致，直接迁移。

```js
// antd placement → eview direction（值名一致）
'top'/'topLeft'/'topRight'/'bottom'/'bottomLeft'/'bottomRight'/
'left'/'leftTop'/'leftBottom'/'right'/'rightTop'/'rightBottom'
// 默认值均为 'top'
```

### 2.3 `trigger`（直接改名 + 限制）

```jsx
// antd —— trigger 支持数组与 contextMenu
<Popover trigger="click" />
<Popover trigger={['hover', 'focus']} />
<Popover trigger="contextMenu" />   // ❌ eview 无 contextMenu

// eview —— trigger 也支持数组，但不支持 contextMenu
<TipBox type="normal" title="说明" content={…} trigger="click" />
<TipBox type="normal" title="说明" content={…} trigger={['hover', 'focus']} />
```

### 2.4 `arrow` → `arrowDirection`（综合映射）

antd `arrow`（布尔，默认 true）或 `{ pointAtCenter }`；eview `arrowDirection`（方向，默认 `bottom`，`'none'` 隐藏）。

```jsx
// antd
<Popover title="说明" content={…} arrow={false} />

// eview
<TipBox type="normal" title="说明" content={…} arrowDirection="none" />  // arrow=false → none
// arrow=true(默认) → arrowDirection 保持默认（按 direction 自动）
// pointAtCenter 无对应
```

### 2.5 `mouseEnterDelay` / `mouseLeaveDelay` → `isMouseLeaveClose`（综合映射）

antd 精确延迟（秒）；eview 仅 `isMouseLeaveClose`（默认 true）开关，无延迟数值。

```jsx
// antd —— 点击展开、移出 0.3 秒后关
<Popover trigger="click" mouseLeaveDelay={0.3} title="说明" content={…}>
  <Button>查看</Button>
</Popover>

// eview —— 点击展开、移出不关 + 关闭按钮
<TipBox type="normal" title="说明" content={…} trigger="click" isMouseLeaveClose={false} isClosable>
  <Button text="查看" />
</TipBox>
// 延迟无对应；如需移出关闭用 isMouseLeaveClose（默认 true）
```

## 3. 无法映射的属性与建议处理

### 3.1 `open` / `defaultOpen` / `onOpenChange`（受控显隐）

eview `display` 在有 children（包裹式）时**不支持**，无法受控显隐。需程序化显隐时用 key 重挂或改用传统 `position` 定位（不推荐）。

```jsx
// antd —— 受控显隐
const [open, setOpen] = useState(false);
<Popover open={open} onOpenChange={setOpen} title="说明" content={…}>
  <Button>查看</Button>
</Popover>

// eview —— 包裹式无法受控；用 key 重挂近似
<TipBox key={open ? 'on' : 'off'} type="normal" title="说明" content={…} trigger="click" isMouseLeaveClose={false} isClosable>
  <Button text="查看" />
</TipBox>
// 或用点击 + isClosable + disposeTimeOut 表达自动消失
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
| `afterOpenChange` | 无对应，忽略 |
| `trigger="contextMenu"` | 改用 `trigger="click"` + 业务处理右键 |

## 4. 完整示例对照

```jsx
// antd —— 点击展开策略说明卡片，移出不关，带关闭
<Popover
  title="限速策略说明"
  content={<div>策略按接口生效；修改后需重启接口才能应用到已建立的会话。</div>}
  trigger="click"
  placement="rightTop"
  mouseLeaveDelay={0.3}
>
  <Button type="link">查看策略说明</Button>
</Popover>

// eview 等价
<TipBox
  type="normal"                                   // 有标题气泡（对应 Popover）
  title="限速策略说明"                              // title → title（纯文本）
  content={<div>策略按接口生效；修改后需重启接口才能应用到已建立的会话。</div>}  // content → content
  trigger="click"                                  // 直接改名
  direction="rightTop"                             // placement → direction
  isMouseLeaveClose={false}                        // 移出不关（mouseLeaveDelay 近似）
  isClosable                                       // 带关闭按钮
>
  <Button status="text" text="查看策略说明" />
</TipBox>
```
