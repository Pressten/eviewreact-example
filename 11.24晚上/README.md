# 配置基线检查报告

> 本项目由 ict-coder skill 生成。

面向网络设备的配置基线检查报告单页应用：AI 对话工作台 + 合规率仪表概览 + 检查项/设备双维度明细表格与抽屉式钻取详情，支持深浅色主题切换与完整报告 Excel 导出。

## 开发流程

在 README 所在目录运行以下命令。

1. 修改 `app.jsx` 或 `src/` 下的源码
2. 重新构建：运行 ict-coder skill 的 `build.mjs --dir ./preview`（skill 目录因人而异）
3. 验证构建：运行 ict-coder skill 的 `verify-build.mjs --dir ./preview`
4. 刷新浏览器查看效果（构建产物：`./preview/index.page.html`，双击打开或刷新已打开的页面）

## 目录结构

```
./preview/
├── app.jsx              页面入口（Provider + 根容器组装）
├── src/
│   ├── views/           视图组件（一个 tab/section 一个文件夹）
│   ├── components/      可复用组件
│   ├── mock/            mock 数据
│   ├── hooks/           自定义 React hooks
│   ├── utils/           纯函数工具
│   ├── constants/       枚举/配置常量
│   ├── styles/          跨视图共享 CSS
│   └── context.jsx      全局状态（AppProvider + useApp）
├── public/              共享资产（React/antd/Babel 运行时 + token CSS + 字体）
└── index.page.html      构建产物（自动生成，勿手改）
```

## 关键约定

- **先读 skill 再开发**：本工程基于 ict-coder skill 体系，首次工作前请阅读 skill 的 SKILL.md（组件规范、token 体系、禁用规则）
- **只改源码，不改产物**：修改 `src/` 或 `app.jsx` 后必须重新 build，禁止直接编辑 `index.page.html`
- **图片资源放 `public/uploads/`**；新的 UMD 库（如 three.umd.js）放 `public/library/`
- **不要修改下列文件**：`public/library/`（React/antd 运行时）、`public/style/`（token CSS）、`public/shared/`（icon/chart 共享件）
- **每次修改后验证**：build 完成后运行 verify-build.mjs，确认 Babel 编译和渲染无错误
- **init.mjs 只跑一次**：修改会话中不要重新执行 init（幂等无害但无意义）
