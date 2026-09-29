import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@nce/eview-react/Button";
import { Icon } from "./shared/icon.jsx";
import { useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import StrategyForm from "./views/strategy-form/index.jsx";
import StrategyTable from "./views/strategy-table/index.jsx";
import StrategyModal from "./views/strategy-modal/index.jsx";
import "./app.css";

function Shell() {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
                <FormattedMessage id="page.title" defaultMessage="策略配置" />
              </h1>
              <p className="app-page-head__desc">
                <FormattedMessage id="page.desc" defaultMessage="按设备类型下发采集与告警策略，保存后 5 分钟内自动生效。" />
              </p>
            </div>
            <div className="app-page-head__actions">
              <Button
                text={t("page.import")}
                leftIcon={<Icon name="download" size={14} />}
                className="app-page-head__btn"
                onClick={() => openModal(null)}
              />
              <Button
                status="primary"
                text={t("page.new")}
                leftIcon={<Icon name="plus" size={14} />}
                className="app-page-head__btn app-page-head__btn--primary"
                onClick={() => openModal(null)}
              />
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
  );
}

export default function App() {
  return <Shell />;
}
