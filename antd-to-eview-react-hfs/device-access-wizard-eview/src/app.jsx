import { AppProvider, useApp } from './context.jsx';
import AppShell from './views/AppShell.jsx';

export const APP_TITLE = '设备接入配置向导';

function AppRoot() {
    const { isDark } = useApp();

    return (
        <div className={`app-root root aui3_1${isDark ? ' aui3_1_dark' : ''}`}>
            <AppShell />
        </div>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppRoot />
        </AppProvider>
    );
}
