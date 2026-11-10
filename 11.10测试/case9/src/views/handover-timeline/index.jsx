import { useState } from "react";
import { Timeline } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { ResultTag } from "../../components/status-tag/index.jsx";
import { HANDOVERS } from "../../mock/operations.js";
import "./index.css";

const DOT_COLOR = {
  ongoing: "var(--color-brand)",
  success: "var(--color-success)",
  rollback: "var(--color-alert)",
};

// ⑦ 值班交接 Timeline：今日 6 条交接与处置记录，节点可展开详情
export default function HandoverTimeline() {
  const [openId, setOpenId] = useState("HO-05");

  const items = HANDOVERS.map((h) => ({
    key: h.id,
    color: DOT_COLOR[h.result] || DOT_COLOR.ongoing,
    children: (
      <div className={`ho-item ${h.result}`}>
        <div className="ho-head">
          <span className="ho-time">{h.time}</span>
          <span className="ho-officer">
            <Icon name="user" size="0.75rem" />
            {h.officer}
          </span>
          <span className="ho-shift">
            {h.shift} · {h.kind}
          </span>
          <ResultTag result={h.result} />
        </div>
        <div className="ho-event">{h.event}</div>
        <a
          className="ho-toggle"
          onClick={() => setOpenId(openId === h.id ? "" : h.id)}
        >
          {openId === h.id ? "收起详情" : "展开详情"}
          <Icon name={openId === h.id ? "chevron-up" : "chevron-down"} size="0.75rem" />
        </a>
        {openId === h.id ? (
          <div className="ho-detail">
            <p>
              <span className="ho-k">处置过程</span>
              {h.detail.process}
            </p>
            <p>
              <span className="ho-k">影响范围</span>
              {h.detail.impact}
            </p>
            {h.detail.followup ? (
              <p>
                <span className="ho-k">后续动作</span>
                {h.detail.followup}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    ),
  }));

  return (
    <SectionCard
      id="handover-section"
      icon="calendar-clock"
      title="值班交接 · 今日记录"
      className="ho-section"
      extra={<span className="ho-extra">6 条交接与处置记录 · 白班值班中</span>}
    >
      <Timeline className="ho-timeline" items={items} />
    </SectionCard>
  );
}
