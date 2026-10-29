import { useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicSearch } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
import Select from "@/shared/Select";
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import { industries, timeRangeOptions, exportMenuItems } from "../../mock/dashboard.jsx";
import "./index.css";

// ③ 筛选条 — 关键词搜索 + 时间范围切换 + 行业下拉 + 导出下拉
// 时间/行业联动下方所有数据区(数据层面体现)
// antd Input→TextField(包壳) / Segmented→SelectCard / Select→Select(包壳) / Dropdown+Button→手写下拉（Dropdown 无 eview 直接对应）
export default function FilterBar() {
  const { timeRange, setTimeRange, industry, setIndustry, searchKeyword, setSearchKeyword } = useApp();
  const [exportOpen, setExportOpen] = useState(false);

  // SelectCard：options {label,value} → data {text,value}（label→text）
  const timeRangeData = timeRangeOptions.map((o) => ({ text: o.label, value: o.value }));
  // Select：options 字段 label→text
  const industryOptions = industries.map((i) => ({ text: i.label, value: i.value }));

  return (
    <section className="filter-bar">
      <div className="filter-left">
        <TextField
          className="filter-search"
          placeholder="搜索公司名 / 行业关键词"
          value={searchKeyword}
          // TextField onChange(value, oldValue, event) 首参是值不是 event
          onChange={(value) => setSearchKeyword(value)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--text-placeholder)']} />}
        />
      </div>
      <div className="filter-right">
        <div className="filter-group">
          <span className="filter-label">时间范围</span>
          <SelectCard data={timeRangeData} value={timeRange} onChange={(v) => setTimeRange(v)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">客户行业</span>
          <Select
            value={industry}
            // Select onChange(value, oldValue, text, oldText, event) 五参
            onChange={(v) => setIndustry(v)}
            options={industryOptions}
            style={{ width: "9rem" }}
          />
        </div>
        <div className="export-wrap">
          <Button onClick={() => setExportOpen((o) => !o)}>
            导出
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="filter-chev" />
          </Button>
          {exportOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setExportOpen(false)} />
              <div className="export-menu">
                {exportMenuItems.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    className="export-menu-item"
                    onClick={() => setExportOpen(false)}
                  >
                    {it.icon}
                    {it.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
