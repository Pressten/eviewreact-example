import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import '@cloudsop/eview-ui/style/aui3.1.less';
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import App from './app.jsx';
import { AppProvider } from './context.jsx';
import { ThemeProvider } from './theme/useTheme';

// IntlProvider 保留（react-intl 公网包，业务 i18n 用）；
// eview-ui 组件文案不走 react-intl，走 ThemeProvider 内的 <ConfigProvider locale="zh">。
// Provider 层级：IntlProvider > AppProvider > ThemeProvider > App（步骤 3 勿改）
//   - AppProvider（src/context.jsx）：业务全局状态 + isDark/toggleDark（业务组件用 useApp 消费）；
//     步骤 3 用源项目同名文件整文件覆盖（导出面相同）
//   - ThemeProvider（src/theme/useTheme.jsx）：消费 useApp().isDark，驱动 html .dark 轨 +
//     eview-ui ConfigProvider theme 轨（locale="zh" version="aui3-1"）
const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={{}}>
        <AppProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </AppProvider>
    </IntlProvider>
);

