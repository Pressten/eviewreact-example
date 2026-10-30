import { useState } from "react";
import { Timeline, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
  normal: "green",
  abnormal: "red",
  processing: "blue",
  pending: "gray",
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
      children: (
        <div className="handover-item">
          <div className="handover-head">
            <span className="handover-time">{h.time}</span>
            <span className="handover-person">
              <Icon name="user" size="0.875rem" />
              {h.person}
            </span>
            <Tag color={rt.color} bordered={false}>{rt.label}</Tag>
          </div>
          <div className="handover-event">{h.event}</div>
          <button type="button" className="handover-toggle" onClick={() => toggle(h.time)}>
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size="0.875rem" />
            {isOpen ? "收起详情" : "展开详情"}
          </button>
          {isOpen && <div className="handover-detail">{h.detail}</div>}
        </div>
      ),
    };
  });

  return (
    <SectionCard title="值班交接" subtitle="今日 6 条交接与处置记录" icon="list-tree">
      <Timeline items={items} className="handover-timeline" />
    </SectionCard>
  );
}
