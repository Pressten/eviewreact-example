# device-config-console-eview

将 antd 版 `device-config-console` 转换为 `@nce/eview-react` 组件库的 ICT 3.1 页面。

## 运行

```bash
npm install   # 需配置 .npmrc 指向华为内部源
npm run dev
```

## 转换映射

| 原 antd | 转换后 eview-react |
|---------|-------------------|
| `Layout` / `Layout.Header` / `Layout.Sider` / `Layout.Content` | 原生 `<div>`/`<header>`/`<aside>`/`<main>` + `app.css` 布局 |
| `ConfigProvider`(antd locale) + `IntlProvider` | `@nce/eview-react/ConfigProvider` + `IntlProvider`(合并 `componentsLocales` 与业务字典) |
| `Button` type/danger | `Button` status: `default`/`primary`/`risk`/`text` |
| `Input` | `TextField` |
| `Input.TextArea` | `TextArea` |
| `InputNumber` | `Spinner`(`doNotFocusWhenValueUpdate`) |
| `Select` options.label | `Select` options.text |
| `Radio.Group` button | `SelectCard` data.text |
| `Switch` checked/onChange | `Toggle` toggled/onToggle;Form 内配 `valuePropName="toggled" updateTrigger="onToggle"` |
| `Form.useForm` + `onFinish` | `Form` ref + `Form.Item name+rules` 托管 + `onSuccess`;提交用 `formRef.submit()` |
| `Table` dataSource/rowKey/pagination/rowSelection | `Table` dataset/keyIndex/enableAutoPaging/enableCheckBox/checkedRows/onRowCheck |
| `Input` prefix 搜索 | `SearchInput` |
| `Modal` open/onOk/onCancel/footer | `Dialog` isOpen/onClose/buttons |
| `Breadcrumb` items | `Crumbs` data + `seprator` |
| `Badge` count | `Badge` content |
| `Tooltip` title | `TipBox type="simple" content` 包裹式 |
| `Dropdown` menu | `TipBox trigger="click"` 包裹自定义浮层 |
| `message.success` | `ToastProvider` + `useToast()` |
| `Avatar` | 原生 `<img>` |

## 补位说明（eview-react 本批次未覆盖的组件）

以下 eview-react 组件库未提供等价组件，已用原生 HTML/JSX 按业务语义补位，并在代码中标注 `TODO(eview-react)`：

- **Menu / 内联折叠侧导航**：用 `<aside>`+`<nav>`+`<button>` 复刻展开/折叠、选中态、多级展开。
- **IconButton（纯图标按钮）**：顶栏图标按钮用原生 `<button class="header-icon-btn">` 补位，悬浮提示用 `TipBox` 包裹。
- **Dropdown（下拉菜单）**：语言切换/用户菜单用 `TipBox trigger="click"` + 自定义浮层内容替代。

## 验证状态

- 代码已对照 eview-react 各组件 Reference 的 API/回调/受控方式核对（导入名、props、回调参数顺序、Form 托管、Table dataset/keyIndex 等）。
- **未执行 `npm install` / `vite build`**：本机无法访问华为内部 npm 源（`cmc.centralrepo.rnd.huawei.com`），依赖未安装。请在可访问内部源的环境执行 `npm install && npm run build` 完成编译验证。

## 工程接入要点

- 入口 `src/main.jsx` 只引一次 `@nce/eview-react/styles/aui3_1.css`；`ConfigProvider` 包最外层。
- `IntlProvider` 的 `messages` 合并 `componentsLocales[locale]`（组件内置文案）与 `messages[lang]`（业务文案）。
- 根容器加 `class="aui3_1"`（深色 `aui3_1 aui3_1_dark`）确保 eview 组件主题翻转；`.dark` 仍在 `<html>` 上切换四层设计 token（base/light/theme/dark）。
