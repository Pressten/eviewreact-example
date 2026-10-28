import { IconPlusIcPublicHourglass, IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { teamMap } from "../../mock/teams.js";
import { buildGoal } from "../../mock/selectors.js";
import { fmtMoney, fmtPct } from "../../mock/format.js";
import "./index.css";

// TODO(eview-react): Progress 无对应组件，手写最小进度条（参考 handwrite-templates.md §9）
function SimpleProgress({ percent, className }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className={className}>
      <div style={{ width: "100%", height: "8px", background: "var(--surface-variant)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: "var(--primary)", transition: "width .2s" }} />
      </div>
    </div>
  );
}

export default function GoalBar() {
  const { team } = useApp();
  const goal = buildGoal(team);
  const currentTeam = teamMap[team];

  const tiles = [
    { key: "target",   label: "本季目标",   value: fmtMoney(goal.target),   icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} />,   color: "var(--on-surface)" },
    { key: "signed",   label: "已签约",     value: fmtMoney(goal.signed),   icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--success)" },
    { key: "pending",  label: "待审批",     value: fmtMoney(goal.pending),  icon: <IconPlusIcPublicHourglass iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--critical)" },
    { key: "forecast", label: "预测达成",   value: fmtMoney(goal.forecast), icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--primary)" },
  ];

  return (
    <div className="goal">
      <div className="goal__brand">
        <div className="goal__brand-row">
          <span className="goal__dot" style={{ background: currentTeam.color }} />
          <span className="goal__title">{currentTeam.name} · 本季目标</span>
        </div>
        <div className="goal__sub">2026 Q4 · 团队主管 {currentTeam.lead}</div>
      </div>

      <div className="goal__tiles">
        {tiles.map((t) => (
          <div className="goal__tile" key={t.key}>
            <div className="goal__tile-label">
              {t.icon}
              {t.label}
            </div>
            <div className="goal__tile-value" style={{ color: t.color }}>{t.value}</div>
          </div>
        ))}
      </div>

      <div className="goal__bar-wrap">
        <div className="goal__bar-meta">
          <span className="goal__bar-label">达成进度</span>
          <span className="goal__bar-figures">
            <span className="goal__bar-rate">{fmtPct(goal.signedRate)}</span>
            <span className="goal__bar-sep">/</span>
            <span className="goal__bar-forecast">预测 {fmtPct(goal.forecastRate)}</span>
            <span className="goal__bar-gap">
              {goal.gap >= 0 ? `距目标差 ${fmtMoney(goal.gap)}` : `已超目标 ${fmtMoney(-goal.gap)}`}
            </span>
          </span>
        </div>
        <div className="goal__bar-track">
          <div
            className="goal__bar-signed"
            style={{ width: `${Math.min(goal.signedRate, 100)}%` }}
          />
          <div
            className="goal__bar-forecast-mark"
            style={{ left: `${Math.min(goal.forecastRate, 100)}%` }}
            title={`预测达成 ${fmtPct(goal.forecastRate)}`}
          >
            <span className="goal__bar-flag" />
          </div>
        </div>
        <SimpleProgress percent={goal.signedRate} className="goal__hidden-prog" />
      </div>
    </div>
  );
}
