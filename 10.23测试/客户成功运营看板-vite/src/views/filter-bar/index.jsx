import { useState } from "react";
import { IconPlusIcPublicChevronDown } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
import Select from "@/shared/Select";
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import { industries, timeRangeOptions, exportMenuItems } from "../../mock/dashboard.jsx";
import "./index.css";

// ③ 筛选条 — 关键词搜索 + 时间范围切换 + 行业下拉 + 导出下拉
// 时间/行业联动下方所有数据区(数据层面体现)
export default function FilterBar() {
  const { timeRange, setTimeRange, industry, setIndustry, searchKeyword, setSearchKeyword } = useApp();
  const [exportOpen, setExportOpen] = useState(false);

  const timeRangeData = timeRangeOptions.map((o) => ({ text: o.label, value: o.value }));
  const industryOptions = industries.map((i) => ({ text: i.label, value: i.value }));

  return (
    <section className="filter-bar">
      <div className="filter-left">
        <TextField
          className="filter-search"
          placeholder="搜索公司名 / 行业关键词"
          value={searchKeyword}
          onChange={(value) => setSearchKeyword(value)}
        />
      </div>
      <div className="filter-right">
        <div className="filter-group">
          <span className="filter-label">时间范围</span>
          <SelectCard data={timeRangeData} value={timeRange} onChange={(value) => setTimeRange(value)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">客户行业</span>
          <Select
            value={industry}
            onChange={(value) => setIndustry(value)}
            options={industryOptions}
            style={{ width: "9rem" }}
          />
        </div>
        <div className="export-dropdown">
          <Button
            text="导出"
            rightIcon={<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="filter-chev" />}
            onClick={() => setExportOpen((o) => !o)}
          />
          {exportOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setExportOpen(false)} />
              <div className="export-menu">
                {exportMenuItems.map((it) => (
                  <div
                    key={it.key}
                    className="dropdown-menu-item"
                    onClick={() => setExportOpen(false)}
                  >
                    {it.icon}
                    <span>{it.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
