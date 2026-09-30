import { useState } from "react";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import DatePicker from "@nce/eview-react/DatePicker";
import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicSearch, IconPlusIcPublicRefreshClockwise } from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import { TYPE_OPTIONS, STATUS_OPTIONS, DEPT_OPTIONS } from "../../mock/datasource.js";
import PageCard from "../../components/page-card/index.jsx";
import FormField from "../../components/form-field/index.jsx";
import "./index.css";

// Layer 4: 查询条件区 — 纯 H5 表单骨架 + eview-react 输入组件
export default function FilterPanel() {
  const { filters, applyFilters, resetFilters, emptyFilters } = useApp();
  const [draft, setDraft] = useState({ ...emptyFilters });
  const [rangeKey, setRangeKey] = useState(0);

  const patch = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleQuery = () => applyFilters({ ...draft });

  const handleReset = () => {
    setDraft({ ...emptyFilters });
    resetFilters();
    setRangeKey((k) => k + 1);
  };

  const formatDate = (d) => {
    if (!d) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  return (
    <PageCard title="查询条件" subtitle="按名称、类型与归属范围筛选数据源" className="filter-panel">
      <div className="filter-panel__grid">
        <FormField label="名称 / 编号" htmlFor="flt-keyword">
          <TextField
            id="flt-keyword"
            value={draft.keyword}
            placeholder="搜索数据源名称、编号或连接地址"
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={["currentcolor"]} />}
            onChange={(value) => patch("keyword", value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleQuery();
            }}
          />
        </FormField>

        <FormField label="数据源类型" htmlFor="flt-type">
          <Select
            id="flt-type"
            value={draft.type}
            enableClear
            defaultLabel="全部类型"
            options={TYPE_OPTIONS}
            onChange={(value) => patch("type", value)}
          />
        </FormField>

        <FormField label="运行状态" htmlFor="flt-status">
          <Select
            id="flt-status"
            value={draft.status}
            enableClear
            defaultLabel="全部状态"
            options={STATUS_OPTIONS}
            onChange={(value) => patch("status", value)}
          />
        </FormField>

        <FormField label="归属部门" htmlFor="flt-dept">
          <Select
            id="flt-dept"
            value={draft.dept}
            enableClear
            defaultLabel="全部部门"
            options={DEPT_OPTIONS}
            onChange={(value) => patch("dept", value)}
          />
        </FormField>

        <FormField label="创建时间" htmlFor="flt-range" className="filter-panel__span2">
          <DatePicker
            key={rangeKey}
            id="flt-range"
            type="date"
            format="yyyy-MM-dd"
            range={[]}
            placeholder="请选择日期范围"
            onOkClick={(obj) => {
              if (obj && obj.fromDateObj && obj.toDateObj) {
                const from = formatDate(obj.fromDateObj);
                const to = formatDate(obj.toDateObj);
                setTimeout(() => patch("range", { from, to }), 100);
              }
            }}
            onCancelClick={() => {}}
          />
        </FormField>
      </div>

      <div className="filter-panel__actions">
        <Button onClick={handleReset} leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={["currentcolor"]} />} text="重置" />
        <Button status="primary" onClick={handleQuery} leftIcon={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={["currentcolor"]} />} text="查询" />
      </div>
    </PageCard>
  );
}
