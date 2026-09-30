import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { AppProgressCircle } from "../../components/app-progress/index.jsx";
import {
  guidelines,
  recentOrders,
  orderStatusMeta,
  priorityMeta,
  approvalNodes,
  metaOf,
} from "../../mock/workorder.js";
import "./index.css";

// TODO(eview-react): Timeline 无 eview-react Reference，当前手写时间线
function AppTimeline({ items }) {
  return (
    <div className="app-timeline">
      {items.map((item, i) => (
        <div className="app-timeline__item" key={i}>
          <span className="app-timeline__dot" style={{ background: item.color }} />
          <div className="app-timeline__content">{item.children}</div>
        </div>
      ))}
    </div>
  );
}

// Layer 4: 表单右侧辅助区 — 校验进度 / 填报指引 / 最近工单 / 审批流程
export default function FormAside({ checks, onJump, onOpenOrder }) {
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const pending = checks.filter((c) => !c.ok);

  const timelineItems = approvalNodes.map((node, i) => ({
    color: i === 0 ? "var(--primary)" : "var(--outline)",
    children: (
      <div className="apv-node">
        <span className={`apv-node__title ${i === 0 ? "is-current" : ""}`}>{node.title}</span>
        <span className="apv-node__desc">{node.desc}</span>
        <span className="apv-node__time">{node.time}</span>
      </div>
    ),
  }));

  return (
    <aside className="form-aside">
      <PanelCard
        icon="badge-check"
        title="填报校验"
        subtitle={`已通过 ${doneCount} / ${checks.length} 项`}
      >
        <div className="check-progress">
          <AppProgressCircle
            percent={percent}
            size={88}
            color={percent === 100 ? "var(--success)" : "var(--primary)"}
          >
            <span className="check-progress__num">{percent}%</span>
          </AppProgressCircle>
          <p className="check-progress__tip">
            {percent === 100
              ? "校验全部通过，可提交工单"
              : `还有 ${pending.length} 项需要完善后才能提交`}
          </p>
        </div>

        <ul className="check-list">
          {checks.map((c) => (
            <li className={`check-item ${c.ok ? "is-ok" : ""}`} key={c.key}>
              <button type="button" className="check-item__btn" onClick={() => onJump(c.target)}>
                <Icon name={c.ok ? "circle-check" : "circle-alert"} size="1rem" />
                <span className="check-item__main">
                  <span className="check-item__label">{c.label}</span>
                  <span className="check-item__hint">{c.hint}</span>
                </span>
                <Icon name="chevron-right" size="0.875rem" />
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon="info" title="填报指引" subtitle="来自《机房巡检作业规范 v3.2》">
        <ol className="guide-list">
          {guidelines.map((g, i) => (
            <li className="guide-item" key={g}>
              <span className="guide-item__no">{i + 1}</span>
              <span className="guide-item__text">{g}</span>
            </li>
          ))}
        </ol>
        <a className="aside-link">
          查看完整规范
          <Icon name="arrow-right" size="0.875rem" />
        </a>
      </PanelCard>

      <PanelCard
        icon="clock"
        title="最近工单"
        subtitle="我参与的近 12 条工单"
        extra={<a className="aside-link aside-link--sm">全部</a>}
      >
        <ul className="order-list">
          {recentOrders.map((o) => (
            <li className="order-item" key={o.id}>
              <button type="button" className="order-item__btn" onClick={() => onOpenOrder(o.id)}>
                <span className="order-item__top">
                  <span className="order-item__title">{o.title}</span>
                  <StatusTag
                    tone={metaOf(orderStatusMeta, o.status).tone}
                    label={metaOf(orderStatusMeta, o.status).label}
                    size="small"
                  />
                </span>
                <span className="order-item__meta">
                  <span className="order-item__id">{o.id}</span>
                  <span className="order-item__dot" />
                  <span>{o.station}</span>
                  <span className="order-item__dot" />
                  <span>{o.time}</span>
                  <span className="order-item__dot" />
                  <span className={`order-item__prio is-${o.priority}`}>
                    {metaOf(priorityMeta, o.priority).label}优先级
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon="shield-check" title="审批流程" subtitle="提交后自动流转">
        <AppTimeline items={timelineItems} />
        <div className="aside-note">
          <TipBox type="simple" content="如需加急，请在提交后联系值班经理" direction="top">
            <span className="aside-note__text">
              <Icon name="siren" size="0.875rem" />
              紧急工单可申请绿色通道，30 分钟内响应
            </span>
          </TipBox>
        </div>
      </PanelCard>
    </aside>
  );
}
