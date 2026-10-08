import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicAlert, IconPlusIcPublicCheckmark, IconPlusIcPublicClock, IconPlusIcPublicInfo, IconPlusIcPublicRightArrow } from "@nce/icon-plus";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  guidelines,
  recentOrders,
  orderStatusMeta,
  priorityMeta,
  approvalNodes,
  metaOf,
} from "../../mock/workorder.jsx";
import "./index.css";

export default function FormAside({ checks, onJump, onOpenOrder }) {
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const pending = checks.filter((c) => !c.ok);
  const ringColor = percent === 100 ? "var(--success)" : "var(--primary)";
  const circumference = 2 * Math.PI * 38;

  return (
    <aside className="form-aside">
      <PanelCard
        icon={<IconPlusIcDigitalPowerDpCheck iconSize="1rem" iconColor={['currentcolor']} />}
        title="填报校验"
        subtitle={`已通过 ${doneCount} / ${checks.length} 项`}
      >
        <div className="check-progress">
          <div className="check-progress__circle">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="38" fill="none" stroke="var(--hover, rgba(0,0,0,0.05))" strokeWidth="6" />
              <circle
                cx="44" cy="44" r="38" fill="none"
                stroke={ringColor}
                strokeWidth="6"
                strokeDasharray={`${circumference * percent / 100} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
              />
            </svg>
            <span className="check-progress__num">{percent}%</span>
          </div>
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
                {c.ok ? <IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />}
                <span className="check-item__main">
                  <span className="check-item__label">{c.label}</span>
                  <span className="check-item__hint">{c.hint}</span>
                </span>
                <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
              </button>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard icon={<IconPlusIcPublicInfo iconSize="1rem" iconColor={['currentcolor']} />} title="填报指引" subtitle="来自《机房巡检作业规范 v3.2》">
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
          <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </a>
      </PanelCard>

      <PanelCard
        icon={<IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />}
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

      <PanelCard icon={<IconPlusIcDigitalPowerDpCheck iconSize="1rem" iconColor={['currentcolor']} />} title="审批流程" subtitle="提交后自动流转">
        <div className="apv-timeline">
          {approvalNodes.map((node, i) => (
            <div className="apv-timeline__item" key={i}>
              <div className="apv-timeline__rail">
                <div
                  className="apv-timeline__dot"
                  style={{ background: i === 0 ? "var(--primary)" : "var(--outline)" }}
                />
                {i < approvalNodes.length - 1 ? <div className="apv-timeline__line" /> : null}
              </div>
              <div className="apv-node">
                <span className={`apv-node__title ${i === 0 ? "is-current" : ""}`}>{node.title}</span>
                <span className="apv-node__desc">{node.desc}</span>
                <span className="apv-node__time">{node.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="aside-note">
          <TipBox type="simple" content="如需加急，请在提交后联系值班经理">
            <span className="aside-note__text">
              <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />
              紧急工单可申请绿色通道，30 分钟内响应
            </span>
          </TipBox>
        </div>
      </PanelCard>
    </aside>
  );
}
