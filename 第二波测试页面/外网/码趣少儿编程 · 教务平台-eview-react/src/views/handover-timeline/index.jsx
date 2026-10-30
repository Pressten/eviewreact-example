import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcPublicChevronDown, IconPlusIcPublicChevronUp, IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
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
const DOT_COLOR = {
  normal: "#62B42E",
  abnormal: "#E02128",
  processing: "#2E86DE",
  pending: "#777777",
};

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
      color: DOT_COLOR[h.result],
      content: (
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
    <SectionCard title="值班交接" subtitle="今日 6 条交接与处置记录" icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />}>
      <div className="handover-timeline">
        {items.map((it, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-item__rail">
              <span className="tl-dot" style={{ background: it.color }} />
              {i < items.length - 1 ? <span className="tl-item__line" /> : null}
            </div>
            <div className="tl-content">{it.content}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
