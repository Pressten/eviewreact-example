// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 皮肤 / 语言 / 侧边栏折叠)
//   Layer 2 mock data     → src/mock/              (strategy.js: 选项集 + 策略清单)
//   Layer 3 reusable      → src/components/        (status-tag / strategy-fields)
//   Layer 4 views         → src/views/             (header-bar / side-nav / strategy-form / strategy-table / strategy-modal)
//   Layer 5 layout        → app.jsx                (Provider + 根容器装配)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import { IntlProvider } from "react-intl";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider, useApp } from "./src/context.jsx";
import { messages } from "./src/i18n.js";
import { Icon } from "./assets/shared/icons.js";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import StrategyForm from "./src/views/strategy-form/index.jsx";
import StrategyTable from "./src/views/strategy-table/index.jsx";
import StrategyModal from "./src/views/strategy-modal/index.jsx";
import "./app.css";

function Shell() {
  const { lang } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // 语言切换需同步 dayjs（antd 文案由 ConfigProvider locale 驱动）
  useEffect(() => {
    dayjs.locale(lang === "zh" ? "zh-cn" : "en");
  }, [lang]);

  const openModal = (record) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  return (
    <IntlProvider locale={lang === "zh" ? "zh-CN" : "en-US"} messages={messages[lang]}>
      <ConfigProvider locale={lang === "zh" ? zhCN : undefined}>
        <div className="app-root">
          <HeaderBar />

          <div className="app-body">
            <SideNav />

            <main className="app-main">
              <div className="app-page-head">
                <div className="app-page-head__text">
                  <span className="app-page-head__crumb">
                    {lang === "zh" ? "首页 / 策略配置 / 参数配置" : "Home / Strategy / Parameters"}
                  </span>
                  <h1 className="app-page-head__title">
                    {lang === "zh" ? "策略配置" : "Strategy Configuration"}
                  </h1>
                  <p className="app-page-head__desc">
                    {lang === "zh"
                      ? "按设备类型下发采集与告警策略，保存后 5 分钟内自动生效。"
                      : "Deliver collection and alarm strategies per device type. Changes take effect within 5 minutes."}
                  </p>
                </div>
                <div className="app-page-head__actions">
                  <button type="button" className="app-page-head__btn" onClick={() => openModal(null)}>
                    <Icon name="download" size={14} />
                    {lang === "zh" ? "导入配置" : "Import"}
                  </button>
                  <button
                    type="button"
                    className="app-page-head__btn app-page-head__btn--primary"
                    onClick={() => openModal(null)}
                  >
                    <Icon name="plus" size={14} />
                    {lang === "zh" ? "新建策略" : "New Strategy"}
                  </button>
                </div>
              </div>

              <div className="app-main__stack">
                <StrategyForm onOpenModal={() => openModal(null)} />
                <StrategyTable onEdit={openModal} />
              </div>
            </main>
          </div>

          <StrategyModal open={modalOpen} record={editing} onClose={() => setModalOpen(false)} />
        </div>
      </ConfigProvider>
    </IntlProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
