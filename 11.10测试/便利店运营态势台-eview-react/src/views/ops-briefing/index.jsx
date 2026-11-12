import { useState } from "react";
import { IconPlusIcPublicClose, IconPlusIcPublicHorn } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { INSPECTION_ISSUES, LICENSE_ALERTS, stockoutUrgency } from "../../mock/data.js";
import "./index.css";

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function OpsBriefing() {
  const { stores } = useApp();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const pending = stores.filter((s) => s.stockoutSku > 0 && !s.restocked);
  const urgent = pending.filter((s) => stockoutUrgency(s) === "2小时");
  const openHigh = INSPECTION_ISSUES.filter((i) => i.severity === "高" && i.status !== "已整改");
  const expiring = LICENSE_ALERTS.filter((l) => l.daysLeft < 30);

  return (
    <div className="ob-banner">
      <span className="ob-icon">
        <IconPlusIcPublicHorn iconSize="1rem" iconColor={['currentcolor']} />
      </span>
      <b className="ob-title">运营快报</b>
      <div className="ob-chips">
        <button
          type="button"
          className="ob-chip"
          onClick={() => scrollToSection(".sp-card-root")}
          title="定位到补给看板"
        >
          <i className="ob-dot dot-error" />
          待补货 <b>{pending.length}</b> 家 · 2小时紧急 <b>{urgent.length}</b> 家
        </button>
        <button
          type="button"
          className="ob-chip"
          onClick={() => scrollToSection(".ip-card")}
          title="定位到巡检与合规"
        >
          <i className="ob-dot dot-error" />
          高危巡检未闭环 <b>{openHigh.length}</b> 起
        </button>
        <button
          type="button"
          className="ob-chip"
          onClick={() => scrollToSection(".ip-card")}
          title="定位到证照到期提醒"
        >
          <i className="ob-dot dot-critical" />
          证照 30 天内到期 <b>{expiring.length}</b> 张
        </button>
      </div>
      <span
        className="ob-close"
        title="收起快报"
        onClick={() => setVisible(false)}
      >
        <IconPlusIcPublicClose iconSize="0.875rem" iconColor={['currentcolor']} />
      </span>
    </div>
  );
}
