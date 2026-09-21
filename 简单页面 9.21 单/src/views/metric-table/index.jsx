import { useState } from 'react';
import Table from '@nce/eview-react/Table';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import MessageDialog from '@nce/eview-react/MessageDialog';
import PanelCard from '../../components/panel-card/index.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import CategoryChip from '../../components/category-chip/index.jsx';
import RatioValue from '../../components/ratio-value/index.jsx';
import MoreMenu from '../../components/more-menu/index.jsx';
import {
  IconSquarePen,
  IconCopy,
  IconEllipsis,
  IconUpload,
  IconRefresh,
  IconCircleCheck,
  IconCircleSlash,
  IconDownload,
  IconFileSpreadsheet,
  IconTrash,
} from '../../components/icons.jsx';
import { useApp } from '../../context.jsx';
import { formatMetricValue, isBreach } from '../../mock/metrics.js';

// 指标列表（工具区 + 批量操作条 + 表格 + 分页）
function MetricTable() {
  const {
    metrics,
    filteredMetrics,
    selectedRowKeys,
    setSelectedRowKeys,
    openCreate,
    openEdit,
    duplicateMetric,
    updateStatus,
    removeMetric,
    notify,
  } = useApp();

  const [pendingDelete, setPendingDelete] = useState(null);

  const selectedCount = selectedRowKeys.length;
  const offlineIds = metrics.filter((m) => m.status === 'offline').map((m) => m.id);

  const handleRowAction = (key, record) => {
    if (key === 'enable') {
      updateStatus([record.id], 'online');
      notify('success', '已启用「' + record.name + '」');
    } else if (key === 'disable') {
      updateStatus([record.id], 'offline');
      notify('success', '已停用「' + record.name + '」');
    } else if (key === 'export') {
      notify('success', '「' + record.name + '」已加入导出队列');
    } else if (key === 'remove') {
      setPendingDelete(record);
    }
  };

  const moreItems = (record) => [
    record.status === 'offline'
      ? { key: 'enable', icon: <IconCircleCheck />, label: '启用指标' }
      : { key: 'disable', icon: <IconCircleSlash />, label: '停用指标' },
    { key: 'export', icon: <IconFileSpreadsheet />, label: '导出指标数据' },
    { divider: true },
    { key: 'remove', icon: <IconTrash />, label: '删除指标', danger: true },
  ];

  const columns = [
    { title: 'ID', key: 'id', display: false },
    {
      title: '指标名称',
      key: 'name',
      width: 260,
      allowSort: false,
      render: (_cell, row) => (
        <div className="metric-table__name">
          <Button status="text" className="metric-table__name-link" text={row.name} onClick={() => openEdit(row)} />
          <span className="metric-table__code">{row.code}</span>
        </div>
      ),
    },
    {
      title: '指标分类',
      key: 'category',
      width: 110,
      allowSort: false,
      render: (cell) => <CategoryChip category={cell} />,
    },
    { title: '统计周期', key: 'cycle', width: 96, allowSort: false },
    {
      title: '统计维度',
      key: 'dimension',
      width: 104,
      allowSort: false,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: '目标值',
      key: 'target',
      width: 104,
      align: 'right',
      allowSort: false,
      render: (cell, row) => (
        <span className="metric-table__num">{formatMetricValue(cell, row.unit)}</span>
      ),
    },
    {
      title: '当前值',
      key: 'current',
      width: 116,
      align: 'right',
      allowSort: false,
      render: (cell, row) => (
        <span className={'metric-table__num' + (isBreach(row) ? ' metric-table__num--alert' : '')}>
          {formatMetricValue(cell, row.unit)}
        </span>
      ),
    },
    {
      title: '达成率',
      key: 'ratio',
      width: 128,
      align: 'right',
      render: (cell, row) => <RatioValue ratio={cell} trend={row.trend} polarity={row.polarity} />,
    },
    {
      title: '指标状态',
      key: 'status',
      width: 108,
      allowSort: false,
      render: (cell) => <StatusTag status={cell} />,
    },
    { title: '责任人', key: 'owner', width: 96, allowSort: false },
    {
      title: '数据来源',
      key: 'source',
      width: 116,
      allowSort: false,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: '更新时间',
      key: 'updatedAt',
      width: 150,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 132,
      align: 'right',
      allowSort: false,
      render: (_cell, row) => (
        <div className="metric-table__actions">
          <IconButton iconName={<IconSquarePen />} tipText="编辑指标" onClick={() => openEdit(row)} />
          <IconButton
            iconName={<IconCopy />}
            tipText="复制指标定义"
            onClick={() => {
              duplicateMetric(row.id);
              notify('success', '已复制「' + row.name + '」的定义');
            }}
          />
          <MoreMenu items={moreItems(row)} onSelect={(key) => handleRowAction(key, row)} />
        </div>
      ),
    },
  ];

  const dataset = filteredMetrics.map((m) => ({
    id: m.id,
    name: m.name,
    code: m.code,
    category: m.category,
    cycle: m.cycle,
    dimension: m.dimension,
    target: m.target,
    current: m.current,
    ratio: m.ratio,
    status: m.status,
    owner: m.owner,
    source: m.source,
    updatedAt: m.updatedAt,
    trend: m.trend,
    polarity: m.polarity,
    unit: m.unit,
  }));

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={'已收录 ' + metrics.length + ' 个指标 / 当前结果 ' + filteredMetrics.length + ' 条'}
      extra={
        <>
          <Button size="small" leftIcon={<IconUpload />} text="批量导入" />
          <IconButton
            iconName={<IconRefresh />}
            tipText="刷新数据"
            onClick={() => notify('success', '指标数据已刷新')}
          />
        </>
      }
      bodyClassName="metric-table__body"
    >
      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button
            size="small"
            leftIcon={<IconCircleCheck />}
            text="批量启用"
            onClick={() => {
              updateStatus(selectedRowKeys, 'online');
              notify('success', '已批量启用 ' + selectedCount + ' 个指标');
            }}
          />
          <Button
            size="small"
            leftIcon={<IconCircleSlash />}
            text="批量停用"
            onClick={() => {
              updateStatus(selectedRowKeys, 'offline');
              notify('success', '已批量停用 ' + selectedCount + ' 个指标');
            }}
          />
          <Button
            size="small"
            leftIcon={<IconDownload />}
            text="导出所选"
            onClick={() => notify('success', '已导出 ' + selectedCount + ' 个指标的明细')}
          />
          <Button
            status="text"
            size="small"
            className="metric-table__bulk-clear"
            text="取消选择"
            onClick={() => setSelectedRowKeys([])}
          />
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={dataset}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        disableCheckboxIds={offlineIds}
        checkedRows={selectedRowKeys}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无符合条件的指标"
        enableZebraCrossing
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" size="small" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="confirm"
        isOpen={!!pendingDelete}
        iconLocation="title"
        content={pendingDelete ? '删除指标「' + pendingDelete.name + '」？' : ''}
        detail="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        onClose={() => setPendingDelete(null)}
        buttons={{
          cancel: { text: '取消', onClick: () => setPendingDelete(null) },
          ok: {
            text: '删除',
            focused: true,
            onClick: () => {
              if (!pendingDelete) return;
              removeMetric(pendingDelete.id);
              notify('success', '已删除「' + pendingDelete.name + '」');
              setPendingDelete(null);
            },
          },
        }}
      />
    </PanelCard>
  );
}

export default MetricTable;
