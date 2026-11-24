import './index.css';

// 放在 report-metric-grid 定义列表中，统一数值、单位与标签的层级。
export default function ReportMetric({label,value,unit,color='var(--on-surface)'}) {
  return <div className="report-metric" style={{'--report-metric-color':color}}>
    <dt>{label}</dt><dd><strong>{value}</strong>{unit&&<span>{unit}</span>}</dd>
  </div>;
}
