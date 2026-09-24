// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / header-bar)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / alarm-list)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Breadcrumb, Tabs } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider, useApp } from "./src/context.jsx";
import HeaderBar from "./src/components/header-bar/index.jsx";
import DeviceTable from "./src/views/device-table/index.jsx";
import AlarmList from "./src/views/alarm-list/index.jsx";
import ConfigPanel from "./src/views/config-panel/index.jsx";
import "./app.css";

function PageContent() {
  const { activeTab, setActiveTab, selectedDevice } = useApp();

  const breadcrumbItems = [
    { title: "首页" },
    { title: "设备管理" },
    {
      title: activeTab === "device" ? "设备列表" : activeTab === "alarm" ? "告警列表" : "配置管理",
    },
  ];

  const tabItems = [
    { key: "device", label: "设备管理", children: <DeviceTable /> },
    { key: "alarm", label: "告警列表", children: <AlarmList /> },
    { key: "config", label: "配置管理", children: <ConfigPanel /> },
  ];

  return (
    <main className="app-main">
      <Breadcrumb items={breadcrumbItems} className="app-breadcrumb" />
      <div className="page-title-row">
        <h1 className="page-title">设备管理中心</h1>
        {selectedDevice && activeTab !== "device" && (
          <span className="page-title-sub">当前设备:{selectedDevice.name}</span>
        )}
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="app-tabs"
      />
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <HeaderBar />
          <PageContent />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
