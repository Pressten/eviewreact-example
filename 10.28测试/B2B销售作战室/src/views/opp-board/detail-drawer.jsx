import { Drawer, Tabs, Tag, Timeline } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { buildOppDetail } from "../../../src/mock/detail.js";
import { stageMap } from "../../../src/mock/stages.js";
import { fmtMoney } from "../../../src/mock/format.js";
import OwnerAvatar from "../../../src/components/owner-avatar/index.jsx";

const threatColor = { high: "#E02128", medium: "#F4840C", low: "#09AA71" };

// 商机详情抽屉 — 4 个分区(Tabs): 基本信息 / 跟进记录 / 关键联系人 / 竞争情况
export default function DetailDrawer({ opp, onClose }) {
  const open = !!opp;
  const detail = opp ? buildOppDetail(opp) : null;
  const stage = opp ? stageMap[opp.stage] : null;

  const basicFields = detail ? [
    { label: "客户名称", value: detail.basic.customer, strong: true },
    { label: "商机金额", value: fmtMoney(detail.basic.amount), color: stage?.color },
    { label: "所属阶段", value: stage ? <Tag color={stage.color} bordered={false}>{stage.label}</Tag> : "—" },
    { label: "产品线", value: detail.basic.productLineLabel },
    { label: "负责人", value: detail.basic.ownerName, color: detail.basic.ownerColor },
    { label: "所属部门", value: detail.basic.ownerDept },
    { label: "预计成交", value: detail.basic.closeDate },
    { label: "停留天数", value: `${detail.basic.stayDays} 天` },
    { label: "下一步动作", value: detail.basic.actionLabel },
    { label: "建档日期", value: detail.basic.createdAt },
    { label: "临期状态", value: detail.basic.nearExpiry ? <Tag color="error" bordered={false}>临近到期</Tag> : <Tag bordered={false}>正常</Tag> },
  ] : [];

  const tabItems = detail ? [
    {
      key: "basic",
      label: (<span className="dd__tab"><Icon name="info" size="0.875rem" />基本信息</span>),
      children: (
        <div className="dd__basic">
          {basicFields.map((f) => (
            <div className="dd__basic-item" key={f.label}>
              <span className="dd__basic-label">{f.label}</span>
              <span className="dd__basic-value" style={{ color: f.color || "var(--on-surface)", fontWeight: f.strong ? 600 : 400 }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "timeline",
      label: (<span className="dd__tab"><Icon name="rotate-ccw" size="0.875rem" />跟进记录</span>),
      children: (
        <Timeline
          className="dd__timeline"
          items={detail.timeline.map((t) => ({
            color: t.color,
            children: (
              <div className="dd__tl-item">
                <div className="dd__tl-head">
                  <span className="dd__tl-title">{t.title}</span>
                  <span className="dd__tl-date">{t.date}</span>
                </div>
                <div className="dd__tl-desc">{t.desc}</div>
              </div>
            ),
          }))}
        />
      ),
    },
    {
      key: "contacts",
      label: (<span className="dd__tab"><Icon name="users" size="0.875rem" />关键联系人</span>),
      children: (
        <div className="dd__contacts">
          {detail.contacts.map((c) => (
            <div className="dd__contact" key={c.name}>
              <div className="dd__contact-av" style={{ background: detail.basic.ownerColor }}>{c.name.slice(0, 1)}</div>
              <div className="dd__contact-main">
                <div className="dd__contact-head">
                  <span className="dd__contact-name">{c.name}</span>
                  <Tag bordered={false} className="dd__contact-role">{c.role}</Tag>
                </div>
                <div className="dd__contact-title">{c.title}</div>
                <div className="dd__contact-info">
                  <span><Icon name="phone" size="0.75rem" color="var(--on-surface-variant)" />{c.phone}</span>
                  <span><Icon name="mail" size="0.75rem" color="var(--on-surface-variant)" />{c.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "competitors",
      label: (<span className="dd__tab"><Icon name="swords" size="0.875rem" />竞争情况</span>),
      children: (
        <div className="dd__comp">
          {detail.competitors.map((c) => (
            <div className="dd__comp-item" key={c.name}>
              <div className="dd__comp-head">
                <span className="dd__comp-name">{c.name}</span>
                <Tag color={threatColor[c.threat]} bordered={false}>{c.threatLabel}</Tag>
              </div>
              <div className="dd__comp-status">{c.status}</div>
              <div className="dd__comp-win">
                <span className="dd__comp-win-label">客户中标概率</span>
                <span className="dd__comp-win-val" style={{ color: threatColor[c.threat] }}>{c.win}</span>
              </div>
            </div>
          ))}
          <div className="dd__comp-summary">
            <Icon name="lightbulb" size="0.875rem" color="var(--critical)" />
            建议:强化差异化卖点与售后服务承诺,争取在商务条款环节锁定胜局。
          </div>
        </div>
      ),
    },
  ] : [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      title={
        opp ? (
          <div className="dd__title">
            <span className="dd__title-dot" style={{ background: stage?.color }} />
            <span className="dd__title-name">{opp.customer}</span>
            <Tag color={stage?.color} bordered={false}>{stage?.label}</Tag>
            {opp.nearExpiry && <Tag color="error" bordered={false}>临期</Tag>}
          </div>
        ) : null
      }
      className="dd"
    >
      {detail && (
        <div className="dd__quick">
          <div className="dd__quick-item">
            <span className="dd__quick-label">商机金额</span>
            <span className="dd__quick-val" style={{ color: stage?.color }}>{fmtMoney(detail.basic.amount)}</span>
          </div>
          <div className="dd__quick-item">
            <span className="dd__quick-label">负责人</span>
            <span className="dd__quick-val dd__quick-owner">
              <span className="dd__quick-av" style={{ background: detail.basic.ownerColor }}>{detail.basic.ownerName.slice(0, 1)}</span>
              {detail.basic.ownerName}
            </span>
          </div>
          <div className="dd__quick-item">
            <span className="dd__quick-label">预计成交</span>
            <span className="dd__quick-val">{detail.basic.closeDate}</span>
          </div>
        </div>
      )}
      <Tabs defaultActiveKey="basic" items={tabItems} className="dd__tabs" />
    </Drawer>
  );
}
