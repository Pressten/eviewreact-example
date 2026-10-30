// Layer 4: ① 页头 — 标题 + 时间范围 + 门店范围筛选（联动 ③⑤⑦⑧）+ 导出 PDF
import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicCalendar, IconPlusIcPublicDownload, IconPlusIcHuaweiCloudStoreNew } from '@hui/icon-plus';
import Select from "@/shared/Select";
import { WEEK_INFO, buildScopeOptions } from "../../mock/weekly-report.jsx";
import "./index.css";

// eview Select options 字段为 text（antd 是 label），包壳 Select 不做转换，这里映射
const scopeOptions = buildScopeOptions().map((opt) => ({ value: opt.value, text: opt.label }));

export default function ReportHeader({ scope, onScopeChange }) {
  return (
    <header className="report-header">
      <div className="header-main">
        <span className="header-brand">
          <IconPlusIcHuaweiCloudStoreNew iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <div className="header-title-wrap">
          <h1 className="header-title">{WEEK_INFO.weekTitle}</h1>
          <p className="header-meta">
            <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['currentcolor']} className="header-meta-icon" />
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
          status="primary"
          leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="导出 PDF"
          onClick={() => window.print()}
        />
      </div>
    </header>
  );
}
