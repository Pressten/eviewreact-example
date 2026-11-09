import Button from "eview-ui/Button";
import message from "@/shared/message";
import Icon from "@/shared/Icon";
import { RENEWAL_LIST } from "../../mock/student.js";
import "./index.css";

export default function RenewalAlert() {
  return (
    <div className="renewal-card">
      <div className="renewal-card__head">
        <span className="renewal-card__title">
          <Icon name="triangle-alert" size="0.875rem" className="renewal-card__icon" /> 待续费提醒
        </span>
        <span className="renewal-card__hint">{RENEWAL_LIST.length} 名学员课时不足 8 节</span>
      </div>
      <div className="renewal-list">
        {RENEWAL_LIST.map((s) => (
          <div className="renewal-row" key={s.id}>
            <img className="renewal-row__avatar" src={s.avatar} alt="" />
            <div className="renewal-row__info">
              <div className="renewal-row__name">{s.name}</div>
              <div className="renewal-row__sub">{s.campusLabel} · {s.courseLabel} · {s.parentPhone}</div>
            </div>
            <div className="renewal-row__hours">
              <span className="renewal-row__num">{s.remainingHours}</span>
              <span className="renewal-row__total">/ {s.totalHours} 课时</span>
            </div>
            <Button
              size="small"
              status="primary"
              onClick={() => message.success("续费提醒已发送给 " + s.parentName)}
            >
              <Icon name="bell-ring" size="0.875rem" />
              <span style={{ marginLeft: "0.25rem" }}>提醒续费</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
