import { Tabs } from "antd";
import { useApp } from "../../context.jsx";
import TaskTable from "../task-table/index.jsx";
import RecordTable from "../record-table/index.jsx";
import DetailPanel from "../detail-panel/index.jsx";
import "./index.css";

// Layer 4: 页签容器 — 同一上下文下三个同级视图切换
export default function DataTabs() {
  const { activeTab, setActiveTab } = useApp();

  const items = [
    { key: "task", label: "任务清单", children: <TaskTable /> },
    { key: "record", label: "执行记录", children: <RecordTable /> },
    { key: "detail", label: "链路详情", children: <DetailPanel /> },
  ];

  return (
    <div className="content-card">
      <Tabs
        className="data-tabs"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </div>
  );
}
