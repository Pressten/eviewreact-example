// Layer 4: 设备配置页 — 表单区 + 清单表 + 新增/编辑弹窗
// Breadcrumb→Crumbs;Space→flex div;message.success→ToastProvider(DivMessage 渲染式)
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@nce/eview-react/Button";
import Crumbs from "@nce/eview-react/Crumbs";
import ConfigForm from "./config-form.jsx";
import DeviceTable from "./device-table.jsx";
import ConfigModal from "./config-modal.jsx";
import { ToastProvider, useToast } from "../components/Toast.jsx";
import "./console-page.css";

function PageActions({ openCreate }) {
  const intl = useIntl();
  const toast = useToast();
  const t = (id, fallback) => intl.formatMessage({ id: id, defaultMessage: fallback });

  return (
    // TODO(eview-react): Space 无对应,flex div + gap 替代
    <div className="page-actions">
      <Button
        text={<FormattedMessage id="page.export" defaultMessage="导出配置" />}
        onClick={() => toast("success", t("table.exported", "已导出所选配置"))}
      />
      <Button status="primary" text={<FormattedMessage id="page.create" defaultMessage="新增设备配置" />} onClick={openCreate} />
    </div>
  );
}

export default function ConsolePage() {
  const intl = useIntl();
  const [modal, setModal] = useState({ open: false, record: null });

  const openCreate = () => setModal({ open: true, record: null });
  const openEdit = (record) => setModal({ open: true, record: record });
  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const crumbsData = [
    { title: intl.formatMessage({ id: "page.breadcrumb.home", defaultMessage: "控制台" }) },
    { title: intl.formatMessage({ id: "page.breadcrumb.group", defaultMessage: "设备管理" }) },
    { title: intl.formatMessage({ id: "page.breadcrumb.current", defaultMessage: "设备配置" }) },
  ];

  return (
    <ToastProvider>
      <div className="page">
        <header className="page-head">
          <Crumbs data={crumbsData} seprator="/" className="page-crumbs" />
          <div className="page-head-row">
            <div className="page-head-text">
              <h1 className="page-title">
                <FormattedMessage id="page.title" defaultMessage="设备配置" />
              </h1>
              <p className="page-desc">
                <FormattedMessage
                  id="page.desc"
                  defaultMessage="统一维护设备的采集策略、上报协议与运行参数，保存后自动下发至目标站点。"
                />
              </p>
            </div>
            <PageActions openCreate={openCreate} />
          </div>
        </header>

        <ConfigForm />
        <DeviceTable onEdit={openEdit} />

        <ConfigModal open={modal.open} record={modal.record} onCancel={closeModal} />
      </div>
    </ToastProvider>
  );
}
