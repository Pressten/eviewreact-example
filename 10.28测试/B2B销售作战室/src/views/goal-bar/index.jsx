import { Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../../src/context.jsx";
import { teamMap } from "../../../src/mock/teams.js";
import { buildGoal } from "../../../src/mock/selectors.js";
import { fmtMoney, fmtPct } from "../../../src/mock/format.js";
import "./index.css";

export default function GoalBar() {
  const { team } = useApp();
  const goal = buildGoal(team);
  const currentTeam = teamMap[team];

  const tiles = [
    { key: "target",   label: "本季目标",   value: fmtMoney(goal.target),   icon: "target",   color: "var(--on-surface)" },
    { key: "signed",   label: "已签约",     value: fmtMoney(goal.signed),   icon: "circle-check-big", color: "var(--success)" },
    { key: "pending",  label: "待审批",     value: fmtMoney(goal.pending),  icon: "hourglass", color: "var(--critical)" },
    { key: "forecast", label: "预测达成",   value: fmtMoney(goal.forecast), icon: "trending-up", color: "var(--primary)" },
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
              <Icon name={t.icon} size="0.875rem" color={t.color} />
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
        <Progress
          percent={goal.signedRate}
          showInfo={false}
          strokeColor={{ from: "transparent", to: "transparent" }}
          trailColor="transparent"
          className="goal__hidden-prog"
        />
      </div>
    </div>
  );
}
