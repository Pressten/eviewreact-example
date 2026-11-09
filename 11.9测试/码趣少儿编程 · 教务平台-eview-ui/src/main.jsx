import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
// TODO(eview-ui): 确认 eview-ui 全局样式 import 路径（内网）
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import App from './app.jsx';

const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={{}}>
        <App />
    </IntlProvider>
);
