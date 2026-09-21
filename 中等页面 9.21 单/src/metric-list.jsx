// metric-list.jsx — Layer 4: 一级页签「指标清单」
// antd Input(prefix+allowClear) → eview-react SearchInput(内置搜索图标 + onClear)
// antd Select(label) → eview-react Select(text)
// antd Table(dataSource/rowKey/dataIndex/rowSelection/pagination) → eview-react Table(dataset/keyIndex/key/enableCheckBox/enablePagination)
// antd Button type="link" → Button status="text"
// antd Tooltip + Button shape=circle icon → IconButton iconName + tipText
import { useMemo, useState } from 'react';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import SearchInput from '@nce/eview-react/SearchInput';
import Select from '@nce/eview-react/Select';
import Table from '@nce/eview-react/Table';
import AppIcon from './app-icon.jsx';
import StatusTag from './status-tag.jsx';
import { metricList, domainOptions, frequencyOptions, statusOptions } from './data.js';

function MetricList({ onDrill }) {
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

  const columns = [
    { title: 'ID', key: 'id', display: false },
    { title: '指标编码', key: 'code', width: 200 },
    {
      title: '指标名称',
      key: 'name',
      width: 190,
      render: (value, rowData) => (
        <Button status="text" className="cell-link" text={value} onClick={() => onDrill(rowData)} />
      ),
    },
    { title: '数据域', key: 'domain', width: 100 },
    { title: '数据源表', key: 'source', width: 220 },
    { title: '更新频率', key: 'frequency', width: 100 },
    { title: '负责人', key: 'owner', width: 90 },
    {
      title: '质量评分',
      key: 'score',
      width: 100,
      align: 'right',
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: '记录数',
      key: 'rows',
      width: 120,
      align: 'right',
      render: (value) => <span className="num-cell">{value.toLocaleString('zh-CN')}</span>,
    },
    {
      title: '状态',
      key: 'status',
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: '更新时间', key: 'updatedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      allowSort: false,
      render: (_value, rowData) => (
        <div className="row-actions">
          <IconButton
            iconName={<AppIcon name="table-2" size={14} />}
            tipText="查看采集明细"
            onClick={() => onDrill(rowData)}
          />
          <IconButton
            iconName={<AppIcon name="settings" size={14} />}
            tipText="指标配置"
          />
          <IconButton
            iconName={<AppIcon name="git-branch" size={14} />}
            tipText="血缘溯源"
            onClick={() => onDrill(rowData)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="metric-list">
      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            className="toolbar-search"
            placeholder="搜索指标名称、编码或数据源表"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onClear={() => setKeyword('')}
          />
          <Select
            className="toolbar-select"
            options={domainOptions}
            value={domain}
            onChange={(value) => setDomain(value)}
          />
          <Select
            className="toolbar-select"
            options={frequencyOptions}
            value={frequency}
            onChange={(value) => setFrequency(value)}
          />
          <Select
            className="toolbar-select"
            options={statusOptions}
            value={status}
            onChange={(value) => setStatus(value)}
          />
          <Button leftIcon={<AppIcon name="rotate-ccw" size={14} />} text="重置" onClick={resetFilters} />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条指标
          </span>
          <Button leftIcon={<AppIcon name="download" size={14} />} text="导出" />
        </div>
      </div>

      <div className="table-hint">
        <AppIcon name="link-2" size={14} />
        <span>点击指标名称或「查看采集明细」图标，可下钻至该指标的采集明细页签。</span>
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-bar__text">
            已选择 <em>{selectedKeys.length}</em> 项指标
          </span>
          <div className="selection-bar__actions">
            <Button size="small" leftIcon={<AppIcon name="chart-column" size={14} />} text="批量生成报告" />
            <Button size="small" leftIcon={<AppIcon name="bell" size={14} />} text="批量设置告警" />
            <Button size="small" status="text" text="取消选择" onClick={() => setSelectedKeys([])} />
          </div>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedKeys}
        onRowCheck={(_row, checkedRows) => setSelectedKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无指标"
      />
    </div>
  );
}

export default MetricList;
