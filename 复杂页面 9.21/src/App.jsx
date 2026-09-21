import { useState } from 'react';
import { useApp } from './context.jsx';
import { ToastProvider } from './shared/toast.jsx';
import { Icon } from './shared/icon.jsx';
import HeaderBar from './views/header-bar/index.jsx';
import SideNav from './views/side-nav/index.jsx';
import StrategyForm from './views/strategy-form/index.jsx';
import StrategyTable from './views/strategy-table/index.jsx';
import StrategyModal from './views/strategy-modal/index.jsx';

// Layer 5: 根容器装配 — 页面骨架 + 弹窗
// ConfigProvider / IntlProvider / componentsLocales 已上提至入口 src/main.jsx。
function Shell() {
  const { lang } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openModal = (record) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  const crumb = lang === 'zh' ? '首页 / 策略配置 / 参数配置' : 'Home / Strategy / Parameters';
  const title = lang === 'zh' ? '策略配置' : 'Strategy Configuration';
  const desc = lang === 'zh'
    ? '按设备类型下发采集与告警策略，保存后 5 分钟内自动生效。'
    : 'Deliver collection and alarm strategies per device type. Changes take effect within 5 minutes.';
  const importText = lang === 'zh' ? '导入配置' : 'Import';
  const newText = lang === 'zh' ? '新建策略' : 'New Strategy';

  return (
    <div className="app-root">
      <HeaderBar />

      <div className="app-body">
        <SideNav />

        <main className="app-main">
          <div className="app-page-head">
            <div className="app-page-head__text">
              <span className="app-page-head__crumb">{crumb}</span>
              <h1 className="app-page-head__title">{title}</h1>
              <p className="app-page-head__desc">{desc}</p>
            </div>
            <div className="app-page-head__actions">
              <button type="button" className="app-page-head__btn" onClick={() => openModal(null)}>
                <Icon name="download" size={14} />
                {importText}
              </button>
              <button
                type="button"
                className="app-page-head__btn app-page-head__btn--primary"
                onClick={() => openModal(null)}
              >
                <Icon name="plus" size={14} />
                {newText}
              </button>
            </div>
          </div>

          <div className="app-main__stack">
            <StrategyForm onOpenModal={() => openModal(null)} />
            <StrategyTable onEdit={openModal} />
          </div>
        </main>
      </div>

      <StrategyModal isOpen={modalOpen} record={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
