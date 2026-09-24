import Crumbs from "@nce/eview-react/Crumbs";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./components/header-bar/index.jsx";
import DeviceTable from "./views/device-table/index.jsx";
import AlarmList from "./views/alarm-list/index.jsx";
import ConfigPanel from "./views/config-panel/index.jsx";
import "./app.css";

// App entry — ICT React page (antd → @nce/eview-react)
// ConfigProvider + IntlProvider 已在 main.jsx 组装;此处只负责 AppProvider + 布局装配。
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx
//   Layer 2 mock data     → src/mock/
//   Layer 3 reusable      → src/components/{name}/
//   Layer 4 views         → src/views/{name}/
//   Layer 5 layout        → src/app.jsx

// 页签 key ↔ 下标互转(eview-react Tab 用 selectedIndex/onClick(index))
const TAB_KEYS = ["device", "alarm", "config"];

function PageContent() {
  const { activeTab, setActiveTab, selectedDevice } = useApp();

  const breadcrumbItems = [
    { title: "首页" },
    { title: "设备管理" },
    {
      title:
        activeTab === "device" ? "设备列表" : activeTab === "alarm" ? "告警列表" : "配置管理",
    },
  ];

  const activeIndex = TAB_KEYS.indexOf(activeTab);

  return (
    <main className="app-main">
      <Crumbs data={breadcrumbItems} className="app-breadcrumb" />
      <div className="page-title-row">
        <h1 className="page-title">设备管理中心</h1>
        {selectedDevice && activeTab !== "device" && (
          <span className="page-title-sub">当前设备:{selectedDevice.name}</span>
        )}
      </div>
      <Tab
        selectedIndex={activeIndex >= 0 ? activeIndex : 0}
        draggable={false}
        onClick={(index) => setActiveTab(TAB_KEYS[index] || "device")}
        className="app-tabs"
        tabContentStyle={{ paddingTop: "var(--spacing-stack)" }}
      >
        <TabItem title="设备管理">
          <DeviceTable />
        </TabItem>
        <TabItem title="告警列表">
          <AlarmList />
        </TabItem>
        <TabItem title="配置管理">
          <ConfigPanel />
        </TabItem>
      </Tab>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <PageContent />
      </div>
    </AppProvider>
  );
}
