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

dayjs.locale('zh-cn');

const locale = 'zh';

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
