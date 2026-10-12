import Tab from "@nce/eview-react/Tab";
import TabItem from "@nce/eview-react/TabItem";
import { useApp } from "../../context.jsx";
import TaskTable from "../task-table/index.jsx";
import RecordTable from "../record-table/index.jsx";
import DetailPanel from "../detail-panel/index.jsx";
import "./index.css";

const TAB_KEYS = ["task", "record", "detail"];

// Layer 4: 页签容器 — 同一上下文下三个同级视图切换
export default function DataTabs() {
  const { activeTab, setActiveTab } = useApp();

  const activeIndex = Math.max(0, TAB_KEYS.indexOf(activeTab));

  return (
    <div className="content-card">
      <Tab
        className="data-tabs"
        selectedIndex={activeIndex}
        draggable={false}
        onClick={(index) => setActiveTab(TAB_KEYS[index])}
      >
        <TabItem title="任务清单">
          <TaskTable />
        </TabItem>
        <TabItem title="执行记录">
          <RecordTable />
        </TabItem>
        <TabItem title="链路详情">
          <DetailPanel />
        </TabItem>
      </Tab>
    </div>
  );
}
