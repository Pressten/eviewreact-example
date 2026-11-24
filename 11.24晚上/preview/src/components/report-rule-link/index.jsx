import './index.css';

export default function ReportRuleLink({rule,onOpen,device,label,className=''}) {
  return <a href={'#rule-'+rule.id} aria-haspopup="dialog" className={'report-rule-link '+className}
    title={typeof label==='string'?label:rule.name} onClick={event=>{event.preventDefault();onOpen(rule,device);}}>{label||rule.name}</a>;
}
