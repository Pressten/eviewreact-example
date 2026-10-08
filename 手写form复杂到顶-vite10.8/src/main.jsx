import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
import './styles/base.css';
import './styles/font.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import App from './app.jsx';

// dayjs 中文 locale（源项目原由 antd-zh.js 注册；antd ConfigProvider 删除后在此单独注册）
// antd DatePicker 仍走 dayjs，eview-react DatePicker 是否真需要下游运行时验证
dayjs.locale('zh-cn');

const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <IntlProvider locale={locale} messages={componentsLocales[locale]}>
                <App />
            </IntlProvider>
        </ConfigProvider>
    </StrictMode>
);
