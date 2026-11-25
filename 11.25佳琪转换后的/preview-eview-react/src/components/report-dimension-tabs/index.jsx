import {Tab, TabItem} from '@nce/eview-react/Tab';
import './index.css';

const dimensions=[['rules','检查项维度'],['devices','设备维度']];

export default function ReportDimensionTabs({value,onChange,children}) {
  // 两个维度共用同一个内容定义。只挂载当前维度，切换时释放旧表格图表和筛选状态。
  return <Tab className="report-dimension-tabs" draggable={false}
    selectedIndex={dimensions.findIndex(([key])=>key===value)}
    onClick={(index)=>onChange(dimensions[index][0])}>
    {dimensions.map(([key,label])=><TabItem key={key} title={label}>{key===value?<div className="report-dimension-panel">{children}</div>:''}</TabItem>)}
  </Tab>;
}
