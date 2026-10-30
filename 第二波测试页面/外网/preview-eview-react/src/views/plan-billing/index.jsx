import { useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcIndustryCompare, IconPlusIcPublicGift, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import Panel, { PanelItem } from "@nce/eview-react/Panel";
import Tag from "@/shared/Tag";
import TipBox from "@nce/eview-react/TipBox";
import SectionBlock from "../../components/section-block/index.jsx";
import { plan } from "../../mock/data.js";
import "./index.css";

export default function PlanBilling() {
  // Panel：enableMultiExpand 允许多块同时展开；defaultActiveKey=["base"] → 初始展开下标数组
  const [openIdx, setOpenIdx] = useState(() =>
    ["base"]
      .map((k) => plan.billingNotes.findIndex((n) => n.key === k))
      .filter((i) => i >= 0)
  );

  const diffContent = (
    <div className="cb-pl-diff">
      {plan.diffFromPrev.map((d) => (
        <div className="cb-pl-diff-row" key={d.item}>
          <span className="cb-pl-diff-item">{d.item}</span>
          <span className="cb-pl-diff-prev">{d.prev}</span>
          <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['currentcolor']} />
          <span className="cb-pl-diff-curr">{d.curr}</span>
          <Tag color={d.type === "up" ? "success" : "warning"}>
            {d.type === "up" ? "提升" : "下调"}
          </Tag>
        </div>
      ))}
    </div>
  );

  return (
    <SectionBlock
      id="plan-billing"
      title="套餐与计费方案"
      icon={<IconPlusIcPublicGift iconSize="1.25rem" iconColor={['#0067D1']} />}
      extra={
        <TipBox
          content={diffContent}
          trigger="hover"
          direction="bottom"
          type="simple"
        >
          <span className="cb-pl-diff-trigger">
            <IconPlusIcIndustryCompare iconSize="0.875rem" iconColor={['currentcolor']} />
            与上一版套餐差异
          </span>
        </TipBox>
      }
    >
      <div className="cb-pl-card">
        <div className="cb-pl-card-head">
          <div className="cb-pl-card-title">
            <h4>{plan.name}</h4>
            <Tag color="blue">{plan.version}</Tag>
          </div>
          <div className="cb-pl-card-price">
            <span className="cb-pl-card-fee">{plan.monthlyFee}</span>
            <span className="cb-pl-card-fee-unit">/ 月</span>
          </div>
        </div>

        <div className="cb-pl-card-stats">
          <div className="cb-pl-stat">
            <span className="cb-pl-stat-label">座位数</span>
            <span className="cb-pl-stat-value">{plan.seats} 个</span>
          </div>
          <div className="cb-pl-stat">
            <span className="cb-pl-stat-label">计费周期</span>
            <span className="cb-pl-stat-value">季付预付</span>
          </div>
          <div className="cb-pl-stat">
            <span className="cb-pl-stat-label">包含模块</span>
            <span className="cb-pl-stat-value">{plan.modules.length} 个</span>
          </div>
        </div>

        <div className="cb-pl-modules">
          <div className="cb-pl-modules-title">包含模块清单</div>
          <div className="cb-pl-modules-grid">
            {plan.modules.map((m) => (
              <div className="cb-pl-module" key={m.name}>
                <div className="cb-pl-module-name">
                  <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['#09AA71']} />
                  {m.name}
                </div>
                <div className="cb-pl-module-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Panel
        className="cb-pl-collapse"
        enableMultiExpand
        selectedIndex={openIdx}
        onExpand={(index) => setOpenIdx((prev) => (prev.includes(index) ? prev : [...prev, index]))}
        onClose={(index, _event, collapsed) => {
          if (collapsed) setOpenIdx((prev) => prev.filter((i) => i !== index));
        }}
      >
        {plan.billingNotes.map((n) => (
          <PanelItem key={n.key} title={<span className="cb-pl-collapse-label">{n.title}</span>} closable={false}>
            <p className="cb-pl-collapse-content">{n.content}</p>
          </PanelItem>
        ))}
      </Panel>
    </SectionBlock>
  );
}
