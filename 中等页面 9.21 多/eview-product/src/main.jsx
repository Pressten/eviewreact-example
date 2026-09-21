import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
// 全局 CSS import（eview-react 工程接入硬纪律：组件库 base + 浅色主题 + 深色主题 + 全局 tokens + 暗色覆盖）
import '@nce/eview-react/styles/base.css';           // 1. 组件库 base 基线（reset/normalize，必引）
import '@nce/eview-react/styles/aui3_1.css';         // 2. 组件库 ICT 3.1 浅色主题（只引一次）
import '@nce/eview-react/styles/aui3_1_dark.css';    // 3. 组件库 ICT 3.1 深色主题（运行时切深色，靠根 DOM aui3_1/aui3_1_dark 切换）
import './styles/tokens.css';                         // 4. 全局 tokens：基色阶 / 尺寸 / 排版 / 语义色（浅色 :root）
import './styles/theme-dark.css';                    // 5. 全局暗色覆盖：.aui3_1.aui3_1_dark 下的语义色覆盖
import App from './App.jsx';

const locale = 'zh';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider onlyRenderOutside>
      <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
      </IntlProvider>
    </ConfigProvider>
  </StrictMode>
);
