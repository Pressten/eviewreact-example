import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import SearchInput from '@nce/eview-react/SearchInput';
import Select from '@nce/eview-react/Select';
import {
  CATEGORY_OPTIONS,
  CYCLE_OPTIONS,
  DIMENSION_OPTIONS,
  OWNER_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
} from '../../mock/metrics.js';
import { IconSearch, IconRefresh, IconChevronUp, IconChevronDown } from '../../components/icons.jsx';
import PanelCard from '../../components/panel-card/index.jsx';
import { useApp } from '../../context.jsx';

// 指标筛选表单（基础条件常显，扩展条件可展开）
// 说明：eview Select 的选项结构为 { text, value }；占位文案用 defaultLabel。
// 关键字采用 draft / filters 两段式：输入只更新 draft，回车或点“查询”才 applyFilters，
// 避免每次按键即时过滤（SearchInput.onSearch 按文档也可能在值变化时触发，故不挂 onSearch）。

function Field({ label, children }) {
  return (
    <div className="metric-filter__field">
      <label className="metric-filter__label">{label}</label>
      {children}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <Select
        enableClear
        options={options}
        defaultLabel="全部"
        value={value}
        selectStyle={{ width: '100%' }}
        onChange={(next) => onChange(next)}
      />
    </Field>
  );
}

function MetricFilter() {
  const { draft, updateDraft, applyFilters, resetFilters, activeFilterCount } = useApp();
  const [expanded, setExpanded] = useState(false);

  const handleKeywordKey = (event) => {
    if (event.key === 'Enter') applyFilters();
  };

  return (
    <PanelCard
      className="metric-filter"
      title="指标筛选"
      subtitle={activeFilterCount ? activeFilterCount + ' 个条件已生效' : '支持按名称、分类、周期与责任人组合筛选'}
    >
      <div className="metric-filter__grid">
        <Field label="指标名称 / 编码">
          <SearchInput
            value={draft.keyword}
            placeholder="输入指标名称或编码"
            style={{ width: '100%' }}
            onChange={(value) => updateDraft('keyword', value)}
            onClear={() => updateDraft('keyword', '')}
            inputProps={{ onKeyDown: handleKeywordKey }}
          />
        </Field>
        <FilterSelect
          label="指标分类"
          value={draft.category}
          options={CATEGORY_OPTIONS}
          onChange={(value) => updateDraft('category', value)}
        />
        <FilterSelect
          label="统计周期"
          value={draft.cycle}
          options={CYCLE_OPTIONS}
          onChange={(value) => updateDraft('cycle', value)}
        />
        <FilterSelect
          label="指标状态"
          value={draft.status}
          options={STATUS_OPTIONS}
          onChange={(value) => updateDraft('status', value)}
        />

        {expanded ? (
          [
            <FilterSelect
              key="dimension"
              label="统计维度"
              value={draft.dimension}
              options={DIMENSION_OPTIONS}
              onChange={(value) => updateDraft('dimension', value)}
            />,
            <FilterSelect
              key="source"
              label="数据来源"
              value={draft.source}
              options={SOURCE_OPTIONS}
              onChange={(value) => updateDraft('source', value)}
            />,
            <FilterSelect
              key="owner"
              label="责任人"
              value={draft.owner}
              options={OWNER_OPTIONS}
              onChange={(value) => updateDraft('owner', value)}
            />,
            <FilterSelect
              key="unit"
              label="统计单位"
              value={draft.unit}
              options={UNIT_OPTIONS}
              onChange={(value) => updateDraft('unit', value)}
            />,
          ]
        ) : null}
      </div>

      <div className="metric-filter__actions">
        <Button
          status="text"
          rightIcon={expanded ? <IconChevronUp /> : <IconChevronDown />}
          text={expanded ? '收起筛选' : '展开筛选'}
          onClick={() => setExpanded(!expanded)}
        />
        <Button leftIcon={<IconRefresh />} text="重置" onClick={resetFilters} />
        <Button status="primary" leftIcon={<IconSearch />} text="查询" onClick={applyFilters} />
      </div>
    </PanelCard>
  );
}

export default MetricFilter;
