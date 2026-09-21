import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import componentsLocales from '@nce/eview-react/locales';

// eview ICT 3.1 主题（base 基础样式 + 浅色 + 深色），运行时靠根 DOM aui3_1 / aui3_1 aui3_1_dark 切换
import '@nce/eview-react/styles/base.css';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';

// 页面自有设计 token 与布局样式（沿用原页面视觉体系，业务前缀类名）
import './styles/tokens.css';
import './styles/theme-dark.css';
import './styles/app.css';

import App from './app.jsx';

const locale = 'zh';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider onlyRenderOutside>
      <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
      </IntlProvider>
    </ConfigProvider>
  </StrictMode>,
);
