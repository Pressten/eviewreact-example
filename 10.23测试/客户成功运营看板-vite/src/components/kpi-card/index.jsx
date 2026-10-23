import { useState } from "react";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import { IconPlusIcDigitalPowerDpArrowMoveUp, IconPlusIcPublicFallingDownCircle } from '@hui/icon-plus';
import Icon from "@/shared/Icon";
import "./index.css";

// KPI 指标卡 — 主数值 + 同比涨跌(方向 arrow + 语义色)+ 说明;可点击进入明细
export default function KpiCard({ data }) {
  const { key, title, value, unit, delta, deltaSuffix, direction, sentiment, description, icon } = data;
  const arrowIcon = direction === "up" ? <IconPlusIcDigitalPowerDpArrowMoveUp iconSize="0.875rem" iconColor={['currentcolor']} className={`kpi-arrow kpi-${sentiment}`} /> : <IconPlusIcPublicFallingDownCircle iconSize="0.875rem" iconColor={['currentcolor']} className={`kpi-arrow kpi-${sentiment}`} />;
  const deltaText = `${delta > 0 ? "+" : ""}${delta}${deltaSuffix}`;
  const [notice, setNotice] = useState(null);

  const handleClick = () => {
    setNotice({ text: `正在打开「${title}」明细看板`, type: "default", key: Date.now() });
  };

  return (
    <>
      {notice && (
        <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage key={notice.key} display type={notice.type} text={notice.text} onClose={() => setNotice(null)} />
        </div>
      )}
      <TipBox content={`点击查看「${title}」明细`} direction="top" type="simple">
        <section
          className="kpi-card kpi-card-hover"
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className="kpi-head">
            <span className="kpi-title">{title}</span>
            <span className={`kpi-icon kpi-icon-${key}`}>
              <Icon name={icon} size="1.25rem" />
            </span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{value}</span>
            {unit && <span className="kpi-unit">{unit}</span>}
          </div>
          <div className="kpi-delta-row">
            {arrowIcon}
            <span className={`kpi-delta kpi-${sentiment}`}>{deltaText}</span>
            <span className="kpi-vs">同比</span>
          </div>
          <div className="kpi-desc">{description}</div>
        </section>
      </TipBox>
    </>
  );
}
