import Table from "@nce/eview-react/Table";
import { IconPlusIcBpitTicket, IconPlusIcCarUser, IconPlusIcDigitalPowerSecurityProtection, IconPlusIcPublicMailing, IconPlusIcPublicQrcode, IconPlusIcPublicTelephone } from '@hui/icon-plus';
import Panel, { PanelItem } from "@nce/eview-react/Panel";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { useState } from "react";
import SectionBlock from "../../components/section-block/index.jsx";
import { slaLevels, accountManagers, faqs } from "../../mock/data.js";
import "./index.css";

export default function SlaSupport() {
  // DivMessage 渲染式通知（替代 antd 命令式 message）
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const closeNotice = () => setNotice(null);

  // Panel：手风琴模式（enableMultiExpand={false}）
  const [openIdx, setOpenIdx] = useState([]);

  const slaColumns = [
    { title: "服务指标", key: "metric", allowSort: false },
    {
      title: "目标承诺",
      key: "target",
      allowSort: false,
      render: (v) => <span className="cb-sl-target">{v}</span>,
    },
    { title: "说明", key: "note", allowSort: false },
  ];

  return (
    <SectionBlock
      id="sla-support"
      title="SLA 与支持"
      icon={<IconPlusIcDigitalPowerSecurityProtection iconSize="1.25rem" iconColor={['#0067D1']} />}
    >
      <div className="cb-sl-table-title">服务等级承诺</div>
      <Table
        columns={slaColumns}
        dataset={slaLevels}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        width="unset"
      />

      <div className="cb-sl-manager-card">
        {accountManagers.map((m) => (
          <div className="cb-sl-manager-cell" key={m.name}>
            <div className="cb-sl-manager-info">
              <div className="cb-sl-manager-avatar">
                <IconPlusIcCarUser iconSize="2rem" iconColor={['#0067D1']} />
              </div>
              <div className="cb-sl-manager-detail">
                <div className="cb-sl-manager-name">
                  {m.name}
                  <span className="cb-sl-manager-title">{m.title}</span>
                </div>
                <div className="cb-sl-manager-rows">
                  <div className="cb-sl-manager-row">
                    <IconPlusIcPublicTelephone iconSize="0.875rem" iconColor={['currentcolor']} />
                    <a href={`tel:${m.phone}`}>{m.phone}</a>
                  </div>
                  <div className="cb-sl-manager-row">
                    <IconPlusIcPublicMailing iconSize="0.875rem" iconColor={['currentcolor']} />
                    <span>{m.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cb-sl-manager-side">
              <div className="cb-sl-manager-qr">
                <div className="cb-sl-qr-box">
                  <IconPlusIcPublicQrcode iconSize="2.25rem" iconColor={['#0067D1']} />
                </div>
                <div className="cb-sl-qr-text">扫码添加企业微信</div>
                <div className="cb-sl-qr-id">{m.wechat}</div>
              </div>
              <div className="cb-sl-manager-actions">
                <Button
                  status="primary"
                  leftIcon={<IconPlusIcBpitTicket iconSize="0.875rem" iconColor={['currentcolor']} />}
                  text={m.button}
                  onClick={() => notify("success", m.tip)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cb-sl-table-title">常见问题</div>
      <Panel
        className="cb-sl-faq"
        enableMultiExpand={false}
        selectedIndex={openIdx}
        onExpand={(index) => setOpenIdx([index])}
        onClose={() => setOpenIdx([])}
      >
        {faqs.map((f) => (
          <PanelItem key={f.key} title={<span className="cb-sl-faq-q">{f.q}</span>} closable={false}>
            <p className="cb-sl-faq-a">{f.a}</p>
          </PanelItem>
        ))}
      </Panel>

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
    </SectionBlock>
  );
}
