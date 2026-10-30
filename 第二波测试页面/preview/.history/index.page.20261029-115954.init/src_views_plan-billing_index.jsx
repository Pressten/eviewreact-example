import { Tag, Collapse, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionBlock from "../../components/section-block/index.jsx";
import { plan } from "../../mock/data.js";
import "./index.css";

export default function PlanBilling() {
  const collapseItems = plan.billingNotes.map((n) => ({
    key: n.key,
    label: (
      <span className="cb-pl-collapse-label">
        <Icon name="chevron-right" size="0.875rem" />
        {n.title}
      </span>
    ),
    children: <p className="cb-pl-collapse-content">{n.content}</p>,
  }));

  const diffContent = (
    <div className="cb-pl-diff">
      {plan.diffFromPrev.map((d) => (
        <div className="cb-pl-diff-row" key={d.item}>
          <span className="cb-pl-diff-item">{d.item}</span>
          <span className="cb-pl-diff-prev">{d.prev}</span>
          <Icon name="arrow-right" size="0.75rem" />
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
      icon={<Icon name="package" size="1.25rem" color="#0067D1" />}
      extra={
        <Tooltip title={diffContent} color="#FFFFFF" overlayInnerStyle={{ width: "20rem" }}>
          <span className="cb-pl-diff-trigger">
            <Icon name="git-compare" size="0.875rem" />
            与上一版套餐差异
          </span>
        </Tooltip>
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
                  <Icon name="circle-check-big" size="0.875rem" color="#09AA71" />
                  {m.name}
                </div>
                <div className="cb-pl-module-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Collapse items={collapseItems} className="cb-pl-collapse" defaultActiveKey={["base"]} />
    </SectionBlock>
  );
}
