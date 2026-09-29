// Layer 4 — 侧边辅助信息（填写完成度 / 提示 / 最近工单）

import {
  IconPlusIcPublicClipboard,
  IconPlusIcPublicCheckmark,
  IconPlusIcPublicClock,
  IconPlusIcIctBuiltServer,
  IconPlusIcPublicNotes,
  IconPlusIcPublicInfo,
  IconPlusIcPublicPaperclip,
  IconPlusIcPublicTelephone,
  IconPlusIcIctPerson,
  IconPlusIcIctProtectNetworkSecurity,
} from "@nce/icon-plus";
import StatusTag from "../../components/status-tag/index.jsx";
import { fillTips, recentOrders } from "../../mock/workOrder.js";
import "./index.css";

const iconColor = ["currentcolor"];

// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版（见 handwrite-templates.md §9）
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent || 0));
  return (
    <div className="aside-progress" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{
        flex: 1,
        height: "8px",
        background: "var(--hover, rgba(0,0,0,0.05))",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          width: p + "%",
          height: "100%",
          background: "var(--primary)",
          transition: "width .2s",
        }} />
      </div>
    </div>
  );
}

const SECTION_ICONS = {
  base: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={iconColor} />,
  device: <IconPlusIcIctBuiltServer iconSize="0.875rem" iconColor={iconColor} />,
  issue: <IconPlusIcPublicNotes iconSize="0.875rem" iconColor={iconColor} />,
  assign: <IconPlusIcIctPerson iconSize="0.875rem" iconColor={iconColor} />,
  attach: <IconPlusIcPublicPaperclip iconSize="0.875rem" iconColor={iconColor} />,
  contact: <IconPlusIcPublicTelephone iconSize="0.875rem" iconColor={iconColor} />,
};

const SECTIONS = [
  { key: "base", label: "基本信息" },
  { key: "device", label: "设备与位置" },
  { key: "issue", label: "问题描述" },
  { key: "assign", label: "处理与指派" },
  { key: "attach", label: "附件材料" },
  { key: "contact", label: "联系与确认" },
];

const TIP_ICONS = {
  lightbulb: <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={iconColor} />,
  clock: <IconPlusIcPublicClock iconSize="0.875rem" iconColor={iconColor} />,
  paperclip: <IconPlusIcPublicPaperclip iconSize="0.875rem" iconColor={iconColor} />,
  "shield-check": <IconPlusIcIctProtectNetworkSecurity iconSize="0.875rem" iconColor={iconColor} />,
};

export default function FormAside({ progress }) {
  const doneCount = Math.round((progress / 100) * SECTIONS.length);

  return (
    <div className="form-aside">
      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicClipboard iconSize="1rem" iconColor={iconColor} className="aside-card__icon" />
            填写完成度
          </h3>
          <span className="aside-card__percent">{progress}%</span>
        </header>
        <SimpleProgress percent={progress} />
        <ul className="aside-checklist">
          {SECTIONS.map(function (s, i) {
            const done = i < doneCount;
            return (
              <li className={"aside-checklist__item" + (done ? " aside-checklist__item--done" : "")} key={s.key}>
                {done ? (
                  <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={iconColor} className="aside-checklist__icon" />
                ) : (
                  SECTION_ICONS[s.key]
                )}
                <span>{s.label}</span>
                <span className="aside-checklist__state">{done ? "已填写" : "待填写"}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicInfo iconSize="1rem" iconColor={iconColor} className="aside-card__icon" />
            填写提示
          </h3>
        </header>
        <ul className="aside-tips">
          {fillTips.map(function (t, i) {
            return (
              <li className="aside-tips__item" key={i}>
                {TIP_ICONS[t.icon] || <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={iconColor} />}
                <span>{t.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicClock iconSize="1rem" iconColor={iconColor} className="aside-card__icon" />
            我的最近工单
          </h3>
          <a className="aside-card__link" href="#" onClick={function (e) { e.preventDefault(); }}>全部</a>
        </header>
        <ul className="aside-orders">
          {recentOrders.map(function (o) {
            return (
              <li className="aside-orders__item" key={o.id}>
                <div className="aside-orders__row">
                  <a className="aside-orders__title" href="#" onClick={function (e) { e.preventDefault(); }}>
                    {o.title}
                  </a>
                  <StatusTag status={o.status} />
                </div>
                <div className="aside-orders__meta">
                  <span>{o.id}</span>
                  <span>{o.time}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
