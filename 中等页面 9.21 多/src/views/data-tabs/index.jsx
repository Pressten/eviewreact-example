import { useState } from "react";
import { Tabs } from "antd";
import { Icon } from "../../../assets/shared/icons.js";
import MetricList from "../metric-list/index.jsx";
import RecordDetail from "../record-detail/index.jsx";
import LineageTrace from "../lineage-trace/index.jsx";
import "./index.css";

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

export default function DataTabs() {
  // 受控 activeKey：表格内链接通过 onDrill 直接改写页签，实现跨页签跳转
  const [activeKey, setActiveKey] = useState("list");
  const [metric, setMetric] = useState(null);
  const [record, setRecord] = useState(null);

  const drillToDetail = (row) => {
    setMetric(row);
    setRecord(null);
    setActiveKey("detail");
  };

  const drillToLineage = (row) => {
    setRecord(row);
    setActiveKey("lineage");
  };

  const items = [
    {
      key: "list",
      label: <TabLabel icon="list-checks" text="指标清单" count={24} />,
      children: <MetricList onDrill={drillToDetail} />,
    },
    {
      key: "detail",
      label: <TabLabel icon="table-2" text="采集明细" count={22} />,
      children: (
        <RecordDetail
          metric={metric}
          onDrill={drillToLineage}
          onBack={() => setActiveKey("list")}
        />
      ),
    },
    {
      key: "lineage",
      label: <TabLabel icon="git-branch" text="血缘溯源" count={16} />,
      children: (
        <LineageTrace metric={metric} record={record} onBack={() => setActiveKey("detail")} />
      ),
    },
  ];

  return (
    <section className="data-tabs card-surface">
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
    </section>
  );
}
