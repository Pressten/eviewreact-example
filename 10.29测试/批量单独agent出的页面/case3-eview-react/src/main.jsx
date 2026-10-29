import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './app.jsx';

const locale = 'zh';
// 注册 dayjs zh-cn locale（源项目 antd-zh.js 已删，antd locale 包不再自动注册；
// 项目用 dayjs 做日期格式化，注册 zh-cn 兜底中文星期/月份，与 IntlProvider locale='zh' 同步）。
dayjs.locale('zh-cn');

createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
    </IntlProvider>
);
