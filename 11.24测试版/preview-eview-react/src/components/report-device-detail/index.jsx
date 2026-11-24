import {useMemo, useRef, useState} from 'react';
import { IconPlusIcPublicSearch } from '@hui/icon-plus';
import Empty from '@nce/eview-react/Empty';
import TextField from '@/shared/TextField';
import {ruleSeverities} from '../../utils/rule-severity.js';
import OptionGroup from '../option-group/index.jsx';
import {InspectionHeader, inspectionTime, RuleEvidence} from '../report-rule-detail/index.jsx';
import ReportRuleLink from '../report-rule-link/index.jsx';
import StatusMark from '../status-mark/index.jsx';
import './index.css';

const priorityOrder = {high: 0, medium: 1, low: 2};
const deviceRuleOrder = {ssh: 0, timeout: 1, mgmt: 2, ntp2: 3};

export function ReportDeviceHeader({device, checkedAt}) {
  const failed = device.status === 'failed';
  const unknown = device.status === 'unknown';
  return <InspectionHeader name={device.name} icon={<img src="/uploads/detail-device.svg" alt=""/>}
    badge={<StatusMark failed={failed} unknown={unknown}>{unknown ? '无检查结果' : failed ? '不通过' : '通过'}</StatusMark>}
    metadata={[[ '设备IP', device.managementIp ], [ '厂商', device.vendor ], [ '型号', device.model ], [ '区域', device.region ],
      [ '检查时间', inspectionTime(device.checkedAt ?? checkedAt) ]]}/>;
}

export default function ReportDeviceDetail({device, rules, initialRuleId, onOpenRule}) {
  const [status, setStatus] = useState(device.failed && (!initialRuleId || device.failedRuleIds.includes(initialRuleId)) ? 'failed' : 'all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialRuleId);
  const listRef = useRef(null);
  const rows = useMemo(() => rules.filter(rule => device.checkedRuleIds.includes(rule.id)).map(rule => {
    const failed = device.failedRuleIds.includes(rule.id);
    return {rule, failed, findings: failed ? rule.details?.findings?.[device.id] || [] : []};
  }).sort((left, right) => Number(right.failed) - Number(left.failed) ||
    (priorityOrder[left.rule.priority] ?? 3) - (priorityOrder[right.rule.priority] ?? 3) ||
    (deviceRuleOrder[left.rule.id] ?? 4) - (deviceRuleOrder[right.rule.id] ?? 4)), [rules, device]);
  const term = query.trim().toLowerCase();
  const visible = rows.filter(({rule, failed, findings}) =>
    (status === 'all' || (status === 'failed' ? failed : !failed)) &&
    (!term || [rule.name, rule.expected].some(value => value?.toLowerCase().includes(term)) ||
      findings.some(({context, excerpt}) => [context, excerpt].join(' ').toLowerCase().includes(term))));
  const selected = visible.find(({rule}) => rule.id === selectedId) || visible[0];
  const scrollListToTop = () => {
    if (listRef.current) listRef.current.scrollTop = 0;
  };
  return <div className="report-rule-inspection report-device-inspection">
    <div className="rule-inspection-columns">
      <aside className="rule-inspection-devices" aria-label="规则检查结果">
        <h3>规则检查结果</h3>
        <OptionGroup compact ariaLabel="设备关联规则状态" value={status}
          options={[[ 'all', '全部', device.total ], [ 'failed', '不通过', device.failed ], [ 'passed', '通过', device.passed ]]}
          onChange={next => {setStatus(next); scrollListToTop();}}/>
        <TextField aria-label="搜索设备关联规则" placeholder="请输入规则名称"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />} value={query}
          onChange={(value, oldValue, event) => {setQuery(value); scrollListToTop();}}/>
        <div className="rule-inspection-device-list" ref={listRef}>
          {visible.map(({rule, failed, findings}) => <button type="button"
            className="rule-inspection-device device-inspection-rule" key={rule.id}
            data-status={failed ? 'failed' : 'passed'} aria-label={'查看规则：' + rule.name}
            aria-pressed={selected?.rule.id === rule.id} onClick={() => setSelectedId(rule.id)}>
            <i aria-hidden="true"/>
            <span><strong>{rule.name}</strong><small>
              {[ruleSeverities[rule.priority]?.label, failed && findings.length ? findings.length + ' 处不通过' :
                failed ? '不通过' : '通过'].filter(Boolean).join(' · ')}
            </small></span>
          </button>)}
          {!visible.length && <Empty type="success" description="没有匹配的规则"/>}
        </div>
      </aside>
      {selected ? <article key={selected.rule.id} className="rule-inspection-evidence" aria-label="配置核验证据">
        <RuleEvidence rule={selected.rule} status={selected.failed ? 'failed' : 'passed'} findings={selected.findings} showStatus={false}
          action={onOpenRule && <ReportRuleLink className="device-inspection-rule-link" rule={selected.rule} device={device.name}
            onOpen={onOpenRule} label="查看检查项详情"/>}/>
      </article> : <div className="rule-inspection-empty">
        <Empty type="success" description="调整筛选后查看核验结果"/>
      </div>}
    </div>
  </div>;
}
