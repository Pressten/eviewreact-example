import {useEffect,useRef,useState} from 'react';
import {Icon} from '../../../assets/shared/icon.jsx';
import {reportData} from '../../mock/report.js';
import {deviceResults,rankedFailedDevices,reportConclusion,reportSummary,rankedFailedRules,resultCounts} from '../../utils/report-summary.js';
import {downloadReport} from '../../utils/report-export.js';
import ComplianceSummary from '../../components/compliance-summary/index.jsx';
import ReportOverview from '../../components/report-overview/index.jsx';
import InspectionResults from '../../components/inspection-results/index.jsx';
import ReportDetailDrawer from '../../components/report-detail-drawer/index.jsx';
import ReportDimensionTabs from '../../components/report-dimension-tabs/index.jsx';
import './index.css';

const displayTime=value=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
// 毫秒，从页面挂载开始计时，依次揭示概览、TOP 5 和明细。报告数据在本地，这段时间只用于入场动效。
const revealDelays = [150, 300, 460];

function ReportReveal({ready, children}) {
  // 保留子内容占位，避免骨架切换时跳动。切换维度后直接挂载已揭示内容，不重播入场。
  const startedAsSkeleton = useRef(!ready);
  return <div className={ready ? 'report-reveal-content' : 'report-reveal-skeleton'}
    data-reveal-animate={ready && startedAsSkeleton.current ? '' : undefined} aria-hidden={ready ? undefined : true}>
    {children}
  </div>;
}

export default function ReportPage() {
  const [revealStage, setRevealStage] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? revealDelays.length : 0
  );
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = revealDelays.map((delay, index) => window.setTimeout(() => setRevealStage(index + 1), delay));
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, []);

  const [dimension,setDimension]=useState(()=>new URLSearchParams(window.location.search).get('dimension')==='devices'?'devices':'rules');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const exportReport = async () => {
    setExporting(true); setExportError('');
    // 从完整报告导出，表格上的筛选、搜索和分页只影响当前显示。
    try { await downloadReport(reportData); }
    catch (error) { setExportError(error.message || '导出失败，请重试'); }
    finally { setExporting(false); }
  };
  const [selection, setSelection] = useState(null);
  const [relatedSelection, setRelatedSelection] = useState(null);
  const checkedDevices = deviceResults(reportData.devices);
  const openDetail = (entry, setter) => {
    const deviceRecord = entry.type === 'device' ? checkedDevices.find(item => item.id === entry.device.id) : undefined;
    if (entry.type === 'device' && !deviceRecord) return;
    setter({...entry, deviceRecord, open: true});
  };
  const openPrimaryDetail = entry => {
    setRelatedSelection(null);
    openDetail(entry, setSelection);
  };
  const showRule = rule => openPrimaryDetail({type: 'rule', rule});
  const showDevice = device => openPrimaryDetail({type: 'device', device});
  const summary=reportSummary(reportData),isDevices=dimension==='devices';
  const items=isDevices?checkedDevices:reportData.rules;
  const ranked=isDevices?rankedFailedDevices(reportData.devices):rankedFailedRules(reportData.rules),counts=resultCounts(items,dimension);
  return <main className="inspection-report-page" data-dimension={dimension} aria-busy={revealStage < revealDelays.length}>
    <header className="inspection-report-header">
      <div className="inspection-report-heading">
        <div className="inspection-report-title"><img src="./assets/uploads/lui-report-file.svg" width="16" height="16" alt=""/><h1>配置基线检查报告</h1></div>
        {reportData.execution&&<p className="inspection-report-time" aria-label="执行时间，北京时间">
          <span>执行时间：</span><time dateTime={reportData.execution.startedAt}>{displayTime(reportData.execution.startedAt)}</time>
          <span aria-hidden="true">—</span><time dateTime={reportData.execution.completedAt}>{displayTime(reportData.execution.completedAt)}</time>
        </p>}
        <button type="button" className="report-export-action" aria-label="导出报告" aria-busy={exporting}
          title={summary.total ? '导出完整报告（Excel）' : '暂无可导出的报告'} disabled={exporting || !summary.total} onClick={exportReport}>
          <Icon name="download" size="1.25rem"/>
          <span>报告导出</span>
        </button>
      </div>
      {exportError && <p className="report-export-error" role="alert">{exportError}</p>}
    </header>
    <ReportReveal ready={revealStage >= 1}>
      <ComplianceSummary summary={summary} comparison={reportData.comparison} conclusion={reportConclusion(summary, reportData.rules)}/>
    </ReportReveal>
    <ReportDimensionTabs value={dimension} onChange={setDimension}>
      <ReportReveal ready={revealStage >= 2}>
        <ReportOverview items={ranked} total={counts.total} dimension={dimension} rules={reportData.rules} unknown={counts.unknown} onOpenRule={showRule} onOpenDevice={showDevice}/>
      </ReportReveal>
      <ReportReveal ready={revealStage >= 3}>
        <InspectionResults items={items} counts={counts} dimension={dimension} onOpenRule={showRule} onOpenDevice={showDevice}/>
      </ReportReveal>
    </ReportDimensionTabs>
    <ReportDetailDrawer selection={selection} relatedSelection={relatedSelection}
      devices={reportData.devices} rules={reportData.rules} checkedAt={reportData.checkedAt}
      onOpenRelated={entry => openDetail(entry, setRelatedSelection)}
      onClose={() => setSelection(current => ({...current, open: false}))}
      onCloseRelated={() => setRelatedSelection(current => ({...current, open: false}))}/>
  </main>;
}
