import { useState } from 'react';
import Tab from '@nce/eview-react/Tab';
import TabItem from '@nce/eview-react/TabItem';
import Icon from '../../shared/icons.jsx';
import MetricList from '../metric-list/index.jsx';
import RecordDetail from '../record-detail/index.jsx';
import LineageTrace from '../lineage-trace/index.jsx';

// Layer 4: 页签容器 — 承载三级下钻导航（指标清单 → 采集明细 → 血缘溯源）
function TabLabel({ icon, text, count }) {
  return (
    <span className="tab-label">
      <Icon name={icon} size={14} />
      <span>{text}</span>
      <span className="tab-label__count">{count}</span>
    </span>
  );
}

function DataTabs() {
  // 受控 selectedIndex：表格内链接通过 onDrill 直接改写页签，实现跨页签跳转
  // eview-react Tab/TabItem：children 驱动，切换回调 onClick(index,title,event)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [metric, setMetric] = useState(null);
  const [record, setRecord] = useState(null);

  const drillToDetail = (row) => {
    setMetric(row);
    setRecord(null);
    setSelectedIndex(1);
  };

  const drillToLineage = (row) => {
    setRecord(row);
    setSelectedIndex(2);
  };

  return (
    <section className="data-tabs card-surface">
      <Tab
        selectedIndex={selectedIndex}
        onClick={(index) => setSelectedIndex(index)}
        draggable={false}
      >
        <TabItem title={<TabLabel icon="list-checks" text="指标清单" count={24} />}>
          <MetricList onDrill={drillToDetail} />
        </TabItem>
        <TabItem title={<TabLabel icon="table-2" text="采集明细" count={22} />}>
          <RecordDetail
            metric={metric}
            onDrill={drillToLineage}
            onBack={() => setSelectedIndex(0)}
          />
        </TabItem>
        <TabItem title={<TabLabel icon="git-branch" text="血缘溯源" count={16} />}>
          <LineageTrace metric={metric} record={record} onBack={() => setSelectedIndex(1)} />
        </TabItem>
      </Tab>
    </section>
  );
}

export default DataTabs;
