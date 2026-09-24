// App entry - ICT 3.1 (@nce/eview-react) 数据指标管理页
// 全局 Provider（ConfigProvider / IntlProvider / eview-react 主题 CSS）在 main.jsx 接入；
// 此处仅组装应用层状态 Provider 与布局壳，不写任何 view 内容（view 归 Phase 1 页面 agent）。
import { AppProvider } from "./src/context.jsx";
import AppShell from "./AppShell.jsx";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
