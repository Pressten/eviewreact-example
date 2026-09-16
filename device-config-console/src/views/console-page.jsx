import { useState } from "react";
import Crumbs from "@nce/eview-react/Crumbs";
import Button from "@nce/eview-react/Button";
import { useIntl, FormattedMessage } from "react-intl";
import { Icon } from "../icons.jsx";
import ConfigForm from "./config-form.jsx";
import DeviceTable from "./device-table.jsx";
import ConfigModal from "./config-modal.jsx";
import { useToast } from "../components/Toast.jsx";
import "./console-page.css";

// Layer 4: 设备配置页 — 表单区 + 清单表 + 新增/编辑弹窗
export default function ConsolePage() {
  const intl = useIntl();
  const toast = useToast();
  const [modal, setModal] = useState({ open: false, record: null });

  const openCreate = () => setModal({ open: true, record: null });
  const openEdit = (record) => setModal({ open: true, record: record });
  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback });

  // Crumbs data: [{title}],最后一项无 url。title 用字符串(避免 Crumbs 对 ReactNode 的兼容性问题)
  const breadcrumbData = [
    { title: t("page.breadcrumb.home", "控制台") },
    { title: t("page.breadcrumb.group", "设备管理") },
    { title: t("page.breadcrumb.current", "设备配置") },
  ];

  return (
    <div className="page">
      <header className="page-head">
        <Crumbs data={breadcrumbData} />
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
          {/* antd Space → flex div + gap */}
          <div className="page-actions">
            <Button
              leftIcon={<Icon name="download" size={14} />}
              text={t("page.export", "导出配置")}
              onClick={() =>
                toast.success(
                  intl.formatMessage({ id: "table.exported", defaultMessage: "已导出所选配置" })
                )
              }
            />
            <Button
              status="primary"
              leftIcon={<Icon name="plus" size={14} />}
              text={t("page.create", "新增设备配置")}
              onClick={openCreate}
            />
          </div>
        </div>
      </header>

      <ConfigForm />
      <DeviceTable onEdit={openEdit} />

      <ConfigModal open={modal.open} record={modal.record} onCancel={closeModal} />
    </div>
  );
}
