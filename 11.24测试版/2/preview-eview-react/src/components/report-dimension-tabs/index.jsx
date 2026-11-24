import Tab, {TabItem} from '@nce/eview-react/Tab';
import './index.css';

const dimensions=[['rules','检查项维度'],['devices','设备维度']];

export default function ReportDimensionTabs({value,onChange,children}) {
  // 两个维度共用同一个内容定义。只挂载当前维度，切换时释放旧表格图表和筛选状态。
  const tabs = dimensions.map(([key, label]) => ({
    key,
    label,
    children: key === value ? <div className="report-dimension-panel">{children}</div> : null,
  }));
  return <Tab className="report-dimension-tabs" draggable={false}
    selectedIndex={tabs.findIndex(t => t.key === value)}
    onClick={(index, title, event) => { if (tabs[index]) onChange(tabs[index].key); }}>
    {(tabs || []).map(t => <TabItem key={t.key} title={t.label}>{t.children}</TabItem>)}
  </Tab>;
}
