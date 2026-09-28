// App entry — ICT React page (eview-react)
// 分层（每个组件一个文件夹，kebab-case + index.jsx/index.css）：
//   Layer 1 全局 state    → src/context.jsx         (AppProvider: 皮肤 / 语言 / 侧边栏折叠)
//   Layer 2 mock 数据     → src/mock/                (strategy.js: 选项集 + 策略清单)
//   Layer 3 复用组件      → src/components/          (status-tag / strategy-fields)
//   Layer 4 视图          → src/views/               (header-bar / side-nav / strategy-form / strategy-table / strategy-modal)
//   Layer 5 布局          → app.jsx                  (根容器装配)
//
// 样式：组件文件夹内 index.css 自带样式；视觉值优先用 token。
// Provider / IntlProvider / dayjs locale 同步在 main.jsx，本文件不放。

import { useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "./context.jsx";
import { Icon } from "./shared/icon.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import StrategyForm from "./views/strategy-form/index.jsx";
import StrategyTable from "./views/strategy-table/index.jsx";
import StrategyModal from "./views/strategy-modal/index.jsx";
import "./app.css";

function Shell() {
  const { lang } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const openModal = (record) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  return (
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

          {notice ? (
            <DivMessage
              key={notice.key}
              display
              type={notice.type}
              text={notice.text}
              disposeTimeOut={5000}
              onClose={() => setNotice(null)}
              style={{ marginBottom: "var(--spacing-4)" }}
            />
          ) : null}

          <div className="app-main__stack">
            <StrategyForm onOpenModal={() => openModal(null)} />
            <StrategyTable onEdit={openModal} onNotify={notify} />
          </div>
        </main>
      </div>

      <StrategyModal
        open={modalOpen}
        record={editing}
        onClose={() => setModalOpen(false)}
        onNotify={notify}
      />
    </div>
  );
}

export default function App() {
  return <Shell />;
}
