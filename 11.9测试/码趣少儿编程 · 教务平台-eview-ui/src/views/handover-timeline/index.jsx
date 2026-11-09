import { useState } from "react";
import TimeLine from "eview-ui/TimeLine";
import Tag from "eview-ui/Tag";
import Icon from "@/shared/Icon";
import SectionCard from "../../components/section-card/index.jsx";
import { HANDOVER } from "../../mock/monitor.js";
import "./index.css";

const RESULT_TAG = {
  normal: { color: "success", label: "正常" },
  abnormal: { color: "danger", label: "异常" },
  processing: { color: "primary", label: "处理中" },
  pending: { color: "warning", label: "待交接" },
};
const ICON_TYPE = {
  normal: "success",
  abnormal: "error",
  processing: "default",
  pending: "default",
};

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

  const data = HANDOVER.map((h) => {
    const rt = RESULT_TAG[h.result];
    const isOpen = expanded.has(h.time);
    return {
      iconType: ICON_TYPE[h.result],
      title: h.time,
      content: (
        <div className="handover-item">
          <div className="handover-head">
            <span className="handover-time">{h.time}</span>
            <span className="handover-person">
              <Icon name="user" size="0.875rem" />
              {h.person}
            </span>
            <Tag type="status" color={rt.color}>{rt.label}</Tag>
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
      <TimeLine data={data} className="handover-timeline" />
    </SectionCard>
  );
}
