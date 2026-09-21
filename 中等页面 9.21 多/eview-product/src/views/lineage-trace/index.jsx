import { useMemo, useState } from 'react';
import Button from '@nce/eview-react/Button';
import Select from '@nce/eview-react/Select';
import SearchInput from '@nce/eview-react/SearchInput';
import Table from '@nce/eview-react/Table';
import IconButton from '@nce/eview-react/IconButton';
import {
  IconPlusIcPublicRefresh,
  IconPlusIcPublicNetwork,
  IconPlusIcPublicDownload,
  IconPlusIcPublicArrowRight,
  IconPlusIcPublicExpand,
  IconPlusIcPublicShare,
} from '@nce/icon-plus';
import ContextBanner from '../../components/context-banner/index.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import { lineageList, levelOptions, nodeTypeOptions } from '../../data.js';
import './index.css';

// TODO_CONTRACT: icon-plus 组件名按语义取近似（IconPlusIcPublic*），待内网
//   icon-plus registry 实测核对：search/refresh/network/download/arrow-right/expand/share。
// TODO_CONTRACT: 共享件 StatusTag、ContextBanner 当前为 stub（归属 metric-list /
//   record-detail agent 填实），本 view 按冻结契约传 props，渲染样式待其就绪。
// TODO_CONTRACT: 工具条「全屏血缘视图 / 导出」与行内「查看节点详情 / 分享链路」
//   为 mockup 占位按钮，onClick 暂为 no-op，待业务接入。

const LEVEL_META = [
  { key: '上游', tone: 'info', desc: '数据来源节点' },
  { key: '当前', tone: 'brand', desc: '当前加工节点' },
  { key: '下游', tone: 'violet', desc: '消费与输出节点' },
];

// data.js 导出 { label, value }；eview-react Select 选项需 { text, value }，在此适配
const toSelectOptions = (opts) => opts.map((o) => ({ text: o.label, value: o.value }));

export default function LineageTrace({ metric, record, onBack }) {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState('all');
  const [nodeType, setNodeType] = useState('all');

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return lineageList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.nodeName.toLowerCase().includes(kw) ||
        item.nodeCode.toLowerCase().includes(kw) ||
        item.tableName.toLowerCase().includes(kw);
      const hitLevel = level === 'all' || item.level === level;
      const hitType = nodeType === 'all' || item.nodeType === nodeType;
      return hitKeyword && hitLevel && hitType;
    });
  }, [keyword, level, nodeType]);

  const columns = [
    { title: 'ID', key: 'id', display: false },
    { title: '节点编码', key: 'nodeCode', width: 150 },
    {
      title: '血缘层级',
      key: 'level',
      width: 110,
      allowSort: false,
      render: (cell) => <StatusTag status={cell} />,
    },
    {
      title: '节点类型',
      key: 'nodeType',
      width: 100,
      allowSort: false,
      render: (cell) => <span className="type-chip">{cell}</span>,
    },
    { title: '节点名称', key: 'nodeName', width: 200, ellipsis: true },
    { title: '物理表 / 接口', key: 'tableName', width: 230, ellipsis: true },
    { title: '归属团队', key: 'owner', width: 130 },
    {
      title: '数据量',
      key: 'rows',
      width: 140,
      align: 'right',
      render: (value) => (
        <span className="num-cell">{value === 0 ? '—' : value.toLocaleString('zh-CN')}</span>
      ),
    },
    { title: '时效', key: 'latency', width: 100, allowSort: false },
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
      key: 'op',
      width: 96,
      allowSort: false,
      render: () => (
        <div className="row-actions">
          <IconButton
            iconName={<IconPlusIcPublicExpand />}
            tipText="查看节点详情"
            tipData={{ direction: 'top' }}
            onClick={() => {}}
          />
          <IconButton
            iconName={<IconPlusIcPublicShare />}
            tipText="分享链路"
            tipData={{ direction: 'top' }}
            onClick={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="lineage-trace">
      <ContextBanner
        icon="git-branch"
        title={`血缘溯源 · ${metric ? metric.name : '全部指标'}`}
        crumb={
          record
            ? `批次 ${record.batch} · 任务 ${record.task} · 来源节点 ${record.node}`
            : '未选择批次，展示指标全量血缘节点'
        }
        fields={
          record
            ? [
                { label: '分区时间', value: record.partition },
                { label: '记录数', value: record.rows.toLocaleString('zh-CN') },
                { label: '质量分', value: record.quality.toFixed(1) },
              ]
            : []
        }
        onBack={onBack}
        backText="返回采集明细"
      />

      <div className="lineage-path">
        {LEVEL_META.map((meta, index) => {
          const nodes = lineageList.filter((n) => n.level === meta.key);
          return (
            <div className="lineage-path__group" key={meta.key}>
              <div className={`lineage-path__head lineage-path__head--${meta.tone}`}>
                <span className="lineage-path__head-name">{meta.key}节点</span>
                <span className="lineage-path__head-desc">{meta.desc}</span>
                <span className="lineage-path__head-num">{nodes.length}</span>
              </div>
              <div className="lineage-path__nodes">
                {nodes.slice(0, 3).map((node) => (
                  <span className="lineage-path__node" key={node.id} title={node.tableName}>
                    <span className="lineage-path__node-type">{node.nodeType}</span>
                    <span className="lineage-path__node-name">{node.nodeName}</span>
                  </span>
                ))}
                {nodes.length > 3 ? (
                  <span className="lineage-path__more">+{nodes.length - 3} 个节点</span>
                ) : null}
              </div>
              {index < LEVEL_META.length - 1 ? (
                <span className="lineage-path__arrow">
                  <IconPlusIcPublicArrowRight iconSize={16} />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            className="toolbar-search"
            placeholder="搜索节点名称、编码或物理表"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onClear={() => setKeyword('')}
          />
          <Select
            className="toolbar-select"
            options={toSelectOptions(levelOptions)}
            value={level}
            onChange={(value) => setLevel(value)}
          />
          <Select
            className="toolbar-select"
            options={toSelectOptions(nodeTypeOptions)}
            value={nodeType}
            onChange={(value) => setNodeType(value)}
          />
          <Button
            leftIcon={<IconPlusIcPublicRefresh />}
            text="重置"
            onClick={() => {
              setKeyword('');
              setLevel('all');
              setNodeType('all');
            }}
          />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 个血缘节点
          </span>
          <Button leftIcon={<IconPlusIcPublicNetwork />} text="全屏血缘视图" onClick={() => {}} />
          <Button leftIcon={<IconPlusIcPublicDownload />} text="导出" onClick={() => {}} />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataSource}
        keyIndex={0}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无血缘节点"
      />
    </div>
  );
}
