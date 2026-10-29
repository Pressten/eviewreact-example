// Layer 4: 团队负载 — 底部卡片：5 名 CSM 纵向成员行（头像 / 待办在跟 / 容量进度），按负载分色
import SimpleProgress from "../../components/simple-progress/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { TEAM_WORKLOAD } from "../../mock/dashboard.jsx";
import "./index.css";

function capacityTone(capacity) {
  if (capacity >= 90) return { color: "var(--error)", tone: "is-heavy", status: "error" };
  if (capacity >= 75) return { color: "var(--critical)", tone: "is-medium", status: "normal" };
  return { color: "var(--success)", tone: "is-light", status: "success" };
}

export default function TeamWorkload() {
  const { notify } = useApp();
  return (
    <SectionCard className="team-card" title="团队负载" subtitle="今日在办任务与容量占用">
      <ul className="team-list">
        {TEAM_WORKLOAD.map((member) => {
          const tone = capacityTone(member.capacity);
          return (
            <li
              key={member.name}
              className="team-member"
              onClick={() => notify("info", `已打开 ${member.name} 的任务视图（演示）`)}
            >
              <span className="team-member-id">
                <img className="team-member-avatar" src="/uploads/user.png" alt={member.name} />
                <span className="team-member-text">
                  <span className="team-member-name">{member.name}</span>
                  <span className="team-member-role">{member.role}</span>
                </span>
              </span>
              <span className="team-member-tasks">
                待办 {member.pendingTasks} · 在跟 {member.activeCustomers}
              </span>
              <span className="team-member-bar">
                <SimpleProgress percent={member.capacity} status={tone.status} showLabel={false} />
                <span className={`team-member-capacity ${tone.tone}`}>{member.capacity}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
