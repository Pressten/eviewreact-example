import {Empty} from 'antd';
import {ruleSeverities} from '../../utils/rule-severity.js';
import SegmentedComplianceGauge from '../segmented-compliance-gauge/index.jsx';
import ReportMetric from '../report-metric/index.jsx';
import ReportStatusIcon from '../report-status-icon/index.jsx';
import './index.css';

export default function ComplianceSummary({summary,comparison,conclusion}) {
  return <section className="compliance-section" aria-labelledby="compliance-title">
    <div className="report-summary">
      <h2 id="compliance-title" className="report-summary-title">检查概览</h2>
      <div className="report-summary-body">
        {summary.total>0?<SegmentedComplianceGauge summary={summary} comparison={comparison}/>:<div className="report-gauge-empty"><Empty description="暂无合规率数据"/></div>}
        <div className="report-summary-counts">
          <dl className="report-outcome-counts">
            <ReportMetric label={<><ReportStatusIcon/>通过设备</>} value={summary.passed} unit="台"/>
            <ReportMetric label={<><ReportStatusIcon failed/>不通过设备</>} value={summary.failed} unit="台" color={summary.failed?'var(--error)':'var(--on-surface-variant)'}/>
          </dl>
          <dl className="report-total-counts">
            <ReportMetric label="已检查设备" value={summary.total} unit="台"/>
            <ReportMetric label="检查项" value={summary.ruleCount} unit="项"/>
          </dl>
        </div>
        {conclusion&&<div className="report-brief">
          <h3><img src="./assets/uploads/report-ai-sparkle.svg" width="20" height="20" alt=""/>检查概要</h3>
          <p>{conclusion}<span className="report-ai-recommendation"> 优先核验{ruleSeverities.high.label}违规项，结合变更记录确认后修复。</span></p>
        </div>}
      </div>
    </div>
  </section>;
}
