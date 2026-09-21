import { StrictMode, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import componentsLocales from '@nce/eview-react/locales';

// 工程接入：主题 CSS 在入口引入（只引一次）。
//   - base.css：eview-react 基础样式
//   - aui3_1.css：ICT 3.1 浅色主题（eview 组件样式）
//   - aui3_1_dark.css：ICT 3.1 深色主题（运行时双主题切换工程两套都引）
// 双主题切换：<body> 的 aui3_1 ↔ aui3_1 aui3_1_dark class 切换（在 context.jsx 里管理）。
import '@nce/eview-react/styles/base.css';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
// 项目设计 token（base → light → theme 角色）与 app 级骨架样式
import './styles/tokens.css';
import './styles/theme-dark.css';
import './styles/app.css';

import { messages } from './i18n.js';
import { AppProvider } from './context.jsx';
import App from './App.jsx';

// 入口持有界面语言状态：IntlProvider + ConfigProvider 必须在入口最外层，
// ConfigProvider 统一挂外层弹层；IntlProvider 用 componentsLocales（组件内置文案）+ 项目文案合并。
function Root() {
  const [lang, setLang] = useState('zh');
  const locale = lang === 'zh' ? 'zh' : 'en';
  // 合并 eview 组件内置文案 + 项目文案（项目 key 优先）
  const mergedMessages = useMemo(
    () => Object.assign({}, componentsLocales[locale] || {}, messages[lang]),
    [locale, lang],
  );

  return (
    <ConfigProvider popupProps={{ className: 'nce-common-popup' }} onlyRenderOutside>
      <IntlProvider locale={locale === 'zh' ? 'zh-CN' : 'en-US'} messages={mergedMessages}>
        <AppProvider lang={lang} setLang={setLang}>
          <App />
        </AppProvider>
      </IntlProvider>
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
