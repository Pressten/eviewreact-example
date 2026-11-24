import {Icon} from '../../../assets/shared/icon.jsx';
import {reportData} from '../../mock/report.js';
import {reportSummary,rankedFailedRules} from '../../utils/report-summary.js';
import './index.css';

export default function ReportConversation({onShowReport}) {
  const summary=reportSummary(reportData),rules=rankedFailedRules(reportData.rules);
  return <aside className="report-conversation" aria-label="AI 对话区">
    <header className="report-conversation-header"><span><Icon name="arrow-left" size="1.25rem"/>检查基线要求</span><Icon name="ellipsis" size="1.25rem"/></header>
    <div className="report-conversation-scroll">
      <p className="report-user-message">检查设备是否符合基线要求，并给出检查结果。</p>
      <article className="report-ai-answer">
        <div className="report-thinking-status"><Icon name="circle-check" size="1rem"/>已完成思考<Icon name="chevron-down" size="0.75rem"/></div>
        <p>{summary.total?'已完成设备的全量基线检查。':'暂无检查数据。'}</p>
        {summary.total>0&&<p>已对 {summary.total} 台设备执行 {summary.ruleCount} 条规则检查，{summary.passed} 台通过、{summary.failed} 台不通过，本次检查合规率为 {summary.compliance}%。</p>}
        {rules.length>0?<><p>发现 {summary.failedRules} 条规则存在不通过结果，包括{rules.slice(0,3).map(rule=>rule.name).join('、')}等。</p>
          <h2>重点问题</h2><ul>{rules.slice(0,3).map(rule=><li key={rule.id}><span>{rule.name}</span><strong>{rule.failed} 台设备</strong></li>)}</ul></>:
          <p>{summary.total?'本次检查未发现不通过结果。':'完成检查后可查看报告统计。'}</p>}
        <a href="#report" className="report-conversation-artifact" onClick={event=>{event.preventDefault();onShowReport();}}>
          <img src="./assets/uploads/lui-report-file.svg" width="28" height="28" alt=""/><span><strong>配置基线检查 · 检查报告</strong><small>{summary.total} 台设备 · {summary.ruleCount} 条规则</small></span><span>预览</span>
        </a>
      </article>
    </div>
    <footer className="report-conversation-footer">
      <div className="report-composer-shortcuts"><span>配置变更</span><span>配置检查</span><span>MOP文档变更</span></div>
      <div className="report-composer-shell" aria-label="对话输入区展示"><span>输入问题或输入“/”触发提示词</span><div><small>0/2000</small><Icon name="paperclip" size="1.25rem"/><Icon name="mic" size="1.25rem"/><span className="report-composer-send"><Icon name="send" size="1rem"/></span></div></div>
      <p>内容由AI生成，无法确保准确性和完整性，仅供参考。</p>
    </footer>
  </aside>;
}
