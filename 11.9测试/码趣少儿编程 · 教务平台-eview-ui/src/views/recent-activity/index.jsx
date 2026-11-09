import Tag from "eview-ui/Tag";
import Rating from "eview-ui/Rating";
import Icon from "@/shared/Icon";
import { RECENT_ACTIVITY } from "../../mock/student.js";
import "./index.css";

const ATT_COLOR = { 出勤: "success", 请假: "warning", 补课: "primary" };

export default function RecentActivity() {
  return (
    <div className="activity-card">
      <div className="activity-card__head">
        <span className="activity-card__title">
          <Icon name="activity" size="0.875rem" /> 近期课堂动态
        </span>
        <span className="activity-card__hint">最新 {RECENT_ACTIVITY.length} 条上课记录</span>
      </div>
      <div className="activity-list">
        {RECENT_ACTIVITY.map((a, i) => (
          <div className="activity-item" key={i}>
            <div className="activity-item__date">
              <span className="activity-item__day">{a.date.slice(5)}</span>
              <span className="activity-item__year">{a.date.slice(0, 4)}</span>
            </div>
            <div className="activity-item__body">
              <div className="activity-item__head">
                <span className="activity-item__name">{a.studentName}</span>
                <Tag type="status" color={ATT_COLOR[a.attendance] || "success"}>{a.attendance}</Tag>
              </div>
              <div className="activity-item__topic">{a.courseLabel} · {a.topic}</div>
              <Rating disabled starCount={5} half value={a.rating} className="activity-item__rate" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
