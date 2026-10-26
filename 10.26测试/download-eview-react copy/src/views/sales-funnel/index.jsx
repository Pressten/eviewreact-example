import { IconPlusIcIctPointer, IconPlusIcPublicSortDown } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { filterOpps, buildFunnel } from "../../mock/selectors.js";
import { fmtMoney, fmtPct } from "../../mock/format.js";
import "./index.css";

export default function SalesFunnel() {
  const { team, productLine, dept, funnelStage, setFunnelStage } = useApp();
  const opps = filterOpps({ team, productLine, dept });
  const funnel = buildFunnel(opps);

  const handleStageClick = (key) => {
    setFunnelStage(funnelStage === key ? null : key);
  };

  return (
    <div className="funnel">
      <div className="funnel__total">
        <div className="funnel__total-label">商机总盘</div>
        <div className="funnel__total-value">{fmtMoney(funnel.total)}</div>
        <div className="funnel__total-sub">{opps.length} 个活跃商机</div>
      </div>

      <div className="funnel__bars">
        {funnel.rows.map((row, i) => {
          const conv = funnel.conv[i + 1];
          const isActive = funnelStage === row.key;
          const isDim = funnelStage && !isActive;
          return (
            <div className="funnel__row" key={row.key}>
              <div
                className={`funnel__bar-wrap ${isActive ? "is-active" : ""} ${isDim ? "is-dim" : ""}`}
                onClick={() => handleStageClick(row.key)}
                role="button"
                tabIndex={0}
              >
                <div className="funnel__bar-meta">
                  <span className="funnel__stage-dot" style={{ background: row.color }} />
                  <span className="funnel__stage-label">{row.label}</span>
                  <span className="funnel__stage-count">{row.count} 单</span>
                </div>
                <div className="funnel__bar-track">
                  <div
                    className="funnel__bar-fill"
                    style={{ width: `${row.pct}%`, background: row.color }}
                  />
                </div>
                <div className="funnel__bar-figures">
                  <span className="funnel__amount" style={{ color: row.color }}>{fmtMoney(row.amount)}</span>
                  <span className="funnel__pct">{fmtPct(row.pct)}</span>
                </div>
              </div>
              {conv !== null && conv !== undefined && (
                <div className="funnel__conv">
                  <IconPlusIcPublicSortDown iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
                  <span className="funnel__conv-text">阶段转化 {fmtPct(conv)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="funnel__hint">
        <IconPlusIcIctPointer iconSize="0.875rem" iconColor={['var(--primary)']} />
        <span>点击阶段筛选看板对应列 · {funnelStage ? "已筛选 · 再点取消" : "当前展示全部阶段"}</span>
      </div>
    </div>
  );
}
