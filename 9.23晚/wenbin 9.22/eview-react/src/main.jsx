import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
import './styles/base.css';
import './styles/font.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import { AppProvider } from './context.jsx';
import App from './app.jsx';

// 业务文案硬编码中文，IntlProvider 只管 eview-react 组件内置文案；locale 用 "zh"（匹配 componentsLocales 的 key）
const locale = 'zh';
dayjs.locale('zh-cn');

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <IntlProvider locale={locale} messages={componentsLocales[locale]}>
                <AppProvider>
                    <App />
                </AppProvider>
            </IntlProvider>
        </ConfigProvider>
    </StrictMode>
);
