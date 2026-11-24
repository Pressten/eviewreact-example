import {useMemo, useRef, useState} from 'react';
import { IconPlusIcPublicSearch } from '@hui/icon-plus';
import Empty from '@nce/eview-react/Empty';
import TextField from '@/shared/TextField';
import {ruleDeviceRows} from '../../utils/report-summary.js';
import {ruleSeverities} from '../../utils/rule-severity.js';
import OptionGroup from '../option-group/index.jsx';
import ReportDeviceLink from '../report-device-link/index.jsx';
import StatusMark from '../status-mark/index.jsx';
import TimeoutScale from './timeout-scale.jsx';
import './index.css';

const checkedTime = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

export function inspectionTime(checkedAt) {
  const time = new Date(checkedAt || NaN);
  return Number.isFinite(time.getTime()) && <time dateTime={time.toISOString()}>{checkedTime.format(time)}</time>;
}

export function InspectionHeader({name, icon, badge, metadata}) {
  return <div className="rule-inspection-overview">
    <span className="rule-inspection-icon">{icon}</span>
    <div>
      <div className="rule-inspection-title">
        <h2>{name}</h2>
        {badge}
      </div>
      <dl className="rule-inspection-metadata">
        {metadata.filter(([, value]) => value).map(([label, value]) =>
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
    </div>
  </div>;
}

export function ReportRuleHeader({rule, checkedAt}) {
  const severity = ruleSeverities[rule.priority];
  return <InspectionHeader name={rule.name} icon={<img src="/uploads/uc2-rule-detail/rule-overview.svg" alt=""/>}
    badge={severity && <span className="rule-inspection-priority" style={{'--priority-color': severity.color}}>
      <i aria-hidden="true"/>{severity.label}
    </span>}
    metadata={[[ '检查时间', inspectionTime(checkedAt) ], [ '规则编号', rule.id ],
      [ '适用设备', rule.total + ' 台' ], [ '不通过设备', rule.failed + ' 台' ]]}/>;
}

function sshCommand(excerpt) {
  return excerpt?.match(/^ssh server (cipher|hmac)\s+(.+)$/);
}

function locationName({context, line, excerpt}) {
  const vty = context?.match(/^user-interface vty (\d+) (\d+)$/i);
  if (vty) return 'VTY ' + vty[1] + '–' + vty[2];
  const consoleView = context?.match(/^user-interface console (\d+)$/i);
  if (consoleView) return 'Console ' + consoleView[1];
  const ssh = sshCommand(excerpt);
  if (ssh) return ssh[1] === 'cipher' ? 'Cipher 加密算法' : 'HMAC 完整性校验';
  return context || (line ? '第 ' + line + ' 行' : '配置片段');
}

function duration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return (minutes ? minutes + '分钟' : '') + (remainder || !minutes ? remainder + '秒' : '');
}

function timeoutComparison(rule, finding) {
  if (rule.id !== 'timeout') return null;
  const limit = rule.expected?.match(/(?:≤|<=)\s*(\d+)\s*分钟/);
  const current = finding.excerpt?.match(/^idle-timeout\s+(\d+)(?:\s+(\d+))?$/);
  if (!limit || !current) return null;
  const maximum = Number(limit[1]) * 60;
  const actual = Number(current[1]) * 60 + Number(current[2] || 0);
  // 只有命中片段和规则上限可解析，且数值确实超限时才做数量对比。
  return actual > maximum ? {maximum, actual, note: '超出' + duration(actual - maximum)} : null;
}

function ImpactAnalysis({rule, failed, findings, activeFinding}) {
  if (!rule.failed) return null;
  const current = !failed ? '当前设备通过本项检查。' : findings.length ?
    '当前设备记录了 ' + findings.length + ' 处不通过配置。' : '当前设备的本项检查不通过。';
  const timeout = activeFinding && timeoutComparison(rule, activeFinding);
  return <section className="rule-inspection-impact" aria-label="影响分析">
    <h4>影响分析</h4>
    <p><strong>{rule.failed} / {rule.total} 台</strong>设备不通过。{current}
      {timeout && <span>{locationName(activeFinding)} 的空闲会话自动断开时间比规则上限晚 {duration(timeout.actual - timeout.maximum)}。</span>}
    </p>
  </section>;
}

function FindingComparison({rule, finding}) {
  const ssh = rule.id === 'ssh' && sshCommand(finding.excerpt);
  if (ssh) return <section className="rule-inspection-judgment" aria-label="判定说明">
    <h4>判定说明</h4>
    <p>{locationName(finding)}命中不通过配置，当前值为 <code>{ssh[2]}</code>。</p>
  </section>;
  const timeout = timeoutComparison(rule, finding);
  return <section className="rule-inspection-comparison" aria-label="规则要求与设备实际">
    <dl>
      <div><dt>{timeout ? '规则上限' : '规则要求'}</dt><dd>{timeout ? '≤' + duration(timeout.maximum) : rule.expected}</dd></div>
      <div><dt>设备实际</dt><dd className="rule-inspection-failure">{timeout ? duration(timeout.actual) : finding.excerpt}</dd></div>
      <div><dt>判定说明</dt><dd className="rule-inspection-failure">{timeout?.note || '不通过'}</dd></div>
    </dl>
    {timeout && <TimeoutScale maximum={timeout.maximum} actual={timeout.actual}
      maximumLabel={duration(timeout.maximum) + '上限'} actualLabel={duration(timeout.actual)}/>}
  </section>;
}

function ConfigurationEvidence({rule, findings, activeIndex}) {
  const [showAll, setShowAll] = useState(false);
  const entries = showAll ? findings : [findings[activeIndex]];
  return <section className="rule-inspection-commands" aria-label="命令行配置证据">
    <header>
      <h4>命令行</h4>
      {findings.length > 1 && <button type="button" className="rule-inspection-link" aria-expanded={showAll}
        onClick={() => setShowAll(current => !current)}>{showAll ? '仅看当前片段' : '查看全部片段'}</button>}
    </header>
    <div className="rule-inspection-code">
      {entries.map((finding, index) => <div key={(showAll ? index : activeIndex)} className="rule-inspection-snippet">
        {finding.context && <div className="rule-inspection-code-row"><span/><code>{finding.context}</code></div>}
        <div className="rule-inspection-code-row rule-inspection-code-hit">
          <span aria-label={finding.line ? '第 ' + finding.line + ' 行' : undefined}>{finding.line}</span>
          <code>{finding.excerpt}</code>
          <span className="rule-inspection-code-note">{timeoutComparison(rule, finding)?.note}</span>
        </div>
      </div>)}
    </div>
  </section>;
}

export function RuleEvidence({rule, status, findings, showStatus = true, action}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const failed = status === 'failed';
  return <>
    <div className="rule-inspection-criterion">
      <h4>{rule.name}</h4>
      {showStatus && <StatusMark failed={failed}>{failed ? '不通过' : '通过'}</StatusMark>}
      {action}
      <p>规则：{rule.expected}</p>
    </div>
    {rule.details?.description && <details className="rule-inspection-scope">
      <summary>检查范围与判定说明</summary>
      <p>{rule.details.description}</p>
    </details>}
    <ImpactAnalysis rule={rule} failed={failed} findings={findings} activeFinding={findings[activeIndex]}/>
    {findings.length > 0 ? <>
      <div className="rule-inspection-findings" role="group" aria-label="配置核验片段">
        {findings.map((finding, index) => {
          const selected = index === activeIndex;
          const timeoutValue = timeoutComparison(rule, finding) && finding.excerpt.split(/\s+/).slice(1).join(' ');
          const sshValue = sshCommand(finding.excerpt)?.[2];
          return <button type="button" key={index} aria-pressed={selected} onClick={() => setActiveIndex(index)}>
            <span><i aria-hidden="true"/>{locationName(finding)}</span>
            <code>{timeoutValue || sshValue || finding.excerpt}</code>
          </button>;
        })}
      </div>
      <FindingComparison rule={rule} finding={findings[activeIndex]}/>
      <ConfigurationEvidence rule={rule} findings={findings} activeIndex={activeIndex}/>
    </> : <p className="rule-inspection-note">{failed ? '本次检查暂无配置片段。' : '本次报告仅记录不通过的命中片段。'}</p>}
    {failed && rule.details?.suggestion && <section className="rule-inspection-remediation">
      <h4>修复建议</h4>
      <p>{rule.details.suggestion}</p>
    </section>}
  </>;
}

function DeviceEvidence({device, rule, onOpenDevice}) {
  const identity = [device.managementIp, device.vendor, device.model].filter(Boolean).join(' · ');
  return <article className="rule-inspection-evidence" aria-label="配置核验证据">
    <header className="rule-inspection-device-heading">
      <div>
        <h3>{device.name}</h3>
        {identity && <p>{identity}</p>}
      </div>
      {onOpenDevice && <ReportDeviceLink device={device} onOpen={onOpenDevice} label="查看设备详情"/>}
    </header>
    <RuleEvidence rule={rule} status={device.status} findings={device.findings}/>
  </article>;
}

export default function ReportRuleDetail({rule, devices, initialDevice, onOpenDevice}) {
  const [status, setStatus] = useState(initialDevice || !rule.failed ? 'all' : 'failed');
  const [query, setQuery] = useState(initialDevice || '');
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);
  const rows = useMemo(() => {
    const byId = new Map(devices.map(device => [device.id, device]));
    return ruleDeviceRows(rule, devices).map(row => ({...byId.get(row.id), ...row}))
      .sort((left, right) => Number(left.status === 'passed') - Number(right.status === 'passed'));
  }, [rule, devices]);
  const term = query.trim().toLowerCase();
  const visible = rows.filter(device => (status === 'all' || status === device.status) &&
    (!term || [device.name, device.managementIp].some(value => value?.toLowerCase().includes(term)) ||
      device.findings.some(({context, excerpt}) => [context, excerpt].join(' ').toLowerCase().includes(term))));
  const selected = visible.find(device => device.id === selectedId) ||
    visible.find(device => device.name === initialDevice) || visible[0];
  const resetSelection = () => {
    setSelectedId(null);
    if (listRef.current) listRef.current.scrollTop = 0;
  };
  return <div className="report-rule-inspection">
    <div className="rule-inspection-columns">
      <aside className="rule-inspection-devices" aria-labelledby="rule-inspection-devices-title">
        <h3 id="rule-inspection-devices-title">设备配置核验</h3>
        <OptionGroup compact ariaLabel="规则关联设备状态" value={status}
          options={[[ 'all', '全部', rule.total ], [ 'failed', '不通过', rule.failed ], [ 'passed', '通过', rule.passed ]]}
          onChange={next => {setStatus(next); resetSelection();}}/>
        <TextField aria-label="搜索规则关联设备" placeholder="搜索设备名称 / IP"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />} value={query}
          onChange={(value, oldValue, event) => {setQuery(value); resetSelection();}}/>
        <div className="rule-inspection-device-list" ref={listRef}>
          {visible.map(device => <button type="button" className="rule-inspection-device"
            data-status={device.status} key={device.id} aria-pressed={selected?.id === device.id}
            onClick={() => setSelectedId(device.id)}>
            <i aria-hidden="true"/>
            <span><strong>{device.name}</strong><small>
              {[device.managementIp, device.status === 'failed' ? '不通过' : '通过'].filter(Boolean).join(' · ')}
            </small></span>
          </button>)}
          {!visible.length && <Empty type="success" description="没有匹配的设备"/>}
        </div>
      </aside>
      {selected ? <DeviceEvidence key={selected.id} device={selected} rule={rule} onOpenDevice={onOpenDevice}/>
        : <div className="rule-inspection-empty"><Empty type="success" description="调整筛选后查看核验结果"/></div>}
    </div>
  </div>;
}
