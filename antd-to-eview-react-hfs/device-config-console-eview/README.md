# device-config-console-eview

将 antd 版 `device-config-console`（工作区根目录 `device-config-console/`）转换为 `@nce/eview-react`（ICT 3.1）组件库的可运行 vite 工程。

## 运行

```bash
npm install   # 需配置 .npmrc 指向华为内部源
npm run dev   # http://localhost:5174
npm run build
```

## 转换映射

| 原 antd | 转换后 eview-react |
|---------|-------------------|
| `Layout` / `Layout.Header` / `Layout.Sider` / `Layout.Content` | 原生 `<div>`/`<header>`/`<aside>`/`<main>` + `app.css` 布局 |
| `ConfigProvider`(antd locale) + `IntlProvider` | `@nce/eview-react/ConfigProvider` + `IntlProvider`（合并 `componentsLocales` 与业务字典） |
| `Button` type/danger/loading | `Button` status: `default`/`primary`/`risk`/`text`；loading 用 `disabled` 表达 |
| `Input` | `TextField` |
| `Input.TextArea` | `TextArea`（`maxLength` 自带字数统计） |
| `InputNumber` | `Spinner`（`doNotFocusWhenValueUpdate`） |
| `Select` options.label | `Select` options.text |
| `Radio.Group` button | `SelectCard` data.text |
| `Switch` checked/onChange | `Toggle` toggled/onToggle；Form 内配 `valuePropName="toggled" updateTrigger="onToggle"` |
| `Form.useForm` + `onFinish` | `Form` ref + `Form.Item name+rules` 托管 + `onSuccess`；提交用 `formRef.submit()` |
| `Table` dataSource/rowKey/pagination/rowSelection | `Table` dataset/keyIndex/enableAutoPaging/enableCheckBox/checkedRows/onRowCheck/onHeaderCheck |
| `Input` prefix 搜索 | `SearchInput`（value/onChange/onSearch/onClear） |
| `Modal` open/onOk/onCancel/footer | `Dialog` isOpen/onClose/buttons，`size={[560,'auto']}` + `maxHeight:80vh` |
| `Breadcrumb` items | `Crumbs` data（最后一项不传 url） |
| `Badge` count | `Badge` content |
| `Tooltip` title | `IconButton` tipText（内部即 TipBox） |
| 纯图标按钮 `Button type="text" icon` | `IconButton` iconName（传业务 `Icon` 元素） |
| `message.success` | `ToastProvider` + `useToast().success()`（内部渲染 `DivMessage`，换 key 重挂） |
| `Space` | flex 容器 + gap |
| `Row`/`Col` 栅格 | `.form-row`/`.form-col` CSS grid |

## 补位说明（eview-react 未覆盖 / 无 Reference 的部分）

按补位 Pattern 三层判定处理后，以下用原生 HTML/JSX 手写并标注 `TODO(eview-react)`：

- **Dropdown（下拉菜单）**：语言切换 / 用户菜单 / 表格行"更多"。`src/components/Dropdown.jsx`，支持 click 触发、divider、danger、selectedKeys、ESC / 外部点击关闭；建议后续替换为 `DropDown` / `PopUpMenu`（补 Reference 后）。
- **Menu / Layout.Sider（内联折叠侧导航）**：`src/views/side-menu.jsx`，`<aside>`+`<nav>`+`<button>` 复刻展开/折叠（248px↔48px）、两级展开与选中态；不支持折叠态弹出子菜单。
- **Menu horizontal（顶部一级导航）**：`src/views/header-bar.jsx` 内手写 `<nav>` 按钮组。
- **Avatar**：手写 `.app-avatar` 圆形 `<img>`（资源经 vite import 打包）。
- **图标**：源项目依赖运行时注入的全局 LUCIDE 表 + 华为 icon-plus 探测；本工程改为 `src/icons.jsx` 内联 Lucide SVG（无网络依赖，视觉与源项目离线态一致）。

## 主题与国际化

- 入口只引一次 `@nce/eview-react/styles/aui3_1.css` 与 `aui3_1_dark.css`；`<html>` 上 `aui3_1` 常驻，深色时追加 `aui3_1_dark`（eview 组件）与 `.dark`（四层设计 token，手写元素）双轨切换。
- `IntlProvider` 的 `messages` 合并 `componentsLocales[locale]`（组件内置文案）与 `src/i18n.js`（业务文案）；切语言同步 `dayjs.locale()`。

## 验证状态

- 代码已对照 eview-react 各组件 Reference 的 API / 回调 / 受控方式核对（Form 托管、Table dataset/keyIndex/勾选、Dialog buttons、Toggle valuePropName、SearchInput onSearch 触发时机等）。
- `npm install` / `vite build` 验证状态见下方运行记录；如本机无法访问华为内部 npm 源，请在可访问环境执行 `npm install && npm run build` 完成编译验证。
