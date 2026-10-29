// Layer 4: 筛选条 — 关键词搜索 / 时间范围切换 / 行业下拉 / 导出下拉，联动下方所有数据区
import { useEffect, useState } from "react";
import { IconPlusIcDigitalPowerDpExcelFile, IconPlusIcDigitalPowerDpFile, IconPlusIcPublicDownload, IconPlusIcPublicSearch } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import SelectCard from "@nce/eview-react/SelectCard";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import { CUSTOMER_COUNTS, INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const EXPORT_MENU_ITEMS = [
  { key: "excel", label: "导出 Excel", icon: <IconPlusIcDigitalPowerDpExcelFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "pdf", label: "导出 PDF", icon: <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

const TIME_RANGE_DATA = TIME_RANGES.map((range) => ({ value: range.key, text: range.label }));

// 手写补位：antd Dropdown（eview-react 无对应，按 handwrite-templates 手写点击触发的下拉菜单）
function ExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <span className="filter-export-wrap">
      <Button
        text="导出"
        leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
      />
      {open ? (
        <ul className="filter-export-popover" onClick={(event) => event.stopPropagation()}>
          {EXPORT_MENU_ITEMS.map((item) => (
            <li key={item.key} className="filter-export-item" onClick={() => { setOpen(false); onExport(item.key); }}>
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}

export default function FilterBar() {
  const { timeRange, setTimeRange, industry, setIndustry, keyword, setKeyword, notify } = useApp();

  const customerTotal = CUSTOMER_COUNTS[industry] != null ? CUSTOMER_COUNTS[industry] : CUSTOMER_COUNTS["全部行业"];
  const riskCount = getRiskCustomers(timeRange, industry, keyword).length;
  const isFilterActive = industry !== "全部行业" || keyword.trim() !== "";

  const handleExport = (key) => {
    const format = key === "excel" ? "Excel" : "PDF";
    notify("success", `正在导出当前筛选结果（${format}），共 ${riskCount} 条风险记录…`);
  };

  const handleReset = () => {
    setKeyword("");
    setIndustry("全部行业");
    setTimeRange("30d");
    notify("info", "已重置筛选条件");
  };

  return (
    <section className="filter-bar">
      <TextField
        className="filter-search"
        value={keyword}
        onChange={(value) => setKeyword(value)}
        placeholder="搜索客户、行业或负责人"
        suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--text-placeholder)']} />}
      />
      <SelectCard
        value={timeRange}
        onChange={(value) => setTimeRange(value)}
        data={TIME_RANGE_DATA}
      />
      <Select
        className="filter-industry"
        value={industry}
        onChange={(value) => setIndustry(value)}
        options={INDUSTRY_OPTIONS.map((item) => ({ value: item, text: item }))}
      />
      <span className="filter-summary">
        在管客户 {customerTotal} 家 · 风险记录 {riskCount} 条
      </span>
      {isFilterActive ? (
        <a className="filter-reset" onClick={handleReset}>重置筛选</a>
      ) : null}
      <ExportMenu onExport={handleExport} />
    </section>
  );
}
