import { Table, Collapse, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionBlock from "../../components/section-block/index.jsx";
import { slaLevels, accountManager, faqs } from "../../mock/data.js";
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
        <div className="cb-sl-manager-info">
          <div className="cb-sl-manager-avatar">
            <Icon name="user-round" size="2rem" color="#0067D1" />
          </div>
          <div className="cb-sl-manager-detail">
            <div className="cb-sl-manager-name">
              {accountManager.name}
              <span className="cb-sl-manager-title">{accountManager.title}</span>
            </div>
            <div className="cb-sl-manager-rows">
              <div className="cb-sl-manager-row">
                <Icon name="phone" size="0.875rem" />
                <a href={`tel:${accountManager.phone}`}>{accountManager.phone}</a>
              </div>
              <div className="cb-sl-manager-row">
                <Icon name="mail" size="0.875rem" />
                <span>{accountManager.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="cb-sl-manager-qr">
          <div className="cb-sl-qr-box">
            <Icon name="qr-code" size="2.25rem" color="#0067D1" />
          </div>
          <div className="cb-sl-qr-text">扫码添加企业微信</div>
          <div className="cb-sl-qr-id">{accountManager.wechat}</div>
        </div>
        <div className="cb-sl-manager-actions">
          <Button
            type="primary"
            icon={<Icon name="ticket" size="0.875rem" />}
            onClick={() => message.success("工单已创建，编号 #T-2026-1029，工程师将在 15 分钟内响应")}
          >
            提交在线工单
          </Button>
        </div>
      </div>

      <div className="cb-sl-table-title">常见问题</div>
      <Collapse items={faqItems} className="cb-sl-faq" />
    </SectionBlock>
  );
}
