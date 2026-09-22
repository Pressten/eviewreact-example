import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
import './styles/base.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import App from './App.jsx';

const locale = 'zh';
// 合并 eview-react 组件文案 + 业务文案（当前业务文案为空对象，后续可按 locale 扩展）
const messages = { ...componentsLocales[locale] };

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <IntlProvider locale={locale} messages={messages}>
                <App />
            </IntlProvider>
        </ConfigProvider>
    </StrictMode>
);
