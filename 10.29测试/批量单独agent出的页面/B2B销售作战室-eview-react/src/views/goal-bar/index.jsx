import { IconPlusIcPublicHourglass, IconPlusIcCarTargetForecast, IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { teamMap } from "../../mock/teams.js";
import { buildGoal } from "../../mock/selectors.js";
import { fmtMoney, fmtPct } from "../../mock/format.js";
import "./index.css";

// 注:源项目 antd Progress(hidden,display:none,无视觉效果)已移除——
// 达成进度条已由 .goal__bar-track + .goal__bar-signed div 手绘实现,无需 antd Progress。

export default function GoalBar() {
  const { team } = useApp();
  const goal = buildGoal(team);
  const currentTeam = teamMap[team];

  const tiles = [
    { key: "target",   label: "本季目标",   value: fmtMoney(goal.target),   icon: <IconPlusIcCarTargetForecast iconSize="0.875rem" iconColor={['currentcolor']} />,   color: "var(--on-surface)" },
    { key: "signed",   label: "已签约",     value: fmtMoney(goal.signed),   icon: <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--success)" },
    { key: "pending",  label: "待审批",     value: fmtMoney(goal.pending),  icon: <IconPlusIcPublicHourglass iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--critical)" },
    { key: "forecast", label: "预测达成",   value: fmtMoney(goal.forecast), icon: <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--primary)" },
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
      </div>
    </div>
  );
}
