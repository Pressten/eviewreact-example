// Layer 4: ① 页头 — 标题 + 时间范围 + 门店范围筛选（联动 ③⑤⑦⑧）+ 导出 PDF
import { Button, Select } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { WEEK_INFO, buildScopeOptions } from "../../mock/weekly-report.js";
import "./index.css";

const scopeOptions = buildScopeOptions();

export default function ReportHeader({ scope, onScopeChange }) {
  return (
    <header className="report-header">
      <div className="header-main">
        <span className="header-brand">
          <Icon name="store" size="1.25rem" />
        </span>
        <div className="header-title-wrap">
          <h1 className="header-title">{WEEK_INFO.weekTitle}</h1>
          <p className="header-meta">
            <Icon name="calendar" size="0.875rem" className="header-meta-icon" />
            <span>{WEEK_INFO.dateRange}（{WEEK_INFO.weekdayNote}）</span>
            <span className="meta-divider" />
            <span>{WEEK_INFO.brandName} · 连锁零售 · 数据截至 {WEEK_INFO.compileTime}</span>
            <span className="meta-divider" />
            <span>报送：区域总经理例会（每周一 09:00）</span>
          </p>
        </div>
      </div>
      <div className="header-actions no-print">
        <div className="scope-field">
          <span className="scope-label">门店范围</span>
          <Select
            value={scope}
            options={scopeOptions}
            onChange={onScopeChange}
            style={{ width: "13rem" }}
          />
        </div>
        <Button
          type="primary"
          icon={<Icon name="download" size="0.875rem" />}
          onClick={() => window.print()}
        >
          导出 PDF
        </Button>
      </div>
    </header>
  );
}
