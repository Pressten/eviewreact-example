// Layer 4 — 侧边辅助信息（填写完成度 / 提示 / 最近工单）

import { Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { fillTips, recentOrders } from "../../mock/workOrder.js";
import "./index.css";

const SECTIONS = [
  { key: "base", icon: "clipboard-list", label: "基本信息" },
  { key: "device", icon: "server", label: "设备与位置" },
  { key: "issue", icon: "file-text", label: "问题描述" },
  { key: "assign", icon: "users", label: "处理与指派" },
  { key: "attach", icon: "paperclip", label: "附件材料" },
  { key: "contact", icon: "phone", label: "联系与确认" },
];

export default function FormAside({ progress }) {
  const doneCount = Math.round((progress / 100) * SECTIONS.length);

  return (
    <div className="form-aside">
      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <Icon name="list-checks" size="1rem" className="aside-card__icon" />
            填写完成度
          </h3>
          <span className="aside-card__percent">{progress}%</span>
        </header>
        <Progress percent={progress} showInfo={false} strokeColor="var(--primary)" />
        <ul className="aside-checklist">
          {SECTIONS.map(function (s, i) {
            const done = i < doneCount;
            return (
              <li className={"aside-checklist__item" + (done ? " aside-checklist__item--done" : "")} key={s.key}>
                <Icon name={done ? "circle-check" : s.icon} size="0.875rem" className="aside-checklist__icon" />
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
            <Icon name="lightbulb" size="1rem" className="aside-card__icon" />
            填写提示
          </h3>
        </header>
        <ul className="aside-tips">
          {fillTips.map(function (t, i) {
            return (
              <li className="aside-tips__item" key={i}>
                <Icon name={t.icon} size="0.875rem" className="aside-tips__icon" />
                <span>{t.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="aside-card">
        <header className="aside-card__head">
          <h3 className="aside-card__title">
            <Icon name="clock" size="1rem" className="aside-card__icon" />
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
