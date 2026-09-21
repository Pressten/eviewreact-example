// data-tabs.jsx — Layer 4: 页签容器（承载三级下钻导航：指标清单 → 采集明细 → 血缘溯源）
// antd Tabs(activeKey/onChange/items) → eview-react Tab(selectedIndex/onClick/children TabItem)
// antd 用字符串 key 受控，eview-react 用下标受控，这里在 activeKey 与 selectedIndex 间转换
import { useState } from 'react';
import Tab, { TabItem } from '@nce/eview-react/Tab';
import AppIcon from './app-icon.jsx';
import MetricList from './metric-list.jsx';
import RecordDetail from './record-detail.jsx';
import LineageTrace from './lineage-trace.jsx';

const TAB_KEYS = ['list', 'detail', 'lineage'];

function TabLabel({ icon, text, count }) {
  return (
    <span className="tab-label">
      <AppIcon name={icon} size={14} />
      <span>{text}</span>
      <span className="tab-label__count">{count}</span>
    </span>
  );
}

function DataTabs() {
  // 受控 activeKey：表格内链接通过 onDrill 直接改写页签，实现跨页签跳转
  const [activeKey, setActiveKey] = useState('list');
  const [metric, setMetric] = useState(null);
  const [record, setRecord] = useState(null);

  const selectedIndex = Math.max(0, TAB_KEYS.indexOf(activeKey));

  const drillToDetail = (row) => {
    setMetric(row);
    setRecord(null);
    setActiveKey('detail');
  };

  const drillToLineage = (row) => {
    setRecord(row);
    setActiveKey('lineage');
  };

  return (
    <section className="data-tabs card-surface">
      <Tab
        selectedIndex={selectedIndex}
        draggable={false}
        onClick={(index) => setActiveKey(TAB_KEYS[index] || 'list')}
      >
        <TabItem title={<TabLabel icon="list-checks" text="指标清单" count={24} />}>
          <MetricList onDrill={drillToDetail} />
        </TabItem>
        <TabItem title={<TabLabel icon="table-2" text="采集明细" count={22} />}>
          <RecordDetail
            metric={metric}
            onDrill={drillToLineage}
            onBack={() => setActiveKey('list')}
          />
        </TabItem>
        <TabItem title={<TabLabel icon="git-branch" text="血缘溯源" count={16} />}>
          <LineageTrace
            metric={metric}
            record={record}
            onBack={() => setActiveKey('detail')}
          />
        </TabItem>
      </Tab>
    </section>
  );
}

export default DataTabs;
