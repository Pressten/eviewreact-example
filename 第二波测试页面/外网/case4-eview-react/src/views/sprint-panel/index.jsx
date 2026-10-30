// 右侧面板：大促冲刺工作台（替换原买家端预览右侧栏，贴合大促前高频装修场景）
// 组成：双11倒计时 + 装修完成度 / 今日数据速览 / 实时操作动态（reducer 自动记录） / 大促检查清单
import { useEffect, useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpArrowMoveUp, IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicAlarmClock, IconPlusIcPublicInfo, IconPlusIcPublicLists, IconPlusIcPublicRocket, IconPlusIcPublicSuccess } from '@hui/icon-plus';
import dayjs from "dayjs";
import Checkbox from "@nce/eview-react/Checkbox";
import Tag from "@/shared/Tag";
import { toast } from "@/shared/AppToast";
import { useDecoration } from "../../context.jsx";
import { SPRINT_META } from "../../mock/decoration.jsx";
import "./index.css";

// 手写简单进度条（antd Progress 无 eview 对应，见 handwrite-templates.md §9）
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="app-progress" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div
        className="app-progress-track"
        style={{ flex: 1, height: "6px", background: "var(--hover)", borderRadius: "3px", overflow: "hidden" }}
      >
        <div
          className="app-progress-fill"
          style={{ width: `${p}%`, height: "100%", background: "var(--primary)", transition: "width .2s" }}
        />
      </div>
      <span className="app-progress-text" style={{ color: "var(--on-surface-variant)", minWidth: "2.5rem", textAlign: "right" }}>
        {p}%
      </span>
    </div>
  );
}

// 冲刺倒计时 hook：天 + 时:分:秒，每秒刷新
function useSprintCountdown(endsAt) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const diff = dayjs(endsAt).valueOf() - now;
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hh = Math.floor((total % 86400) / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return {
    days,
    clock: [hh, mm, ss].map((n) => String(n).padStart(2, "0")),
  };
}

export default function SprintPanel() {
  const { state, activity, totalDrafts, hasUnpublished, activePage, activePageFloors } =
    useDecoration();
  const [checkedKeys, setCheckedKeys] = useState(["copyright", "links"]);
  const countdown = useSprintCountdown(SPRINT_META.endsAt);

  const checklist = SPRINT_META.checklist;
  const doneCount = checkedKeys.length;
  const percent = Math.round((doneCount / checklist.length) * 100);
  const allDone = doneCount === checklist.length;

  // 待处理事项：未发布更改 + 当前页停用楼层
  const pendingCount = useMemo(
    () => totalDrafts + activePageFloors.filter((f) => !f.status).length,
    [totalDrafts, activePageFloors]
  );

  const handleCheck = (key, checked) => {
    const next = checked ? [...checkedKeys, key] : checkedKeys.filter((k) => k !== key);
    setCheckedKeys(next);
    if (next.length === checklist.length) {
      toast.success("检查清单已全部完成，可以放心发布！");
    }
  };

  return (
    <aside className="sprint-panel">
      <div className="sprint-head">
        <div className="deco-card-title">
          <IconPlusIcPublicRocket iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          大促冲刺工作台
        </div>
        <Tag color="red" bordered={false}>
          双 11
        </Tag>
      </div>

      {/* 冲刺倒计时 + 装修完成度 */}
      <section className="sprint-section sprint-countdown">
        <span className="sprint-section-title">
          <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} />
          距「{SPRINT_META.name}」开幕
        </span>
        {countdown ? (
          <div className="cd-row">
            <span className="cd-days">
              <em>{String(countdown.days).padStart(2, "0")}</em>天
            </span>
            {countdown.clock.map((p, i) => (
              <span key={i} className="cd-box">
                {p}
              </span>
            ))}
          </div>
        ) : (
          <div className="cd-row cd-over">活动已开幕</div>
        )}
        <div className="cd-progress">
          <span className="cd-progress-label">装修完成度（检查清单 {doneCount}/{checklist.length}）</span>
          <SimpleProgress percent={percent} />
        </div>
      </section>

      {/* 今日数据速览 */}
      <section className="sprint-section">
        <span className="sprint-section-title">
          <IconPlusIcDigitalPowerDpArrowMoveUp iconSize="0.875rem" iconColor={['currentcolor']} />
          今日数据速览
        </span>
        <div className="stat-list">
          {SPRINT_META.stats.map((s) => (
            <div className="stat-row" key={s.key}>
              <span className="stat-icon">
                {s.icon}
              </span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-delta">{s.delta}</span>
            </div>
          ))}
          <div className="stat-row">
            <span className="stat-icon stat-icon-critical">
              <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
            <span className="stat-label">待处理事项</span>
            <span className={`stat-value ${pendingCount > 0 ? "stat-value-critical" : ""}`}>
              {pendingCount > 0 ? `${pendingCount} 项` : "无"}
            </span>
            <span className="stat-delta stat-delta-muted">
              {hasUnpublished ? `${totalDrafts} 处未发布` : "已全部发布"}
            </span>
          </div>
        </div>
      </section>

      {/* 实时操作动态 */}
      <section className="sprint-section sprint-activity">
        <span className="sprint-section-title">
          <IconPlusIcPublicLists iconSize="0.875rem" iconColor={['currentcolor']} />
          最近操作动态
          <Tag color="green" bordered={false} className="activity-tag">
            实时
          </Tag>
        </span>
        <div className="activity-list">
          {activity.length === 0 ? (
            <span className="activity-empty">暂无操作记录</span>
          ) : (
            activity.map((item) => (
              <div className="activity-item" key={item.id}>
                <span className="activity-icon">
                  {item.icon}
                </span>
                <span className="activity-text" title={item.text}>
                  {item.text}
                </span>
                <span className="activity-time">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 大促检查清单 */}
      <section className="sprint-section">
        <span className="sprint-section-title">
          <IconPlusIcPublicSuccess iconSize="0.875rem" iconColor={['currentcolor']} />
          大促检查清单
          {allDone && (
            <Tag color="green" bordered={false}>
              全部完成
            </Tag>
          )}
        </span>
        <div className="checklist">
          {checklist.map((item) => (
            <Checkbox
              key={item.key}
              value={item.key}
              checked={checkedKeys.includes(item.key)}
              label={item.label}
              onChange={(_value, checked) => handleCheck(item.key, checked)}
            />
          ))}
        </div>
        <div className="checklist-hint">
          <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['currentcolor']} />
          全部勾选后建议立即执行「发布」，锁定大促配置。
        </div>
      </section>
    </aside>
  );
}
