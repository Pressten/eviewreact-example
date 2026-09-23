# Modal → Dialog 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Modal` ⇄ eview `Dialog`
- 定位差异：两者都是「页面正中浮层 + 标题 + 内容 + 按钮区」。关键差异在显隐控制与按钮区：antd 用 `open`（布尔）+ `onOk` / `onCancel` 两个语义化回调 + `footer`（ReactNode 或渲染函数）；eview 用 `isOpen`（受控，**组件不会自己置 false**，业务在 `onClose` 和按钮 `onClick` 里 `setIsOpen(false)`）+ `buttons`（数组，每项是 Button props）。eview 还内置拖动（`movable`）/ 缩放（`resizable`）/ 最小化 / 嵌套 / 自定义位置，antd 需自行实现。eview **没有** `footer` / `onOk` / `onCancel` / `okText` / `cancelText` / `okType` / `okButtonProps` / `cancelButtonProps` / `confirmLoading` / `loading` / `centered` / `width`（用 `size`）/ `wrapClassName` / `modalRender` / `forceRender` / `getContainer`（用 `mountId`）/ `focusTriggerAfterClose`（用 `lastFocus`）。纯确认 / 提示弹窗 eview 推荐用 `MessageDialog`，本文只覆盖 `Modal` 对应 `Dialog`。`Modal.method()`（info/success/error/warning/confirm）见 3.3。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `open` | `isOpen` | 直接改名 | 显隐受控；eview 关闭需自行 `setIsOpen(false)` |
| `title` | `title` | 直接改名 | |
| `children` / 内容 | `children` | 直接改名 | |
| `onOk(e)` | `buttons` + `onClick` | 综合映射 | eview 无 `onOk`，确定按钮放进 `buttons` 数组，`onClick` 里调提交逻辑（见 2.1） |
| `onCancel(e)` | `onClose(event)` + `buttons` 取消项 `onClick` | 综合映射 | 右上角 × / ESC 触发 `onClose`；取消按钮放进 `buttons`（见 2.1） |
| `okText` | `buttons[].text` | 综合映射 | 确定按钮文案写到 `buttons` 数组项的 `text`（见 2.1） |
| `cancelText` | `buttons[].text` | 综合映射 | 取消按钮文案同上 |
| `okType` | `buttons[].status` | 改值 | `'primary'` → `status="primary"`；`'danger'` → `status="risk"`；默认 → `status="default"` |
| `okButtonProps` | `buttons[]` 属性 | 综合映射 | 拆到确定按钮数组项（`disabled` / `status` 等）（见 2.2） |
| `cancelButtonProps` | `buttons[]` 属性 | 综合映射 | 拆到取消按钮数组项 |
| `confirmLoading` | `buttons[].disabled` + `text` 切换 | 综合映射 | 确定按钮 loading → `disabled` + 文案「保存中…」（见 2.3） |
| `loading`（骨架屏） | — | ❌ 无法映射 | eview 无骨架屏，内容区自行 loading 占位 |
| `footer` | `buttons` | 综合映射 | `footer={null}` → 不传 `buttons`；自定义底部 → `buttons` 数组或外部渲染（见 2.4） |
| `centered` | `position` / 默认居中 | 改值 | eview 默认居中展示；antd `centered` 默认 `false`（顶部），eview 无「顶部」态，需 `position={[x, y]}` 近似 |
| `closable` | `closable` | 直接改名 | |
| `closeIcon` | `customIcons` | 综合映射 | eview `customIcons` 是标题栏自定义图标（含关闭），语义不完全一致（见 3.1） |
| `keyboard`（ESC） | `closeOnEscape` | 直接改名 | |
| `mask` | `modal` | 改值 | antd `mask={false}` → eview `modal={false}`（无遮罩即非模态） |
| `maskClosable` | — | ❌ 无法映射 | eview 点击蒙层不关闭（只能走 `onClose` / 按钮），需自行在 `maskStyle` onClick 处理或忽略 |
| `width` | `size[0]` | 综合映射 | `width={520}` → `size={[520, 'auto']}`（见 2.5） |
| `zIndex` | `zindex` | 直接改名 | eview 默认 `9999`，**不要超过 9999**（会盖住弹窗内 Select 下拉） |
| `style` | `style` | 直接改名 | |
| `wrapClassName` | `className` | 直接改名 | 外层容器类名 |
| `classNames` | — | ❌ 无法映射 | eview 无语义化结构 class，用 `buttonStyle` / `contentStyle` / `maskStyle` / `style` / `className` |
| `styles` | `buttonStyle` / `contentStyle` / `maskStyle` / `style` | 综合映射 | 按区域拆到对应局部样式 |
| `destroyOnHidden` / `destroyOnClose` | `destroyOnClose` | 直接改名 | eview 默认 `true`（关闭销毁内容） |
| `forceRender` | — | ❌ 无法映射 | eview 无强制渲染；`isOpen=false` 时不渲染 |
| `getContainer` | `mountId` | 改值 | antd 传节点 / 选择器 / `false`；eview 传 `mountId`（挂载节点 id，默认 body） |
| `modalRender` | — | ❌ 无法映射 | eview 无自定义渲染，靠 `style` / `className` |
| `focusTriggerAfterClose` | `lastFocus` | 直接改名 | eview `lastFocus` 默认 `true`（关闭后回到原焦点） |
| `afterClose` | — | ❌ 无法映射 | eview 无完全关闭后回调；用 `onClose` + setTimeout 近似，或 `animationOff` 关动画后直接处理 |
| `afterOpenChange(open)` | — | ❌ 无法映射 | eview 无打开 / 关闭动画结束回调 |
| — | `movable` / `resizable` / `onResize` | eview 特有 | 拖动 / 缩放（antd 需自行实现） |
| — | `minimizable` / `onMinimized` / `customMinimized` | eview 特有 | 最小化 |
| — | `position` | eview 特有 | 固定位置 `[x, y]` |
| — | `titleTip` | eview 特有 | 标题提示 |
| — | `customIcons` / `url` | eview 特有 | 标题栏自定义图标 / 内嵌第三方页面 |
| — | `closeOnEscape` | eview 特有 | ESC 关闭 + 焦点循环 |
| — | `animationOff` | eview 特有 | 关闭动画 |
| — | `boundary` / `isAllowedExceed` / `autoSetPosition` | eview 特有 | 拖拽范围 |

## 2. 处理方式详解

### 2.1 `onOk` / `onCancel` / `okText` / `cancelText` → `buttons`（综合映射）

antd 用两个语义化回调 + 两个文案属性；eview 把按钮全部放进 `buttons` 数组（每项是 Button props），确定按钮的 `onClick` 调提交逻辑，取消按钮的 `onClick` 关窗。

```jsx
// antd
<Modal
  open={open}
  title="新建"
  okText="保存"
  cancelText="取消"
  onOk={handleSave}
  onCancel={() => setOpen(false)}
>
  <Form />
</Modal>

// eview
<Dialog
  isOpen={open}
  title="新建"
  onClose={() => setOpen(false)}                 // 右上角 × / ESC
  buttons={[
    { text: '取消', onClick: () => setOpen(false) },
    { text: '保存', status: 'primary', onClick: () => formRef.current.submit() },
  ]}
>
  <Form ref={formRef} onSuccess={handleSave} />
</Dialog>
```

注：eview 确定按钮不直接调 `handleSave`，而是 `formRef.current.submit()` 触发表单 `onSuccess`，在 `onSuccess` 里请求成功后才关窗（见 §4 完整示例）。

### 2.2 `okButtonProps` / `cancelButtonProps` → `buttons[]` 属性（综合映射）

```jsx
// antd
<Modal okButtonProps={{ disabled: saving }} cancelButtonProps={{ disabled: saving }} />

// eview
<Dialog
  buttons={[
    { text: '取消', disabled: saving, onClick: () => setOpen(false) },
    { text: '保存', status: 'primary', disabled: saving, onClick: handleSave },
  ]}
/>
```

### 2.3 `confirmLoading` → `disabled` + 文案切换（综合映射）

eview 无 loading 态，确定按钮用 `disabled` + 文案「保存中…」表达，取消按钮也 `disabled` 防止半途关窗：

```jsx
// antd
<Modal confirmLoading={saving} okText="保存" />

// eview
<Dialog
  buttons={[
    { text: '取消', disabled: saving, onClick: () => setOpen(false) },
    { text: saving ? '保存中...' : '保存', status: 'primary', disabled: saving, onClick: handleSave },
  ]}
/>
```

### 2.4 `footer` → `buttons`（综合映射）

```jsx
// antd：无底部
<Modal footer={null} open={open} />

// eview：不传 buttons
<Dialog isOpen={open} onClose={() => setOpen(false)}>…</Dialog>

// antd：自定义底部
<Modal footer={<><Button>自定义1</Button><Button>自定义2</Button></>} />

// eview：用 buttons 数组表达（每项是 Button props）
<Dialog buttons={[{ text: '自定义1' }, { text: '自定义2', status: 'primary' }]} />
// 若需完全自定义 ReactNode 底部，在 children 里自行渲染并省略 buttons
```

### 2.5 `width` → `size[0]`（综合映射）

antd `width` 只控宽；eview `size` 是 `[宽, 高]` 二元组，高传 `'auto'` 自适应内容，配合 `style={{ maxHeight: '80vh' }}` 限高：

```jsx
// antd
<Modal width={520} />

// eview
<Dialog size={[520, 'auto']} style={{ maxHeight: '80vh' }} />

// antd 百分比 / Breakpoint
<Modal width="60%" />
// eview
<Dialog size={['60%', 'auto']} />
```

> ⚠️ 不要用 `size={[w, 固定高]}` 定死高度——内容少留大空隙，内容多被截断。

## 3. 无法映射的属性与建议处理

### 3.1 `closeIcon`（自定义关闭图标）

eview `customIcons` 是标题栏自定义图标（默认用 `<IconPlusIc* />`），与 antd `closeIcon`（仅替换关闭按钮图标）语义不完全一致：

```jsx
// antd
<Modal closeIcon={<MyCloseIcon />} />

// eview：用 customIcons 近似（注意它会替换整个标题栏图标区）
<Dialog customIcons={<IconPlusIcPublicClose />} />
// 或隐藏关闭按钮自行处理：closable={false} + customClose + 自定义按钮
```

### 3.2 `maskClosable`（点击蒙层关闭）

eview 点击蒙层不关闭，只能走 `onClose` / 按钮。若必须支持点击蒙层关闭：

```jsx
// antd
<Modal maskClosable open={open} onCancel={close} />

// eview：无原生支持，建议保持默认（不关闭）；如需实现，在 maskStyle 上自行 onClick（不推荐，破坏模态语义）
<Dialog isOpen={open} modal onClose={close} />   // 默认点蒙层无反应
```

### 3.3 `Modal.method()` / `Modal.useModal()`（命令式确认框）

antd 的 `Modal.info` / `success` / `error` / `warning` / `confirm` 是命令式确认框；eview 对应 `MessageDialog`（有类型图标、`ok` / `cancel` 语义），不是 `Dialog`：

```jsx
// antd
Modal.confirm({ title: '确认删除？', content: '…', onOk: del, onCancel: () => {} });

// eview：改用 MessageDialog（见 MessageDialog.md，第二批）
// 或用 Dialog 受控 + isOpen state 自行实现确认框语义
const [confirmOpen, setConfirmOpen] = useState(false);
<Dialog
  isOpen={confirmOpen}
  title="确认删除？"
  onClose={() => setConfirmOpen(false)}
  buttons={[
    { text: '取消', onClick: () => setConfirmOpen(false) },
    { text: '确定', status: 'risk', onClick: () => { del(); setConfirmOpen(false); } },
  ]}
>…</Dialog>
```

`Modal.useModal()` 的 context 注入无对应，eview 弹窗均受控渲染在组件树内，天然带 context。

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `loading`（骨架屏） | 内容区自行 `<div>加载中...</div>` 占位 |
| `afterClose` / `afterOpenChange` | 用 `onClose` + `setTimeout(动画时长)` 近似，或 `animationOff` 关动画后在 `onClose` 里直接处理 |
| `forceRender` | eview 不支持强制渲染；如需预填表单，打开时用 `useEffect` + `setFieldsValue` 回填 |
| `modalRender` | 用 `style` / `className` / `contentStyle` 近似 |
| `classNames` / `styles` | `buttonStyle` / `contentStyle` / `maskStyle` / `style` / `className` |
| `centered`（顶部态） | eview 默认居中；顶部态用 `position={[null, 80]}` 近似 |

## 4. 完整示例对照

```jsx
// antd
<Modal
  open={open}
  title={editing ? '编辑设备' : '新建设备'}
  okText="保存"
  cancelText="取消"
  okType="primary"
  confirmLoading={saving}
  width={520}
  destroyOnHidden
  keyboard
  maskClosable={false}
  onOk={handleSave}
  onCancel={() => setOpen(false)}
>
  <Form form={form} initialValues={EMPTY} onFinish={handleSave}>
    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>

// eview 等价
const [open, setOpen] = useState(false);
const [saving, setSaving] = useState(false);
const formRef = useRef(null);
<Dialog
  isOpen={open}                                  // open → isOpen
  title={editing ? '编辑设备' : '新建设备'}
  size={[520, 'auto']}                            // width → size[0]，高自适应
  style={{ maxHeight: '80vh' }}                   // 限高，超出内部滚动
  closable                                       // closable 默认 true
  closeOnEscape                                  // keyboard → closeOnEscape
  destroyOnClose                                 // destroyOnHidden → destroyOnClose（默认 true）
  onClose={() => setOpen(false)}                 // onCancel(× / ESC) → onClose；自行置 false
  buttons={[                                     // okText/cancelText/onOk/onCancel → buttons
    { text: '取消', disabled: saving, onClick: () => setOpen(false) },
    { text: saving ? '保存中...' : '保存', status: 'primary', disabled: saving, onClick: () => formRef.current.submit() },
  ]}
>
  <Form ref={formRef} initialValues={EMPTY} onSuccess={handleSave}>
    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
      <TextField placeholder="请输入" maxLength={32} />
    </Form.Item>
  </Form>
  {/* maskClosable={false}：eview 默认点蒙层不关，天然满足 */}
</Dialog>

// handleSave：成功才关窗，失败保持打开
const handleSave = async (values) => {
  if (saving) return;
  setSaving(true);
  try {
    await api.save(values);
    setOpen(false);          // 成功才关
    reloadList();
  } catch (e) {
    showError(e);            // 失败保持打开
  } finally {
    setSaving(false);
  }
};
```
