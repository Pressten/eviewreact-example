import {useMemo, useState} from 'react';
import { IconPlusIcPublicLeftArrow, IconPlusIcPublicSearch } from '@hui/icon-plus';
import Drawer from '@nce/eview-react/Drawer';
import Table from '@nce/eview-react/Table';
import Tab, {TabItem} from '@nce/eview-react/Tab';
import TextField from '@/shared/TextField';
import {ruleDeviceRows} from '../../utils/report-summary.js';
import OptionGroup from '../option-group/index.jsx';
import StatusMark from '../status-mark/index.jsx';
import ReportMetric from '../report-metric/index.jsx';
import ReportRuleLink from '../report-rule-link/index.jsx';
import ReportDeviceLink from '../report-device-link/index.jsx';
import './index.css';

const statusColumn = {
  title: '检查结果', key: 'status', align: 'left', width: 108,
  sorter: (a, b) => a.status.localeCompare(b.status),
  render: (_, __, ___, row) => <StatusMark failed={row?.rawData?.status === 'failed'}>{row?.rawData?.status === 'failed' ? '不通过' : '通过'}</StatusMark>,
};

const evidenceColumn = {title: '违规配置片段', key: 'excerpt', align: 'left',
  sorter: (a, b) => a.findings.map(item => item.excerpt).join('\n').localeCompare(b.findings.map(item => item.excerpt).join('\n'), 'zh-CN'),
  render: (_, __, ___, row) => {const r = row?.rawData; return r?.findings?.length ? <ul className="rule-evidence-lines">{r.findings.map(finding =>
    <li key={finding.line + finding.excerpt}><span className="rule-evidence-location">第 {finding.line} 行</span>
      <pre className="rule-evidence-code">{finding.context && <><span>{finding.context}</span>{'\n'}</>}{finding.excerpt}</pre>
    </li>
  )}</ul> : '—';}};

function EvidenceSearch({subject, value, onChange}) {
  return <div className="rule-evidence-search">
    <TextField aria-label={'搜索' + subject + '或配置片段'} placeholder={'搜索' + subject + '或配置片段'} value={value}
      suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />} onChange={value => onChange(value)}/>
  </div>;
}

function RuleDeviceEvidence({rule, devices, initialDevice, onOpenDevice}) {
  const [status, setStatus] = useState(rule.failed > 0 ? 'failed' : 'all');
  const [query, setQuery] = useState(initialDevice || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const rows = useMemo(() => ruleDeviceRows(rule, devices), [rule, devices]);
  const term = query.trim().toLowerCase();
  const visible = rows.filter(row => (status === 'all' || row.status === status) &&
    (row.name.toLowerCase().includes(term) || row.findings.some(item => (item.context + ' ' + item.excerpt).toLowerCase().includes(term))));
  const columns = [
    {title: '设备名称', key: 'name', align: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN', {numeric: true}),
      render: (_, __, ___, row) => <ReportDeviceLink device={row?.rawData} onOpen={onOpenDevice}/>},
    statusColumn,
    ...(rule.failed && status !== 'passed' ? [evidenceColumn] : []),
  ];
  return <div className="rule-detail-panel">
    <div className="rule-check-requirement"><h3>检查要求</h3><p>{rule.expected}</p></div>
    <div className="rule-evidence-tools">
      <OptionGroup ariaLabel="规则关联设备状态" value={status}
        options={[[ 'all', '全部', rows.length ], [ 'failed', '不通过', rule.failed ], [ 'passed', '通过', rule.passed ]]}
        onChange={next => {setStatus(next); setPage(1);}}/>
      <EvidenceSearch subject="规则关联设备" value={query} onChange={value => {setQuery(value); setPage(1);}}/>
    </div>
    <div className="report-detail-table">
      <Table className="ict-data-table ict-table-comfortable" columns={columns} dataset={visible}
        enableZebraCrossing={false} enableColumnCompareUpdate width="unset"
        enablePagination enableAutoPaging
        pagingProps={{currentPage: page, pageSize, pageSizeOptions: [5, 10, 20, 50], onPageSizeChange: size => {setPageSize(size); setPage(1);}}}
        onPageChange={currentPage => setPage(currentPage || 1)}
        emptyTableMsg="没有匹配的设备"/>
    </div>
  </div>;
}

function RuleReference({rule}) {
  return <div className="rule-detail-panel rule-detail-reference">
    <dl className="rule-definition"><div><dt>检查要求</dt><dd>{rule.details.description || rule.expected}</dd></div></dl>
    <section className="rule-remediation-reference"><h3>修复建议</h3><p>{rule.details.suggestion}</p></section>
  </div>;
}

function RuleDetailTabs({rule, evidence}) {
  const [tabIndex, setTabIndex] = useState(0);
  return <Tab type="main" draggable={false} selectedIndex={tabIndex}
    onClick={(index, title, event) => setTabIndex(index)}>
    <TabItem title="设备核验">{evidence}</TabItem>
    <TabItem title="规则与修复建议"><RuleReference rule={rule}/></TabItem>
  </Tab>;
}

function DeviceRuleEvidence({device, rules, onOpenRule}) {
  const [status, setStatus] = useState(device.failed ? 'failed' : 'all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const rows = useMemo(() => rules.filter(rule => device.checkedRuleIds.includes(rule.id)).map(rule => {
    const failed = device.failedRuleIds.includes(rule.id);
    return {...rule, status: failed ? 'failed' : 'passed', findings: failed ? rule.details?.findings?.[device.id] || [] : []};
  }), [device, rules]);
  const term = query.trim().toLowerCase();
  const visible = rows.filter(row => (status === 'all' || row.status === status) &&
    (row.name.toLowerCase().includes(term) || row.expected.toLowerCase().includes(term) ||
      row.findings.some(item => (item.context + ' ' + item.excerpt).toLowerCase().includes(term))));
  const columns = [
    {title: '规则名称', key: 'name', align: 'left', sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN'),
      render: (_, __, ___, row) => <ReportRuleLink rule={row?.rawData} device={device.name} onOpen={onOpenRule}/>},
    statusColumn,
    ...(device.failed && status !== 'passed' ? [evidenceColumn] : [{title: '检查要求', key: 'expected', align: 'left', sorter: (a, b) => a.expected.localeCompare(b.expected, 'zh-CN')}]),
  ];
  return <div className="device-detail-panel">
    <dl className="report-metric-grid detail-device-metrics">
      <ReportMetric label="检查项" value={device.total} unit="项"/>
      <ReportMetric label="不通过" value={device.failed} unit="项" color="var(--error)"/>
      <ReportMetric label="通过" value={device.passed} unit="项"/>
    </dl>
    <h3 className="detail-section-title">检查规则</h3>
    <div className="rule-evidence-tools">
      <OptionGroup ariaLabel="设备关联规则状态" value={status}
        options={[[ 'all', '全部', rows.length ], [ 'failed', '不通过', device.failed ], [ 'passed', '通过', device.passed ]]}
        onChange={next => {setStatus(next); setPage(1);}}/>
      <EvidenceSearch subject="设备关联规则" value={query} onChange={value => {setQuery(value); setPage(1);}}/>
    </div>
    <div className="report-detail-table">
      <Table className="ict-data-table ict-table-comfortable" columns={columns} dataset={visible}
        enableZebraCrossing={false} enableColumnCompareUpdate width="unset"
        enablePagination enableAutoPaging
        pagingProps={{currentPage: page, pageSize, pageSizeOptions: [5, 10, 20, 50], onPageSizeChange: size => {setPageSize(size); setPage(1);}}}
        onPageChange={currentPage => setPage(currentPage || 1)}
        emptyTableMsg="没有匹配的规则"/>
    </div>
  </div>;
}

export default function ReportDetailDrawer({selection, devices, rules, onOpenRule, onOpenDevice, onClose}) {
  const {rule, device, deviceRecord, open, type} = selection;
  const isDevice = type === 'device';
  // device 是进入规则页前选中的设备名；规则或设备上下文变化时重建核验视图。
  const selectedDevice = device && devices.find(item => item.name === device);
  const evidence = rule && <RuleDeviceEvidence key={rule.id + (device || '')} rule={rule}
    devices={devices} initialDevice={device} onOpenDevice={onOpenDevice}/>;
  return <Drawer placement="right" visible={open} onClose={onClose} destroyOnClose
    width="min(56rem, calc(100vw - 3rem))" isMountBody={false}
    style={{position:'absolute',top:'var(--workspace-header-height)'}}
    title={<div id="report-detail-title" className="report-detail-heading">
      <span>{isDevice ? '单设备详情' : '单规则详情'}</span><h2>{isDevice ? deviceRecord?.name : rule?.name}</h2>
    </div>}>
    {selectedDevice && <button type="button" className="detail-back-link" onClick={() => onOpenDevice(selectedDevice)}>
      <IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />返回 {selectedDevice.name}
    </button>}
    {isDevice ? deviceRecord && <DeviceRuleEvidence key={deviceRecord.id} device={deviceRecord} rules={rules} onOpenRule={onOpenRule}/>
      : rule?.failed > 0 && rule.details.suggestion ? <RuleDetailTabs key={rule.id + (device || '')} rule={rule} evidence={evidence}/> : evidence}
  </Drawer>;
}
