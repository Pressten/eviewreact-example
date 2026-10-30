// Layer 4: 统计概览（在读学员 / 本周新增 / 待续费提醒 / 本周课节）
import { IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import "./index.css";

const CARDS = [
  { key: "enrolled", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />, field: "totalEnrolled", label: "在读学员", unit: "人", tone: "primary" },
  { key: "new", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />, field: "weekNew", label: "本周新增", unit: "人", tone: "info" },
  { key: "renewal", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />, field: "renewalAlert", label: "待续费提醒", unit: "人", tone: "critical" },
  { key: "lessons", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />, field: "weekLessons", label: "本周课节", unit: "节", tone: "success" },
];

export default function StatOverview({ overview }) {
  return (
    <div className="stat-overview">
      {CARDS.map((c) => (
        <div key={c.key} className="stat-card">
          <div className={"stat-card__icon stat-card__icon--" + c.tone}>
            {c.icon}
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
