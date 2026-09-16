import { useState } from "react";
import { Breadcrumb, Button, Space, message } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../assets/shared/icons.js";
import ConfigForm from "./config-form.jsx";
import DeviceTable from "./device-table.jsx";
import ConfigModal from "./config-modal.jsx";
import "./console-page.css";

// Layer 4: 设备配置页 — 表单区 + 清单表 + 新增/编辑弹窗
export default function ConsolePage() {
  const intl = useIntl();
  const [modal, setModal] = useState({ open: false, record: null });

  const openCreate = () => setModal({ open: true, record: null });
  const openEdit = (record) => setModal({ open: true, record: record });
  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const breadcrumbItems = [
    { title: <FormattedMessage id="page.breadcrumb.home" defaultMessage="控制台" /> },
    { title: <FormattedMessage id="page.breadcrumb.group" defaultMessage="设备管理" /> },
    { title: <FormattedMessage id="page.breadcrumb.current" defaultMessage="设备配置" /> },
  ];

  return (
    <div className="page">
      <header className="page-head">
        <Breadcrumb items={breadcrumbItems} />
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
          <Space size={8} className="page-actions">
            <Button
              icon={<Icon name="download" size={14} />}
              onClick={() =>
                message.success(
                  intl.formatMessage({ id: "table.exported", defaultMessage: "已导出所选配置" })
                )
              }
            >
              <FormattedMessage id="page.export" defaultMessage="导出配置" />
            </Button>
            <Button type="primary" icon={<Icon name="plus" size={14} />} onClick={openCreate}>
              <FormattedMessage id="page.create" defaultMessage="新增设备配置" />
            </Button>
          </Space>
        </div>
      </header>

      <ConfigForm />
      <DeviceTable onEdit={openEdit} />

      <ConfigModal open={modal.open} record={modal.record} onCancel={closeModal} />
    </div>
  );
}
