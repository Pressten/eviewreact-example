import React from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// eview-react 组件样式（aui3_1 亮色 + aui3_1_dark 暗色变量，暗色必须导入）
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
// 原始 token 体系（与 eview-react 变量并存，布局 CSS 一行不改）
import './styles/base.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import './styles/app.css';

import { AppProvider } from './context.jsx';
import App from './app.jsx';

// 注册 dayjs 中文 locale（DatePicker 等组件跟随）
dayjs.locale('zh-cn');

// 组件内置文案（componentsLocales）+ 业务文案（本页全中文硬编码，无业务语言包）
const messages = { zh: { ...componentsLocales.zh } };

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <AppProvider>
        <IntlProvider locale="zh" messages={messages.zh}>
          <App />
        </IntlProvider>
      </AppProvider>
    </ConfigProvider>
  </React.StrictMode>
);
