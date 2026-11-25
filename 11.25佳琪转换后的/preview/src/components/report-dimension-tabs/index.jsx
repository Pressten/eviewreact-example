import {Tabs} from 'antd';
import './index.css';

const dimensions=[['rules','检查项维度'],['devices','设备维度']];

export default function ReportDimensionTabs({value,onChange,children}) {
  // 两个维度共用同一个内容定义。只挂载当前维度，切换时释放旧表格图表和筛选状态。
  const items = dimensions.map(([key, label]) => ({
    key,
    label,
    children: key === value ? <div className="report-dimension-panel">{children}</div> : undefined,
  }));
  return <Tabs className="report-dimension-tabs" activeKey={value} onChange={onChange}
    animated={false} destroyOnHidden items={items}/>;
}
