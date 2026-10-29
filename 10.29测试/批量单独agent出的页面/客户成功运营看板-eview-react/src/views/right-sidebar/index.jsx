import { useState } from "react";
import { IconPlusIcPublicCalendar, IconPlusIcPublicFlash, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import DivMessage from "@nce/eview-react/DivMessage";
import SectionCard from "../../components/section-card/index.jsx";
import { expiringCustomers, quickActions } from "../../mock/dashboard.jsx";
import "./index.css";

// ⑦ 右侧栏 — 30 天内到期客户榜单(6 条,各带跟进按钮)+ 快捷操作入口(4 个,各带图标)
// antd message.info → eview DivMessage（无命令式 API，改渲染式 + fixed 浮层 + key 轮换）
export default function RightSidebar() {
  const [notice, setNotice] = useState(null);
  const handleFollow = (name) => setNotice({ key: Date.now(), text: `发起跟进 · ${name}` });
  const handleAction = (label) => setNotice({ key: Date.now(), text: `${label}` });

  return (
    <div className="right-sidebar">
      <SectionCard
        title="30 天内到期客户"
        icon={<IconPlusIcPublicCalendar iconSize="1.25rem" iconColor={['currentcolor']} className="section-card-icon" />}
        extra={<a className="link-action">全部</a>}
        className="expiring-card"
      >
        <ul className="expiring-list">
          {expiringCustomers.map((c) => (
            <li key={c.id} className="expiring-item">
              <div className="expiring-main">
                <div className="expiring-name-row">
                  <span className="expiring-name">{c.companyName}</span>
                  <span className={`expiring-urgent ${c.daysLeft <= 7 ? "is-urgent" : ""}`}>
                    {c.daysLeft} 天
                  </span>
                </div>
                <div className="expiring-meta">
                  <span className="expiring-date">
                    <IconPlusIcPublicCalendar iconSize="0.75rem" iconColor={['currentcolor']} /> {c.renewalDate}
                  </span>
                  <span className="expiring-amount">¥{c.amount}万</span>
                  <span className="expiring-csm">{c.csm}</span>
                </div>
              </div>
              <button
                className="follow-btn"
                type="button"
                onClick={() => handleFollow(c.companyName)}
              >
                <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
                跟进
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="快捷操作" icon={<IconPlusIcPublicFlash iconSize="1.25rem" iconColor={['currentcolor']} className="section-card-icon" />} className="quick-card">
        <div className="quick-grid">
          {quickActions.map((a) => (
            <button
              key={a.key}
              className="quick-item"
              type="button"
              onClick={() => handleAction(a.label)}
            >
              <span className="quick-icon">
                {a.icon}
              </span>
              <span className="quick-label">{a.label}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {notice && (
        <div className="notice-overlay">
          <DivMessage
            key={notice.key}
            display
            type="default"
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
    </div>
  );
}
