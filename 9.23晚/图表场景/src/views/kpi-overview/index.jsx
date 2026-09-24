import { Icon } from "../../../assets/shared/icon.jsx";
import VerdictTag from "../../components/verdict-tag/index.jsx";
import { verdictRules } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 指标判断概览（结论统计 + 判断规则）
const CARD_META = [
  { key: "avgRate", label: "综合达成率", unit: "%", icon: "target", tone: "primary", decimals: 1 },
  { key: "pass", label: "达标指标", unit: "项", icon: "circle-check", tone: "success" },
  { key: "warn", label: "预警指标", unit: "项", icon: "triangle-alert", tone: "critical" },
  { key: "fail", label: "异常指标", unit: "项", icon: "circle-x", tone: "error" },
];

export default function KpiOverview({ stats, total }) {
  return (
    <section className="kpi-overview">
      <div className="kpi-grid">
        {CARD_META.map((meta) => (
          <article className="kpi-card" key={meta.key}>
            <div className="kpi-card-top">
              <span className={`kpi-icon kpi-icon--${meta.tone}`}>
                <Icon name={meta.icon} size={18} />
              </span>
              <span className="kpi-label">{meta.label}</span>
            </div>
            <div className="kpi-value-row">
              <span className={`kpi-value kpi-value--${meta.tone}`}>
                {meta.key === "avgRate" ? stats.avgRate.toFixed(meta.decimals) : stats[meta.key]}
              </span>
              <span className="kpi-unit">{meta.unit}</span>
            </div>
            <div className="kpi-foot">
              {meta.key === "avgRate" ? (
                <>
                  <span className={`kpi-delta ${stats.avgDelta >= 0 ? "is-up" : "is-down"}`}>
                    <Icon name={stats.avgDelta >= 0 ? "trending-up" : "trending-down"} size={13} />
                    {Math.abs(stats.avgDelta).toFixed(1)} pp
                  </span>
                  <span className="kpi-foot-note">环比上月（97.6%）</span>
                </>
              ) : (
                <>
                  <span className="kpi-foot-note">
                    占比 {total ? ((stats[meta.key] / total) * 100).toFixed(0) : 0}%
                  </span>
                  <span className="kpi-bar">
                    <span
                      className={`kpi-bar-fill kpi-bar-fill--${meta.tone}`}
                      style={{ width: `${total ? (stats[meta.key] / total) * 100 : 0}%` }}
                    />
                  </span>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="rule-strip">
        <span className="rule-strip-title">
          <Icon name="list-checks" size={14} />
          判断规则
        </span>
        {verdictRules.map((rule) => (
          <span className="rule-item" key={rule.key}>
            <VerdictTag verdict={rule.key} size="small" />
            <span className="rule-desc">{rule.desc}</span>
          </span>
        ))}
        <span className="rule-strip-tail">共 {total} 项指标纳入本轮判断</span>
      </div>
    </section>
  );
}
