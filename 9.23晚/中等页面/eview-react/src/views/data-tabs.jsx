import { useState } from "react";
import Tab from "@nce/eview-react/Tab";
import TabItem from "@nce/eview-react/TabItem";
import { Icon } from "../shared/icon.jsx";
import MetricList from "./metric-list.jsx";
import RecordDetail from "./record-detail.jsx";
import LineageTrace from "./lineage-trace.jsx";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [metric, setMetric] = useState(null);
  const [record, setRecord] = useState(null);

  const drillToDetail = (row) => {
    setMetric(row);
    setRecord(null);
    setActiveIndex(1);
  };

  const drillToLineage = (row) => {
    setRecord(row);
    setActiveIndex(2);
  };

  return (
    <section className="data-tabs card-surface">
      <Tab
        activeItem={activeIndex}
        onClick={(index) => setActiveIndex(index)}
        draggable={false}
      >
        <TabItem title={<TabLabel icon="list-checks" text="指标清单" count={24} />}>
          <MetricList onDrill={drillToDetail} />
        </TabItem>
        <TabItem title={<TabLabel icon="table-2" text="采集明细" count={22} />}>
          <RecordDetail
            metric={metric}
            onDrill={drillToLineage}
            onBack={() => setActiveIndex(0)}
          />
        </TabItem>
        <TabItem title={<TabLabel icon="git-branch" text="血缘溯源" count={16} />}>
          <LineageTrace metric={metric} record={record} onBack={() => setActiveIndex(1)} />
        </TabItem>
      </Tab>
    </section>
  );
}

export default DataTabs;
