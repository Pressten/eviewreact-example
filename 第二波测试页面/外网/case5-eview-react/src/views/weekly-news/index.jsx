// Layer 4: ⑨ 周要闻与下周重点 — 双栏 + 底部横条:
//   左栏 本周大事 Timeline 5 条（结果 Tag 分色）—— eview-react 无可用 Timeline,手写竖排时间轴
//   右栏 下周重点 3 条（优先级 Tag + 负责人 + 紧凑进度百分比条）—— Progress 无对应,手写进度条
//   底部 经营提示横条 4 条（面向管理层的行动建议,数字与上方各区块口径一致）
import Tag from "@/shared/Tag";
import { IconPlusIcCarUser, IconPlusIcPublicListBullet, IconPlusIcPublicNotice, IconPlusIcDigitalPowerDpTips } from '@hui/icon-plus';
import SectionCard from "../../components/section-card/index.jsx";
import { MANAGEMENT_TIPS, NEXT_WEEK_PLANS, WEEK_EVENTS } from "../../mock/weekly-report.jsx";
import "./index.css";

const TAG_COLOR_MAP = {
  success: "success",
  info: "processing",
  warning: "warning",
  error: "error",
};

// TODO(eview-react): Progress 未覆盖，手写最小可用进度条（handwrite-templates.md §9）
function SimpleProgress({ percent, status = "normal" }) {
  const color =
    status === "error"
      ? "var(--error)"
      : status === "success"
        ? "var(--success)"
        : "var(--primary)";
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div
        style={{
          flex: 1,
          height: "0.5rem",
          background: "var(--hover)",
          borderRadius: "0.25rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }}
        />
      </div>
      <span style={{ color: "var(--on-surface-variant)", minWidth: "2.5rem", textAlign: "right" }}>
        {p}%
      </span>
    </div>
  );
}

// TODO(eview-react): Timeline 无可用对应（导出名 TimeLine 存在但无 Reference），手写竖排时间轴
function AppTimeline({ items }) {
  return (
    <ol className="app-timeline">
      {items.map((item) => (
        <li className="app-timeline-item" key={item.key}>
          <span className="app-timeline-dot" />
          <div className="app-timeline-content">{item.children}</div>
        </li>
      ))}
    </ol>
  );
}

export default function WeeklyNews() {
  const timelineItems = WEEK_EVENTS.map((event) => ({
    key: event.eventId,
    children: (
      <div className="news-item">
        <div className="news-head">
          <span className="news-date">
            {event.eventDate} {event.eventWeekday}
          </span>
          <span className="news-title">{event.eventTitle}</span>
          <Tag color={TAG_COLOR_MAP[event.resultTag.tagLevel]}>{event.resultTag.tagText}</Tag>
        </div>
        <p className="news-detail">{event.eventDetail}</p>
      </div>
    ),
  }));

  return (
    <SectionCard
      index="09"
      title="周要闻与下周重点"
      subtitle="本周大事回顾（结果标签分色） · 下周重点跟进（优先级 + 负责人 + 进度） · 经营提示（行动建议）"
    >
      <div className="news-body">
        {/* 左栏: 本周大事 */}
        <div className="news-col">
          <h4 className="sub-block-title">
            <span className="sub-icon">
              <IconPlusIcPublicNotice iconSize="1rem" iconColor={['currentcolor']} />
            </span>
            本周大事
          </h4>
          <AppTimeline items={timelineItems} />
        </div>

        {/* 右栏: 下周重点（紧凑计划卡） */}
        <div className="plan-col">
          <h4 className="sub-block-title">
            <span className="sub-icon">
              <IconPlusIcPublicListBullet iconSize="1rem" iconColor={['currentcolor']} />
            </span>
            下周重点
          </h4>
          {NEXT_WEEK_PLANS.map((plan) => (
            <div className="plan-item" key={plan.planId}>
              <div className="plan-head">
                <span className="plan-title">{plan.planTitle}</span>
                <Tag color={plan.priorityLevel === "高" ? "warning" : "processing"}>
                  {plan.priorityLevel}优先
                </Tag>
              </div>
              <p className="plan-detail">{plan.planDetail}</p>
              <div className="plan-foot">
                <span className="plan-owner">
                  <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />
                  {plan.ownerName}（{plan.ownerRole}）· 截止 {plan.dueDate}
                </span>
                <div className="plan-progress">
                  <SimpleProgress percent={plan.progress} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部横条: 经营提示（标题与 4 条建议同行排布） */}
        <div className="tips-col">
          <div className="tips-row">
            <h4 className="sub-block-title tips-title">
              <span className="sub-icon">
                <IconPlusIcDigitalPowerDpTips iconSize="1rem" iconColor={['currentcolor']} />
              </span>
              经营提示
            </h4>
            {MANAGEMENT_TIPS.map((tip) => (
              <div className="tip-item" key={tip.tipId}>
                <span className="tip-icon">
                  {tip.tipIcon}
                </span>
                <div className="tip-content">
                  <span className="tip-title">{tip.tipTitle}</span>
                  <p className="tip-detail">{tip.tipDetail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
