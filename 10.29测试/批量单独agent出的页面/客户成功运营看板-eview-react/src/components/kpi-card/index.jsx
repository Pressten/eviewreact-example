import { useState } from "react";
import { IconPlusIcPublicSortUp, IconPlusIcPublicSortDown } from "@hui/icon-plus";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import "./index.css";

// KPI 指标卡 — 主数值 + 同比涨跌(方向 arrow + 语义色)+ 说明;可点击进入明细
// antd Tooltip → eview TipBox（包裹式气泡）；antd message.info → eview DivMessage（无命令式 API，改渲染式 + fixed 浮层）
// icon 跨组件边界 props 闭合集：源 kpiCards.icon 已在 dashboard.jsx 转 icon+ 元素，消费端 {icon} 透传 ReactNode
// arrowIcon 扁平三元闭合集 {up,down} → icon+ 三元（SortUp / SortDown）
export default function KpiCard({ data }) {
  const { key, title, value, unit, delta, deltaSuffix, direction, sentiment, description, icon } = data;
  const [notice, setNotice] = useState(null);
  const deltaText = `${delta > 0 ? "+" : ""}${delta}${deltaSuffix}`;

  const handleClick = () => {
    setNotice({ key: Date.now(), text: `正在打开「${title}」明细看板` });
  };

  return (
    <>
      <TipBox type="simple" content={`点击查看「${title}」明细`} direction="top">
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
            <span className={`kpi-icon kpi-icon-${key}`}>{icon}</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{value}</span>
            {unit && <span className="kpi-unit">{unit}</span>}
          </div>
          <div className="kpi-delta-row">
            {direction === "up" ? (
              <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} className={`kpi-arrow kpi-${sentiment}`} />
            ) : (
              <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} className={`kpi-arrow kpi-${sentiment}`} />
            )}
            <span className={`kpi-delta kpi-${sentiment}`}>{deltaText}</span>
            <span className="kpi-vs">同比</span>
          </div>
          <div className="kpi-desc">{description}</div>
        </section>
      </TipBox>
      {notice && (
        <div className="notice-overlay">
          <DivMessage
            key={notice.key}
            display
            type="default"
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
    </>
  );
}
