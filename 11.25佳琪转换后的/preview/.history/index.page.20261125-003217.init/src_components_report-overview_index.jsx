import {Empty} from 'antd';
import {Icon} from '../../../public/shared/icon.jsx';
import {devicePriorityCounts,overviewEmptyState} from '../../utils/report-summary.js';
import {ruleSeverities} from '../../constants/rule-severity.js';
import ReportRuleLink from '../report-rule-link/index.jsx';
import ReportDeviceLink from '../report-device-link/index.jsx';
import './index.css';

const limit=5;

export default function ReportOverview({items,total,dimension,rules=[],unknown=0,onOpenRule,onOpenDevice}) {
  const top=items.slice(0,limit),isDevices=dimension==='devices',unit=isDevices?'项':'台';
  const empty=overviewEmptyState(total,dimension,unknown);
  return <section className="rule-overview" data-dimension={dimension} aria-labelledby="rule-overview-title">
    <div className="report-section-heading report-overview-heading"><h2 id="rule-overview-title">TOP 5 {isDevices?'影响设备':'影响检查项'}</h2></div>
    {top.length>0?<ol className="rule-overview-grid" id="report-top-list">
      {top.map((item,index)=>{
        const levels=isDevices?devicePriorityCounts(item,rules):null;
        const severity=ruleSeverities[item.priority];
        const title=<><span>{index+1}.{item.name}</span><Icon name="chevron-right" size="1rem"/></>;
        return <li className="rule-overview-item" key={item.id}>
          <header>
            <h3>{isDevices?<ReportDeviceLink device={item} label={title} onOpen={onOpenDevice}/>:<ReportRuleLink rule={item} label={title} onOpen={onOpenRule}/>}</h3>
            {isDevices?<p className="report-device-metadata">
              <span className="report-device-model"><Icon name="server" size="0.875rem"/>{item.model}</span>
              <span><i className="report-address-icon" aria-hidden="true"/>{item.managementIp}</span>
            </p>:severity&&<p className="report-overview-priority" style={{'--rule-priority-color':severity.color}}><i aria-hidden="true"/>{severity.label}</p>}
          </header>
          <p className="report-overview-impact"><strong>{item.failed}</strong><span>{isDevices?'项检查不通过':'台受影响设备'}</span></p>
          <dl className="report-overview-details">
            {isDevices&&<div><dt>违规等级分布</dt><dd className="report-device-priorities">
              {Object.entries(ruleSeverities).map(([level,spec])=><span key={level} data-zero={levels[level]===0?'true':undefined} style={{'--rule-priority-color':spec.color}} title={spec.label+' '+levels[level]+' 项'} aria-label={spec.label+' '+levels[level]+' 项'}><i aria-hidden="true"/>{levels[level]}</span>)}
            </dd></div>}
            <div><dt>{isDevices?'通过检查':'通过设备'}</dt><dd>{item.passed} {unit}</dd></div>
          </dl>
        </li>;
      })}
      {Array.from({length:limit-top.length},(_,index)=><li key={'empty-'+index} className="rule-overview-item report-overview-placeholder" aria-hidden="true"><Empty description={false}/></li>)}
    </ol>:<div className="report-overview-empty" role="status" aria-label={empty.description}><Empty description={empty.title}/></div>}
  </section>;
}
