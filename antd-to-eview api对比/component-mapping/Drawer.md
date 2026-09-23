# Drawer → Drawer 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Drawer` ⇄ eview `Drawer`
- 定位差异：两者都是从页面边缘滑入的侧边面板，用于详情查看、侧边编辑、辅助设置。但 eview Drawer **没有内置 footer / extra / loading / keyboard / zIndex / push** 等能力：底部操作栏需自行用绝对定位 `<div>` 放 `Button`；多层抽屉的推动行为需自行布局；骨架屏加载态需外层包 `Skeleton`。另外 antd v5 `Drawer` 的 `className`/`style` 作用于抽屉窗体、`rootClassName`/`rootStyle` 作用于最外层（含遮罩），eview 只提供一层 `className`/`style`/`contentClassName`，作用粒度不同。显隐属性 antd 用 `open`，eview 用 `visible`；关闭回调签名不同（antd `onClose(event)`，eview `onClose(isShowDrawer)`）。

> 注：antd `Drawer` 在 5.x 下没有 `Drawer.Header` / `Drawer.Title` / `Drawer.Content` / `Drawer.Footer` 等子组件结构（与 antd `Modal` 不同），标题/页脚/额外操作均通过 `title` / `footer` / `extra` 属性传入；eview 同样不拆子组件，标题走 `title`/`showTitle`，页脚由业务自写。故无需映射子组件。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `open` | `visible` | 直接改名 | 显隐受控；名称不同 |
| `onClose(event)` | `onClose(isShowDrawer)` | 改名 + 签名调整 | antd 传原生事件 `event`；eview 传 `isShowDrawer: boolean`，且**不会自动关**，需在回调里 `setVisible(false)`（见 2.1） |
| `title` | `title` | 直接改名 | 均为 ReactNode/string |
| `placement` | `placement` | 直接改名 | 值域一致：`top`/`right`/`bottom`/`left`，默认 `right` |
| `width` | `width` | 直接改名 | 左右方向用；antd 接受 string\|number，eview 为 number（px） |
| `height` | `height` | 直接改名 | 上下方向用；同上 |
| `mask` | `showMask` | 直接改名 | 是否展示遮罩 |
| `maskClosable` | `isClickMask` | 直接改名 | 点击蒙层是否关闭 |
| `closable` | `showClose` | 综合映射 | antd 可为 boolean 或对象 `{ closeIcon, disabled, placement }`；eview `showClose` 只收 boolean，对象形式需拆解（见 2.2） |
| `closeIcon` | — | ❌ 无法映射 | eview 无自定义关闭图标入口，固定内置关闭按钮 |
| `destroyOnHidden` | `destroyOnClose` | 直接改名 | antd 5.25.0 起用 `destroyOnHidden` 替代 `destroyOnClose`；eview 仍叫 `destroyOnClose`，默认值均为 `false` |
| ~~`destroyOnClose`~~ | `destroyOnClose` | 直接改名 | antd 已废弃改为 `destroyOnHidden`，迁移时直接落到 eview `destroyOnClose` |
| `getContainer` | `isMountBody` / `mountId` | 综合映射 | antd 收 `HTMLElement \| () => HTMLElement \| Selectors \| false`；eview 用 `isMountBody`(boolean，默认 true 挂 body，false 挂当前 DOM) 与 `mountId`(string，指定挂载点 id) 二者互斥表达（见 2.3） |
| `style` | `style` | 直接改名 | antd 作用于窗体容器；eview `style` 作用于组件根，粒度近似 |
| `className` | `className` | 直接改名 | antd v5 作用于窗体；eview 同名 |
| `rootStyle` | `style` | 综合映射 | antd `rootStyle` 含遮罩层最外层样式；eview 无独立 root 入口，合并到 `style`（丢失遮罩样式粒度，见 2.4） |
| `afterOpenChange` | — | ❌ 无法映射 | eview 只有 `animationDuration` 控时长，无动画结束回调 |
| `autoFocus` | — | ❌ 无法映射 | eview 无焦点切换开关 |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，改用 `className` / `contentClassName` |
| `styles` | — | ❌ 无法映射 | eview 无语义化结构 style，改用 `style` / `contentClassName` |
| `extra` | — | ❌ 无法映射 | eview 无右上角操作区，需自行在 `title` 或 children 内布局 |
| `footer` | — | ❌ 无法映射 | eview 无内置页脚，自写绝对定位 `<div>` 放 `Button`（见 3.1） |
| `forceRender` | — | ❌ 无法映射 | eview 无预渲染开关 |
| `keyboard` | — | ❌ 无法映射 | eview 无 esc 关闭开关 |
| `push` | — | ❌ 无法映射 | eview 无多层抽屉推动行为，嵌套各自独立 `visible` 自行布局 |
| `size` | — | ❌ 无法映射 | eview 无 default/large 预设宽度，直接传 `width`/`height` 数值 |
| `loading` | — | ❌ 无法映射 | eview 无骨架屏，外层包 `Skeleton` 或自管 loading 态 |
| `zIndex` | — | ❌ 无法映射 | eview 无 zIndex 入口，靠 CSS 层叠或全局样式 |
| `drawerRender` | — | ❌ 无法映射 | eview 无自定义渲染整抽屉的入口 |
| — | `showTitle` | eview 特有 | 是否显示标题，默认 true |
| — | `tipData` | eview 特有 | 标题提示文案，antd 需外层包 `Tooltip` |
| — | `contentClassName` | eview 特有 | 内容区 className，补偿 antd `styles.body` |
| — | `id` | eview 特有 | 组件标识 |
| — | `isMountBody` / `mountId` | eview 特有 | 见 `getContainer` 综合映射 |
| — | `sizeDraggable` / `onDragMove` / `onDragFinished` | eview 特有 | 拖拽调整宽/高，antd 无 |
| — | `animationDuration` | eview 特有 | 动画时长（ms），替代 antd 无回调的近似控制 |

## 2. 处理方式详解

### 2.1 `onClose` 签名调整

antd `onClose(event)` 收原生事件；eview `onClose(isShowDrawer: boolean)` 收当前显隐布尔，且**不会自动关闭**，必须在回调里显式置 `visible=false`。

```jsx
// antd：onClose(e)，点遮罩/叉号触发，业务自行 setOpen(false)
<Drawer open={open} onClose={(e) => setOpen(false)} />

// eview：onClose(isShowDrawer)，同样需自行 setVisible(false)
<Drawer visible={visible} onClose={(isShowDrawer) => setVisible(false)} />
// isShowDrawer 即当前 visible 值，多数场景忽略即可；
// 需要根据来源区分（遮罩 vs 叉号）时 eview 不提供区分能力。
```

### 2.2 `closable` → `showClose`（综合映射）

antd `closable` 可为 boolean 或对象；eview `showClose` 只收 boolean，对象形式需拆解，对象内的 `closeIcon`/`disabled`/`placement` 在 eview 中无对应入口。

```js
function toEviewShowClose(closable) {
  if (closable === false) return false;       // 隐藏关闭按钮
  if (closable === true || closable == null) return true;
  if (typeof closable === 'object') {
    return closable.disabled !== true;        // disabled 时隐藏
    // closeIcon / placement 在 eview 无对应，忽略
  }
  return true;
}
```

### 2.3 `getContainer` → `isMountBody` / `mountId`（综合映射）

antd `getContainer` 收多种类型；eview 用两个互斥属性表达挂载位置。

```js
function toEviewMount(getContainer) {
  if (getContainer === false) return { isMountBody: false };          // 挂当前位置
  if (typeof getContainer === 'string') return { mountId: getContainer }; // 选择器 → mountId
  if (typeof getContainer === 'function') return { isMountBody: false };   // 函数返回节点，近似挂当前 DOM
  // HTMLElement 实例：eview 无直接接收 DOM 节点的入口，需用 mountId 或 isMountBody:false 近似
  return { isMountBody: true };                                       // 默认挂 body
}
```

```jsx
// antd：挂到 #my-root
<Drawer getContainer={document.getElementById('my-root')} />

// eview：用 mountId 指定挂载点 id
<Drawer mountId="my-root" />
// 或挂当前 DOM
<Drawer isMountBody={false} />
```

### 2.4 `rootStyle` → `style`（综合映射）

antd `rootStyle` 作用于最外层（含遮罩层）；eview 无独立 root 入口，只能合并到 `style`，遮罩层样式粒度丢失。

```jsx
// antd
<Drawer rootStyle={{ background: 'rgba(0,0,0,0.5)' }} style={{ padding: 16 }} />

// eview：遮罩背景靠全局 CSS 或 showMask 控制，rootStyle 合并进 style（遮罩样式粒度丢失）
<Drawer style={{ padding: 16 }} showMask />
```

## 3. 无法映射的属性与建议处理

### 3.1 `footer`（页脚操作栏）

eview 无内置页脚，需自行用绝对定位 `<div>` 放 `Button`。

```jsx
// antd
<Drawer open={open} footer={<div style={{ textAlign: 'right' }}><Button>取消</Button><Button type="primary">确定</Button></div>}>
  内容
</Drawer>

// eview
<Drawer visible={visible} onClose={() => setVisible(false)}>
  内容
  <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
    <Button text="取消" onClick={() => setVisible(false)} />
    <Button status="primary" text="确定" onClick={handleOk} style={{ marginLeft: 12 }} />
  </div>
</Drawer>
```

### 3.2 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `extra` | 自行在 `title` 区域或 children 顶部布局右上角操作区 |
| `loading` | 外层包 `Skeleton`，或自管 loading 态切换内容 |
| `keyboard` | 无 esc 关闭开关，如需可自行 `useEffect` 监听 keydown 调 `setVisible(false)` |
| `afterOpenChange` | 无回调；用 `animationDuration` 控时长，业务需「动画后」逻辑时用 `setTimeout(duration)` 近似 |
| `autoFocus` | 无焦点开关；如需可打开后手动 `ref.current?.focus()` |
| `push` | 嵌套抽屉各自独立 `visible`，自行用布局/位移表达推动效果 |
| `size="large"` | 直接传 `width={736}` / `height={736}` 数值 |
| `zIndex` | 靠全局 CSS 层叠或 `style={{ zIndex: n }}`（eview 未在 props 暴露，style 可能被覆盖） |
| `forceRender` | 无预渲染；需要时改用 `destroyOnClose={false}` 保持内容常驻 |
| `closeIcon` | 无自定义关闭图标；隐藏用 `showClose={false}` |
| `drawerRender` | 无整抽屉自定义渲染；用 `children` + `contentClassName` 近似 |
| `classNames` / `styles` | 用 `className` / `style` / `contentClassName` 替代 |

## 4. 完整示例对照

```jsx
// antd
<Drawer
  title="编辑设备"
  placement="right"
  width={520}
  open={open}
  onClose={(e) => setOpen(false)}
  destroyOnHidden
  maskClosable={false}
  getContainer={false}
  footer={
    <div style={{ textAlign: 'right' }}>
      <Button onClick={() => setOpen(false)}>取消</Button>
      <Button type="primary" loading={saving} onClick={handleSave}>保存</Button>
    </div>
  }
>
  <Form>...</Form>
</Drawer>

// eview 等价
<Drawer
  title="编辑设备"
  placement="right"
  width={520}
  visible={open}                       // open → visible
  onClose={() => setOpen(false)}       // 签名改为 (isShowDrawer)，自行关
  destroyOnClose                       // destroyOnHidden → destroyOnClose
  isClickMask={false}                  // maskClosable → isClickMask
  isMountBody={false}                  // getContainer={false} → 挂当前 DOM
>
  <Form>...</Form>
  {/* footer 自写绝对定位栏 */}
  <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
    <Button text="取消" disabled={saving} onClick={() => setOpen(false)} />
    <Button
      status="primary"
      text={saving ? '保存中...' : '保存'}   // loading → 文案 + disabled
      disabled={saving}
      onClick={handleSave}
      style={{ marginLeft: 12 }}
    />
  </div>
</Drawer>
```
