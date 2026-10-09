// Layer 4 — 侧边辅助信息（填写完成度 / 提示 / 最近工单）

import { IconPlusIcDigitalPowerDpDocText, IconPlusIcDigitalPowerDpTips, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcIctServers, IconPlusIcPublicCheckmark, IconPlusIcPublicClipboard, IconPlusIcPublicClock, IconPlusIcPublicListBullet, IconPlusIcPublicPaperclip, IconPlusIcPublicTelephone } from '@nce/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import { fillTips, recentOrders } from "../../mock/workOrder.jsx";
import "./index.css";

const SECTIONS = [
  { key: "base", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "基本信息" },
  { key: "device", icon: <IconPlusIcIctServers iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "设备与位置" },
  { key: "issue", icon: <IconPlusIcDigitalPowerDpDocText iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "问题描述" },
  { key: "assign", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "处理与指派" },
  { key: "attach", icon: <IconPlusIcPublicPaperclip iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "附件材料" },
  { key: "contact", icon: <IconPlusIcPublicTelephone iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" />, label: "联系与确认" },
];

export default function FormAside({ progress }) {
  const doneCount = Math.round((progress / 100) * SECTIONS.length);

  return (
    <div className="form-aside">
      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicListBullet iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
            填写完成度
          </h3>
          <span className="aside-card__percent">{progress}%</span>
        </header>
        <div className="aside-progress" style={{
          height: "8px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          <div style={{
            width: Math.min(100, Math.max(0, progress)) + "%",
            height: "100%",
            background: "var(--primary, #0067D1)",
            transition: "width .2s",
          }} />
        </div>
        <ul className="aside-checklist">
          {SECTIONS.map(function (s, i) {
            const done = i < doneCount;
            return (
              <li className={"aside-checklist__item" + (done ? " aside-checklist__item--done" : "")} key={s.key}>
                {done ? <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} className="aside-checklist__icon" /> : s.icon}
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
            <IconPlusIcDigitalPowerDpTips iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
            填写提示
          </h3>
        </header>
        <ul className="aside-tips">
          {fillTips.map(function (t, i) {
            return (
              <li className="aside-tips__item" key={i}>
                {t.icon}
                <span>{t.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} className="aside-card__icon" />
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
