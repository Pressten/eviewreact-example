import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcPublicChevronDown, IconPlusIcPublicChevronUp, IconPlusIcIctTree } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import SectionCard from "../../components/section-card/index.jsx";
import { HANDOVER } from "../../mock/monitor.js";
import "./index.css";

const RESULT_TAG = {
  normal: { color: "success", label: "正常" },
  abnormal: { color: "error", label: "异常" },
  processing: { color: "processing", label: "处理中" },
  pending: { color: "warning", label: "待交接" },
};

function SimpleTimeline({ items, className }) {
  return (
    <div className={className} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      <div style={{ position: 'absolute', left: '0.375rem', top: '0.5rem', bottom: '0.5rem', width: '2px', background: '#e0e0e0' }} />
      {items.map((item, idx) => (
        <div key={idx} style={{ position: 'relative', paddingBottom: '1rem' }}>
          <div style={{ position: 'absolute', left: '-1.125rem', top: '0.25rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--primary, #0067D1)', border: '2px solid #fff' }} />
          {item.children}
        </div>
      ))}
    </div>
  );
}

// 区块⑦ 值班交接 Timeline：今日 6 条，节点可展开详情
export default function HandoverTimeline() {
  const [expanded, setExpanded] = useState(() => new Set([HANDOVER[HANDOVER.length - 1].time]));

  const toggle = (time) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(time)) next.delete(time);
      else next.add(time);
      return next;
    });
  };

  const items = HANDOVER.map((h) => {
    const rt = RESULT_TAG[h.result];
    const isOpen = expanded.has(h.time);
    return {
      children: (
        <div className="handover-item">
          <div className="handover-head">
            <span className="handover-time">{h.time}</span>
            <span className="handover-person">
              <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />
              {h.person}
            </span>
            <Tag color={rt.color} bordered={false}>{rt.label}</Tag>
          </div>
          <div className="handover-event">{h.event}</div>
          <button type="button" className="handover-toggle" onClick={() => toggle(h.time)}>
            {isOpen ? <IconPlusIcPublicChevronUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />}
            {isOpen ? "收起详情" : "展开详情"}
          </button>
          {isOpen && <div className="handover-detail">{h.detail}</div>}
        </div>
      ),
    };
  });

  return (
    <SectionCard title="值班交接" subtitle="今日 6 条交接与处置记录" icon={<IconPlusIcIctTree iconSize="1.25rem" iconColor={['currentcolor']} />}>
      <SimpleTimeline items={items} className="handover-timeline" />
    </SectionCard>
  );
}
