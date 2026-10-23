import { Tag, Tooltip } from "antd";
import Icon from "@/shared/Icon";
import { stages, stageMap, actionTypes } from "../../mock/stages.js";
import { ownerMap } from "../../mock/salespeople.js";
import { fmtMoney } from "../../mock/format.js";
import OwnerAvatar from "../../components/owner-avatar/index.jsx";

// 商机看板 — 5 列阶段看板
export default function Kanban({ opps, funnelStage, onSelect }) {
  return (
    <div className="kb">
      {stages.map((st) => {
        const colOpps = opps.filter((o) => o.stage === st.key);
        const total = colOpps.reduce((s, o) => s + o.amount, 0);
        const isActive = funnelStage === st.key;
        const isDim = funnelStage && !isActive;
        return (
          <div className={`kb__col ${isActive ? "is-active" : ""} ${isDim ? "is-dim" : ""}`} key={st.key}>
            <div className="kb__col-head" style={{ borderTopColor: st.color }}>
              <div className="kb__col-head-left">
                <span className="kb__col-dot" style={{ background: st.color }} />
                <span className="kb__col-label">{st.label}</span>
                <span className="kb__col-count">{colOpps.length}</span>
              </div>
              <span className="kb__col-total" style={{ color: st.color }}>{fmtMoney(total)}</span>
            </div>
            <div className="kb__col-body">
              {colOpps.map((o) => (
                <KanbanCard key={o.id} opp={o} stage={st} onSelect={onSelect} />
              ))}
              {colOpps.length === 0 && (
                <div className="kb__empty">
                  <Icon name="inbox" size="1.5rem" color="var(--text-disabled)" />
                  <span>暂无商机</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ opp, stage, onSelect }) {
  const owner = ownerMap[opp.owner];
  const action = actionTypes[opp.action] || { label: opp.actionLabel, color: "#2070F3" };
  return (
    <Tooltip
      title={<div className="kb__tip"><b>最近跟进</b><span>{opp.lastSummary}</span></div>}
      placement="right"
      color="var(--inverse-surface)"
      overlayInnerStyle={{ maxWidth: 280 }}
    >
      <div
        className={`kb__card ${opp.nearExpiry ? "is-urgent" : ""}`}
        style={{ borderLeftColor: stage.color }}
        onClick={() => onSelect(opp)}
        role="button"
        tabIndex={0}
      >
        <div className="kb__card-top">
          <span className="kb__card-customer">{opp.customer}</span>
          {opp.nearExpiry && (
            <Tag color="error" bordered={false} className="kb__card-urgent">临期</Tag>
          )}
        </div>
        <div className="kb__card-amount" style={{ color: stage.color }}>{fmtMoney(opp.amount)}</div>
        <div className="kb__card-meta">
          {owner && (
            <span className="kb__card-owner">
              <OwnerAvatar person={owner} size="1.25rem" />
              {owner.name}
            </span>
          )}
          <span className="kb__card-stay">
            <Icon name="timer" size="0.75rem" color="var(--on-surface-variant)" />
            停留 {opp.stayDays}天
          </span>
        </div>
        <div className="kb__card-foot">
          <Tag color={action.color} bordered={false} className="kb__card-action">{opp.actionLabel}</Tag>
          <span className="kb__card-close">
            <Icon name="calendar-clock" size="0.75rem" color="var(--on-surface-variant)" />
            {opp.closeDate.slice(5)}
          </span>
        </div>
      </div>
    </Tooltip>
  );
}
