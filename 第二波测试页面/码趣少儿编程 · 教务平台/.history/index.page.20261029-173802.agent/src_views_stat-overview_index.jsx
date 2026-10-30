// Layer 4: 统计概览（在读学员 / 本周新增 / 待续费提醒 / 本周课节）
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const CARDS = [
  { key: "enrolled", icon: "users", field: "totalEnrolled", label: "在读学员", unit: "人", tone: "primary" },
  { key: "new", icon: "user-plus", field: "weekNew", label: "本周新增", unit: "人", tone: "info" },
  { key: "renewal", icon: "triangle-alert", field: "renewalAlert", label: "待续费提醒", unit: "人", tone: "critical" },
  { key: "lessons", icon: "calendar-days", field: "weekLessons", label: "本周课节", unit: "节", tone: "success" },
];

export default function StatOverview({ overview }) {
  return (
    <div className="stat-overview">
      {CARDS.map((c) => (
        <div key={c.key} className="stat-card">
          <div className={"stat-card__icon stat-card__icon--" + c.tone}>
            <Icon name={c.icon} size="1.25rem" />
          </div>
          <div className="stat-card__body">
            <div className="stat-card__value">
              {overview[c.field]}
              <span className="stat-card__unit">{c.unit}</span>
            </div>
            <div className="stat-card__label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
