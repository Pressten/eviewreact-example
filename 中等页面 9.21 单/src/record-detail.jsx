// record-detail.jsx — Layer 4: 二级页签「采集明细」
// 由指标清单下钻进入；批次号链接再下钻到血缘溯源页签
import { useMemo, useState } from 'react';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import SearchInput from '@nce/eview-react/SearchInput';
import Select from '@nce/eview-react/Select';
import Table from '@nce/eview-react/Table';
import AppIcon from './app-icon.jsx';
import StatusTag from './status-tag.jsx';
import ContextBanner from './context-banner.jsx';
import { recordList, recordStatusOptions } from './data.js';

function RecordDetail({ metric, onDrill, onBack }) {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return recordList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.batch.toLowerCase().includes(kw) ||
        item.task.toLowerCase().includes(kw) ||
        item.node.toLowerCase().includes(kw);
      const hitStatus = status === 'all' || item.status === status;
      return hitKeyword && hitStatus;
    });
  }, [keyword, status]);

  const successCount = recordList.filter((r) => r.status === 'success').length;
  const failedCount = recordList.filter((r) => r.status === 'failed').length;
  const avgQuality = (
    recordList.reduce((sum, r) => sum + r.quality, 0) / recordList.length
  ).toFixed(1);

  const columns = [
    { title: 'ID', key: 'id', display: false },
    {
      title: '批次号',
      key: 'batch',
      width: 210,
      render: (value, rowData) => (
        <Button status="text" className="cell-link" text={value} onClick={() => onDrill(rowData)} />
      ),
    },
    { title: '采集任务', key: 'task', width: 200 },
    { title: '来源节点', key: 'node', width: 200 },
    { title: '分区时间', key: 'partition', width: 160 },
    {
      title: '记录数',
      key: 'rows',
      width: 120,
      align: 'right',
      render: (value) => <span className="num-cell">{value.toLocaleString('zh-CN')}</span>,
    },
    { title: '耗时', key: 'cost', width: 100, align: 'right' },
    {
      title: '质量分',
      key: 'quality',
      width: 100,
      align: 'right',
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: '执行状态',
      key: 'status',
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: '完成时间', key: 'finishedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      allowSort: false,
      render: (_value, rowData) => (
        <div className="row-actions">
          <IconButton
            iconName={<AppIcon name="git-branch" size={14} />}
            tipText="查看血缘溯源"
            onClick={() => onDrill(rowData)}
          />
          <IconButton
            iconName={<AppIcon name="file-text" size={14} />}
            tipText="运行日志"
          />
          <IconButton
            iconName={<AppIcon name="rotate-ccw" size={14} />}
            tipText="重新调度"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="record-detail">
      <ContextBanner
        icon="database"
        title={metric ? metric.name : '全部指标'}
        crumb={metric ? `${metric.code} · ${metric.domain} · 数据源 ${metric.source}` : '未选择指标，展示全部采集记录'}
        fields={
          metric
            ? [
                { label: '更新频率', value: metric.frequency },
                { label: '负责人', value: metric.owner },
                { label: '质量评分', value: metric.score.toFixed(1) },
              ]
            : []
        }
        onBack={onBack}
        backText="返回指标清单"
      />

      <div className="record-detail__stats">
        <div className="mini-stat">
          <span className="mini-stat__label">采集批次</span>
          <span className="mini-stat__value">{recordList.length}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">成功批次</span>
          <span className="mini-stat__value mini-stat__value--success">{successCount}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">失败批次</span>
          <span className="mini-stat__value mini-stat__value--error">{failedCount}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">平均质量分</span>
          <span className="mini-stat__value">{avgQuality}</span>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            className="toolbar-search"
            placeholder="搜索批次号、采集任务或来源节点"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onClear={() => setKeyword('')}
          />
          <Select
            className="toolbar-select"
            options={recordStatusOptions}
            value={status}
            onChange={(value) => setStatus(value)}
          />
          <Button
            leftIcon={<AppIcon name="rotate-ccw" size={14} />}
            text="重置"
            onClick={() => {
              setKeyword('');
              setStatus('all');
            }}
          />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条批次记录
          </span>
          <Button leftIcon={<AppIcon name="download" size={14} />} text="导出" />
        </div>
      </div>

      <div className="table-hint">
        <AppIcon name="corner-down-right" size={14} />
        <span>点击批次号或「查看血缘溯源」图标，可继续下钻至该批次的血缘溯源页签。</span>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无采集记录"
      />
    </div>
  );
}

export default RecordDetail;
