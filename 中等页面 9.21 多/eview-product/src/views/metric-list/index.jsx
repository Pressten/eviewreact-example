// =============================================================================
// [视图] MetricList — 一级页签「指标清单」（筛选条 + 表格 + 下钻）
// 职责：
//   1. 筛选条：关键字搜索（SearchInput）+ 数据域 / 频率 / 状态 下拉（Select）+ 重置
//   2. 工具条右侧：导出 + 选中计数
//   3. 表格：指标编码 / 名称（链接列，点击 onDrill 下钻）/ 数据域 / 来源表 / 频率 /
//      负责人 / 质量评分（排序）/ 记录数（排序）/ 状态（StatusTag）/ 更新时间 / 操作
//   4. 分页（Table enableAutoPaging）
// 契约（冻结）：
//   props: { onDrill: Function(record) }  // 点击指标名称链接 → 下钻到 record-detail 页签
//   数据：import { metricList, domainOptions, frequencyOptions, statusOptions } from '../../data.js'
//   共享件：StatusTag（src/components/status-tag）、@nce/eview-react 组件、@nce/icon-plus
// =============================================================================
import { useMemo, useState } from 'react';
import Table from '@nce/eview-react/Table';
import Select from '@nce/eview-react/Select';
import SearchInput from '@nce/eview-react/SearchInput';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import {
  IconPlusIcPublicRefresh,
  IconPlusIcPublicDownload,
  IconPlusIcPublicChartColumn,
  IconPlusIcPublicBell,
  IconPlusIcPublicTable,
  IconPlusIcPublicSettings,
  IconPlusIcPublicBranch,
  IconPlusIcPublicLink,
} from '@nce/icon-plus';
// TODO_CONTRACT: icon+ 组件名（Download/ChartColumn/Bell/Table/Settings/Branch/Link）为按命名规则推测，
//   待内网 getIconInfo 核实。Search/Refresh 来自 Reference 确认。
import StatusTag from '../../components/status-tag/index.jsx';
import { metricList, domainOptions, frequencyOptions, statusOptions } from '../../data.js';
import './index.css';

const toSelectOptions = (opts) => opts.map((o) => ({ text: o.label, value: o.value }));

export default function MetricList({ onDrill }) {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('all');
  const [frequency, setFrequency] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState([]);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return metricList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.name.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw) ||
        item.source.toLowerCase().includes(kw);
      const hitDomain = domain === 'all' || item.domain === domain;
      const hitFrequency = frequency === 'all' || item.frequency === frequency;
      const hitStatus = status === 'all' || item.status === status;
      return hitKeyword && hitDomain && hitFrequency && hitStatus;
    });
  }, [keyword, domain, frequency, status]);

  const resetFilters = () => {
    setKeyword('');
    setDomain('all');
    setFrequency('all');
    setStatus('all');
  };

  const columns = useMemo(
    () => [
      { title: 'ID', key: 'id', display: false },
      { title: '指标编码', key: 'code', width: 200, allowSort: false },
      {
        title: '指标名称',
        key: 'name',
        width: 190,
        allowSort: false,
        render: (cell, row) => (
          <Button status="text" text={cell} className="cell-link" onClick={() => onDrill(row)} />
        ),
      },
      { title: '数据域', key: 'domain', width: 100, allowSort: false },
      { title: '数据源表', key: 'source', width: 220, allowSort: false, ellipsis: true },
      { title: '更新频率', key: 'frequency', width: 100, allowSort: false },
      { title: '负责人', key: 'owner', width: 90, allowSort: false },
      {
        title: '质量评分',
        key: 'score',
        width: 100,
        align: 'right',
        render: (cell) => <span className="num-cell">{Number(cell).toFixed(1)}</span>,
      },
      {
        title: '记录数',
        key: 'rows',
        width: 120,
        align: 'right',
        render: (cell) => <span className="num-cell">{Number(cell).toLocaleString('zh-CN')}</span>,
      },
      {
        title: '状态',
        key: 'status',
        width: 110,
        allowSort: false,
        render: (cell) => <StatusTag status={cell} />,
      },
      { title: '更新时间', key: 'updatedAt', width: 170, allowSort: false },
      {
        title: '操作',
        key: 'action',
        width: 120,
        allowSort: false,
        freezeCol: true,
        render: (_cell, row) => (
          <div className="row-actions">
            <IconButton
              iconName={<IconPlusIcPublicTable />}
              tipText="查看采集明细"
              onClick={() => onDrill(row)}
            />
            <IconButton
              iconName={<IconPlusIcPublicSettings />}
              tipText="指标配置"
            />
            <IconButton
              iconName={<IconPlusIcPublicBranch />}
              tipText="血缘溯源"
              onClick={() => onDrill(row)}
            />
          </div>
        ),
      },
    ],
    [onDrill],
  );

  return (
    <div className="metric-list">
      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            className="toolbar-search"
            placeholder="搜索指标名称、编码或数据源表"
            value={keyword}
            onChange={(v) => setKeyword(v)}
            onSearch={(v) => setKeyword(v)}
            onClear={() => setKeyword('')}
          />
          <Select
            className="toolbar-select"
            options={toSelectOptions(domainOptions)}
            value={domain}
            onChange={(v) => setDomain(v)}
          />
          <Select
            className="toolbar-select"
            options={toSelectOptions(frequencyOptions)}
            value={frequency}
            onChange={(v) => setFrequency(v)}
          />
          <Select
            className="toolbar-select"
            options={toSelectOptions(statusOptions)}
            value={status}
            onChange={(v) => setStatus(v)}
          />
          <Button text="重置" leftIcon={<IconPlusIcPublicRefresh />} onClick={resetFilters} />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条指标
          </span>
          <Button text="导出" leftIcon={<IconPlusIcPublicDownload />} />
        </div>
      </div>

      <div className="table-hint">
        <IconPlusIcPublicLink iconColor={['currentColor']} iconSize={14} />
        <span>点击指标名称或「查看采集明细」图标，可下钻至该指标的采集明细页签。</span>
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-bar__text">
            已选择 <em>{selectedKeys.length}</em> 项指标
          </span>
          <div className="selection-bar__actions">
            <Button
              size="small"
              text="批量生成报告"
              leftIcon={<IconPlusIcPublicChartColumn />}
            />
            <Button
              size="small"
              text="批量设置告警"
              leftIcon={<IconPlusIcPublicBell />}
            />
            <Button
              size="small"
              status="text"
              text="取消选择"
              onClick={() => setSelectedKeys([])}
            />
          </div>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        checkedRows={selectedKeys}
        onRowCheck={(_row, checkedRows) => setSelectedKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无匹配指标"
        enableZebraCrossing
      />
    </div>
  );
}
