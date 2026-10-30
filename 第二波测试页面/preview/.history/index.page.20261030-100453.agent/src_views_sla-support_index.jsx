import { Table, Collapse, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionBlock from "../../components/section-block/index.jsx";
import { slaLevels, accountManagers, faqs } from "../../mock/data.js";
import "./index.css";

export default function SlaSupport() {
  const slaColumns = [
    { title: "服务指标", dataIndex: "metric", key: "metric" },
    {
      title: "目标承诺",
      dataIndex: "target",
      key: "target",
      render: (v) => <span className="cb-sl-target">{v}</span>,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  const faqItems = faqs.map((f) => ({
    key: f.key,
    label: <span className="cb-sl-faq-q">{f.q}</span>,
    children: <p className="cb-sl-faq-a">{f.a}</p>,
  }));

  return (
    <SectionBlock
      id="sla-support"
      title="SLA 与支持"
      icon={<Icon name="shield-check" size="1.25rem" color="#0067D1" />}
    >
      <div className="cb-sl-table-title">服务等级承诺</div>
      <Table
        size="large"
        rowKey="key"
        columns={slaColumns}
        dataSource={slaLevels}
        pagination={false}
      />

      <div className="cb-sl-manager-card">
        {accountManagers.map((m) => (
          <div className="cb-sl-manager-cell" key={m.name}>
            <div className="cb-sl-manager-info">
              <div className="cb-sl-manager-avatar">
                <Icon name="user-round" size="2rem" color="#0067D1" />
              </div>
              <div className="cb-sl-manager-detail">
                <div className="cb-sl-manager-name">
                  {m.name}
                  <span className="cb-sl-manager-title">{m.title}</span>
                </div>
                <div className="cb-sl-manager-rows">
                  <div className="cb-sl-manager-row">
                    <Icon name="phone" size="0.875rem" />
                    <a href={`tel:${m.phone}`}>{m.phone}</a>
                  </div>
                  <div className="cb-sl-manager-row">
                    <Icon name="mail" size="0.875rem" />
                    <span>{m.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cb-sl-manager-side">
              <div className="cb-sl-manager-qr">
                <div className="cb-sl-qr-box">
                  <Icon name="qr-code" size="2.25rem" color="#0067D1" />
                </div>
                <div className="cb-sl-qr-text">扫码添加企业微信</div>
                <div className="cb-sl-qr-id">{m.wechat}</div>
              </div>
              <div className="cb-sl-manager-actions">
                <Button
                  type="primary"
                  icon={<Icon name="ticket" size="0.875rem" />}
                  onClick={() => message.success(m.tip)}
                >
                  {m.button}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cb-sl-table-title">常见问题</div>
      <Collapse items={faqItems} className="cb-sl-faq" />
    </SectionBlock>
  );
}
