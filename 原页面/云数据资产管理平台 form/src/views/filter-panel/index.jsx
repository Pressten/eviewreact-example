import { useState } from "react";
import { Input, Select, DatePicker, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { TYPE_OPTIONS, STATUS_OPTIONS, DEPT_OPTIONS } from "../../mock/datasource.js";
import PageCard from "../../components/page-card/index.jsx";
import FormField from "../../components/form-field/index.jsx";
import "./index.css";

const { RangePicker } = DatePicker;

// Layer 4: 查询条件区 — 纯 H5 表单骨架 + antd 输入组件
export default function FilterPanel() {
  const { filters, applyFilters, resetFilters, emptyFilters } = useApp();
  const [draft, setDraft] = useState({ ...emptyFilters });

  const patch = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleQuery = () => applyFilters({ ...draft });

  const handleReset = () => {
    setDraft({ ...emptyFilters });
    resetFilters();
  };

  return (
    <PageCard title="查询条件" subtitle="按名称、类型与归属范围筛选数据源" className="filter-panel">
      <div className="filter-panel__grid">
        <FormField label="名称 / 编号" htmlFor="flt-keyword">
          <Input
            id="flt-keyword"
            value={draft.keyword}
            allowClear
            placeholder="搜索数据源名称、编号或连接地址"
            suffix={<Icon name="search" size="0.875rem" />}
            onChange={(e) => patch("keyword", e.target.value)}
            onPressEnter={handleQuery}
          />
        </FormField>

        <FormField label="数据源类型" htmlFor="flt-type">
          <Select
            id="flt-type"
            value={draft.type}
            allowClear
            placeholder="全部类型"
            options={TYPE_OPTIONS}
            onChange={(value) => patch("type", value)}
          />
        </FormField>

        <FormField label="运行状态" htmlFor="flt-status">
          <Select
            id="flt-status"
            value={draft.status}
            allowClear
            placeholder="全部状态"
            options={STATUS_OPTIONS}
            onChange={(value) => patch("status", value)}
          />
        </FormField>

        <FormField label="归属部门" htmlFor="flt-dept">
          <Select
            id="flt-dept"
            value={draft.dept}
            allowClear
            placeholder="全部部门"
            options={DEPT_OPTIONS}
            onChange={(value) => patch("dept", value)}
          />
        </FormField>

        <FormField label="创建时间" htmlFor="flt-range" className="filter-panel__span2">
          <RangePicker
            id="flt-range"
            value={draft.range}
            placeholder={["开始日期", "结束日期"]}
            onChange={(dates) => patch("range", dates)}
          />
        </FormField>
      </div>

      <div className="filter-panel__actions">
        <Button onClick={handleReset} icon={<Icon name="rotate-ccw" size="0.875rem" />}>
          重置
        </Button>
        <Button type="primary" onClick={handleQuery} icon={<Icon name="search" size="0.875rem" />}>
          查询
        </Button>
      </div>
    </PageCard>
  );
}
