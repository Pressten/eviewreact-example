import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';
import '../assets/style/base.css';
import '../assets/style/light.css';
import '../assets/style/theme.css';
import '../assets/style/dark.css';
import './app.css';
import App from './app.jsx';

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
