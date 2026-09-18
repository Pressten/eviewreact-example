import { AppProvider } from './context.jsx';
import AppShell from './views/AppShell.jsx';

// 应用入口 — 组装 Provider + AppShell。
// eview-react 的 ConfigProvider + IntlProvider 在 main.jsx 已挂好（管组件内置文案）。
// AppProvider 只持有业务暗色状态 + 切换 aui3_1_dark / .dark 类名。
export default function App() {
    return (
        <AppProvider>
            <AppShell />
        </AppProvider>
    );
}
