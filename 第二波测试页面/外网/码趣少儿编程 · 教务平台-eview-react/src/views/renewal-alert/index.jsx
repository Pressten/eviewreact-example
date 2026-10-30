// Layer 4: 待续费提醒（课时不足 8 节的学员快捷续费列表）
import { useState } from "react";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { IconPlusIcPublicAlert, IconPlusIcPublicBellClock } from '@hui/icon-plus';
import { RENEWAL_LIST } from "../../mock/student.js";
import "./index.css";

export default function RenewalAlert() {
  const [notice, setNotice] = useState(null);
  return (
    <div className="renewal-card">
      <div className="renewal-card__head">
        <span className="renewal-card__title">
          <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} className="renewal-card__icon" /> 待续费提醒
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
              leftIcon={<IconPlusIcPublicBellClock iconSize="0.875rem" iconColor={['currentcolor']} />}
              text="提醒续费"
              onClick={() => setNotice({ type: "success", text: "续费提醒已发送给 " + s.parentName })}
            />
          </div>
        ))}
      </div>
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.text}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
