import { useMemo, useState } from 'react';
import Button from '@nce/eview-react/Button';
import Select from '@nce/eview-react/Select';
import SearchInput from '@nce/eview-react/SearchInput';
import Table from '@nce/eview-react/Table';
import IconButton from '@nce/eview-react/IconButton';
import {
  IconPlusIcPublicRotateCcw,
  IconPlusIcPublicDownload,
  IconPlusIcPublicCornerDownRight,
  IconPlusIcPublicGitBranch,
  IconPlusIcPublicFileText,
} from '@nce/icon-plus';
import StatusTag from '../../components/status-tag/index.jsx';
import ContextBanner from '../../components/context-banner/index.jsx';
import { recordList, recordStatusOptions } from '../../data.js';
import './index.css';

// =============================================================================
// [视图] RecordDetail — 二级页签「采集明细」（上下文条 + 统计 + 筛选 + 表格 + 下钻）
// 职责：
//   1. ContextBanner：展示当前基于哪条指标下钻（metric.name / code·domain·source /
//      频率·负责人·质量分）+ 回退入口
//   2. mini 统计 ×4：采集批次 / 成功批次 / 失败批次 / 平均质量分
//   3. 筛选条：关键字搜索（SearchInput）+ 状态下拉（Select）+ 重置；
//      工具条：计数 + 导出
//   4. 提示条：下钻引导
//   5. 表格：批次号（链接列，点击 onDrill 下钻到 lineage）/ 采集任务 / 来源节点 /
//      分区时间 / 记录数（排序）/ 耗时 / 质量分（排序）/ 执行状态（StatusTag）/
//      完成时间 / 操作（血缘/日志/重调度 IconButton）
//   6. 分页（前台分页 enableAutoPaging，22 条 mock 数据本地切片）
// 契约（冻结）：
//   props: { metric: Object | null, onDrill: Function(record), onBack: Function }
//   数据：recordList / recordStatusOptions 来自 ../../data.js（冻结，禁止改写）
//   共享件：ContextBanner（src/components/context-banner）、StatusTag（src/components/status-tag）
//   行为：useMemo 过滤；统计从 recordList 聚合；avgQuality = mean(quality).toFixed(1)
// TODO_CONTRACT: 下列 IconPlusIc* 组件名为按 antd/Lucide keyword 推断的迁移占位，
//   待内网用 @nce/icon-plus 的 getIconInfo 接口核验后回填准确导出名（不影响 L0 渲染）。
// =============================================================================
export default function RecordDetail({ metric, onDrill, onBack }) {
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

  // eview-react Select options 用 text 字段（非 label），data.js 冻结，故运行期映射
  const statusSelectOptions = recordStatusOptions.map((o) => ({
    text: o.label,
    value: o.value,
  }));

  const handleReset = () => {
    setKeyword('');
    setStatus('all');
  };

  const columns = [
    { title: 'ID', key: 'id', display: false },
    {
      title: '批次号',
      key: 'batch',
      width: 210,
      freezeCol: true,
      render: (cell, rowData) => (
        <Button
          status="text"
          size="small"
          className="cell-link"
          text={cell}
          onClick={() => onDrill(rowData)}
        />
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
      allowSort: false,
      render: (value) => <StatusTag status={value} />,
    },
    { title: '完成时间', key: 'finishedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      allowSort: false,
      render: (_cell, rowData) => (
        <div className="row-actions">
          <IconButton
            iconName={<IconPlusIcPublicGitBranch />}
            tipText="查看血缘溯源"
            onClick={() => onDrill(rowData)}
          />
          <IconButton
            iconName={<IconPlusIcPublicFileText />}
            tipText="运行日志"
          />
          <IconButton
            iconName={<IconPlusIcPublicRotateCcw />}
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
        crumb={
          metric
            ? `${metric.code} · ${metric.domain} · 数据源 ${metric.source}`
            : '未选择指标，展示全部采集记录'
        }
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
            placeholder="搜索批次号、采集任务或来源节点"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onClear={() => setKeyword('')}
            className="toolbar-search"
          />
          <Select
            className="toolbar-select"
            options={statusSelectOptions}
            value={status}
            defaultLabel="全部状态"
            enableClear
            onChange={(value) => setStatus(value)}
          />
          <Button
            leftIcon={<IconPlusIcPublicRotateCcw iconSize={14} />}
            text="重置"
            onClick={handleReset}
          />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条批次记录
          </span>
          <Button leftIcon={<IconPlusIcPublicDownload iconSize={14} />} text="导出" />
        </div>
      </div>

      <div className="table-hint">
        <IconPlusIcPublicCornerDownRight iconSize={14} />
        <span>点击批次号或「查看血缘溯源」图标，可继续下钻至该批次的血缘溯源页签。</span>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enableAutoPaging
        enablePagination
        emptyTableMsg="未找到匹配的采集批次"
        pagingProps={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
        }}
      />
    </div>
  );
}
