import { useState } from "react";
import { Button, Tag, Badge, Modal, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { contract } from "../../mock/data.js";
import "./index.css";

const STATUS_COLOR = {
  success: "success",
  warning: "warning",
  error: "error",
};

export default function PageHeader() {
  const { isDark, toggleDark } = useApp();
  const [renewalOpen, setRenewalOpen] = useState(false);

  return (
    <header className="cb-page-header">
      <div className="cb-ph-main">
        <div className="cb-ph-logo">
          <Icon name="building-2" size="2rem" color="#FFFFFF" />
        </div>
        <div className="cb-ph-info">
          <div className="cb-ph-title-row">
            <h2>{contract.enterpriseName}</h2>
            <Tag color={STATUS_COLOR[contract.status]}>{contract.statusText}</Tag>
          </div>
          <div className="cb-ph-meta">
            <span className="cb-ph-meta-item">
              <Icon name="file-text" size="0.875rem" />
              合同编号：{contract.contractNo}
            </span>
            <span className="cb-ph-meta-divider" />
            <span className="cb-ph-meta-item">
              <Icon name="calendar-days" size="0.875rem" />
              签约 {contract.signDate}
            </span>
            <span className="cb-ph-meta-divider" />
            <span className="cb-ph-meta-item">
              <Icon name="calendar-clock" size="0.875rem" />
              到期 {contract.expireDate}
            </span>
            <span className="cb-ph-meta-divider" />
            <Badge
              count={contract.renewalDays}
              overflowCount={999}
              color={contract.renewalDays <= 30 ? "#E02128" : "#F4840C"}
            >
              <span className="cb-ph-days-anchor">
                <Icon name="clock" size="1rem" />
                <span>剩余天数</span>
              </span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="cb-ph-actions">
        <Icon
          name={isDark ? "sun" : "moon"}
          size="1.25rem"
          className="cb-ph-theme-toggle"
          title={isDark ? "切换到亮色" : "切换到暗色"}
          onClick={toggleDark}
        />
        <Button
          icon={<Icon name="download" size="0.875rem" />}
          onClick={() => message.success("合同 PDF 已开始下载，请留意浏览器下载栏")}
        >
          下载合同
        </Button>
        <Button
          type="primary"
          icon={<Icon name="refresh-cw" size="0.875rem" />}
          onClick={() => setRenewalOpen(true)}
        >
          发起续约
        </Button>
        <Button
          icon={<Icon name="headset" size="0.875rem" />}
          onClick={() => message.success("已通知客户经理王思齐，将在 1 小时内与您联系")}
        >
          联系客户经理
        </Button>
      </div>

      <Modal
        open={renewalOpen}
        title="发起合同续约"
        onCancel={() => setRenewalOpen(false)}
        onOk={() => {
          setRenewalOpen(false);
          message.success("续约申请已提交，客户经理将在 1 个工作日内发送正式续约方案");
        }}
        okText="提交续约申请"
        cancelText="再想想"
      >
        <div className="cb-ph-renewal-modal">
          <div className="cb-ph-rm-row">
            <span>当前合同</span>
            <strong>{contract.contractNo}</strong>
          </div>
          <div className="cb-ph-rm-row">
            <span>到期日期</span>
            <strong>{contract.expireDate}</strong>
          </div>
          <div className="cb-ph-rm-row">
            <span>剩余天数</span>
            <strong>{contract.renewalDays} 天</strong>
          </div>
          <div className="cb-ph-rm-tip">
            提交后客户经理将基于您的用量推荐最优续约方案，可在「续约与变更」区块查看推荐方案对比。
          </div>
        </div>
      </Modal>
    </header>
  );
}
