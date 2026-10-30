import { useState } from "react";
import { IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicBuilding, IconPlusIcPublicCalendar, IconPlusIcPublicClock, IconPlusIcPublicDocClock, IconPlusIcPublicDownload, IconPlusIcPublicHeadset, IconPlusIcPublicMoon, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSun } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Tag from "@/shared/Tag";
import Badge from "@nce/eview-react/Badge";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
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
  // DivMessage 渲染式通知（替代 antd 命令式 message）
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const closeNotice = () => setNotice(null);

  // 剩余天数的警示色映射到 Badge status（default/success/error/warning/off）
  const renewalStatus =
    contract.renewalDays <= 30 ? "error" : "warning";

  return (
    <header className="cb-page-header">
      <div className="cb-ph-main">
        <div className="cb-ph-logo">
          <IconPlusIcPublicBuilding iconSize="2rem" iconColor={['#0067D1']} />
        </div>
        <div className="cb-ph-info">
          <div className="cb-ph-title-row">
            <h2>{contract.enterpriseName}</h2>
            <Tag color={STATUS_COLOR[contract.status]}>{contract.statusText}</Tag>
          </div>
          <div className="cb-ph-meta">
            <span className="cb-ph-meta-item">
              <IconPlusIcDigitalPowerDpDocText iconSize="0.875rem" iconColor={['currentcolor']} />
              合同编号：{contract.contractNo}
            </span>
            <span className="cb-ph-meta-divider" />
            <span className="cb-ph-meta-item">
              <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['currentcolor']} />
              签约 {contract.signDate}
            </span>
            <span className="cb-ph-meta-divider" />
            <span className="cb-ph-meta-item">
              <IconPlusIcPublicDocClock iconSize="0.875rem" iconColor={['currentcolor']} />
              到期 {contract.expireDate}
            </span>
            <span className="cb-ph-meta-divider" />
            <Badge
              content={contract.renewalDays}
              max={999}
              status={renewalStatus}
            >
              <span className="cb-ph-days-anchor">
                <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />
                <span>剩余天数</span>
              </span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="cb-ph-actions">
        {isDark ? <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} className="cb-ph-theme-toggle" title="切换到亮色" onClick={toggleDark} /> : <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} className="cb-ph-theme-toggle" title="切换到暗色" onClick={toggleDark} />}
        <Button
          leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="下载合同"
          onClick={() => notify("success", "合同 PDF 已开始下载，请留意浏览器下载栏")}
        />
        <Button
          status="primary"
          leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="发起续约"
          onClick={() => setRenewalOpen(true)}
        />
        <Button
          leftIcon={<IconPlusIcPublicHeadset iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="联系客户经理"
          onClick={() => notify("success", "已通知客户经理王思齐，将在 1 小时内与您联系")}
        />
      </div>

      <Dialog
        title="发起合同续约"
        isOpen={renewalOpen}
        onClose={() => setRenewalOpen(false)}
        size={[480, "auto"]}
        buttons={[
          { text: "再想想", onClick: () => setRenewalOpen(false) },
          {
            text: "提交续约申请",
            status: "primary",
            onClick: () => {
              setRenewalOpen(false);
              notify("success", "续约申请已提交，客户经理将在 1 个工作日内发送正式续约方案");
            },
          },
        ]}
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
      </Dialog>

      {notice ? (
        <div className="cb-notice-floating">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={closeNotice}
          />
        </div>
      ) : null}
    </header>
  );
}
