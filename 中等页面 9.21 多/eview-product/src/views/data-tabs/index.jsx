import { useState } from 'react';
import Tab, { TabItem } from '@nce/eview-react/Tab';
// TODO_CONTRACT: 下列 icon-plus 组件名按 lucide keyword 推断，需用 icon-plus 的 getIconInfo('list-checks'/'table-2'/'git-branch') 核对真实导出名
import {
  IconPlusIcPublicListChecks,
  IconPlusIcPublicTable,
  IconPlusIcPublicGitBranch
} from '@nce/icon-plus';
import { metricList, recordList, lineageList } from '../../data.js';
import MetricList from '../metric-list';
import RecordDetail from '../record-detail';
import LineageTrace from '../lineage-trace';
import './index.css';

const TAB_KEYS = ['list', 'detail', 'lineage'];

const TABS = [
  {
    key: 'list',
    title: '指标清单',
    icon: <IconPlusIcPublicListChecks iconSize={14} />,
    count: metricList.length
  },
  {
    key: 'detail',
    title: '采集明细',
    icon: <IconPlusIcPublicTable iconSize={14} />,
    count: recordList.length
  },
  {
    key: 'lineage',
    title: '血缘溯源',
    icon: <IconPlusIcPublicGitBranch iconSize={14} />,
    count: lineageList.length
  }
];

export default function DataTabs() {
  const [activeKey, setActiveKey] = useState('list');
  const [metric, setMetric] = useState(null);
  const [record, setRecord] = useState(null);

  const activeIndex = TAB_KEYS.indexOf(activeKey);

  const handleTabClick = (index) => {
    setActiveKey(TAB_KEYS[index] ?? 'list');
  };

  const handleDrillToDetail = (row) => {
    setMetric(row);
    setRecord(null);
    setActiveKey('detail');
  };

  const handleDrillToLineage = (row) => {
    setRecord(row);
    setActiveKey('lineage');
  };

  const handleBackToList = () => setActiveKey('list');
  const handleBackToDetail = () => setActiveKey('detail');

  return (
    <section className="data-tabs card-surface">
      <Tab selectedIndex={activeIndex} draggable={false} onClick={handleTabClick}>
        {TABS.map((tab) => (
          <TabItem
            key={tab.key}
            title={tab.title}
            icon={tab.icon}
            titleExtraContent={<span className="tab-label__count">{tab.count}</span>}
          >
            {tab.key === 'list' && <MetricList onDrill={handleDrillToDetail} />}
            {tab.key === 'detail' && (
              <RecordDetail
                metric={metric}
                onDrill={handleDrillToLineage}
                onBack={handleBackToList}
              />
            )}
            {tab.key === 'lineage' && (
              <LineageTrace
                metric={metric}
                record={record}
                onBack={handleBackToDetail}
              />
            )}
          </TabItem>
        ))}
      </Tab>
    </section>
  );
}
