// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import Tab from "@nce/eview-react/Tab";
import TabItem from "@nce/eview-react/TabItem";
import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import ConfigForm from "./views/config-form/index.jsx";
import ConfigTable from "./views/config-table/index.jsx";
import OrdersView from "./views/orders-view/index.jsx";
import ResourcesView from "./views/resources-view/index.jsx";
import TemplatesView from "./views/templates-view/index.jsx";
import Panel from "./components/panel/index.jsx";
import { IconPlusIcDigitalPowerDpFile, IconPlusIcIctServers, IconPlusIcIctTemplate, IconPlusIcIndustryConfiguration } from '@nce/icon-plus';
import "./app.css";

function Shell() {
  const { activeTab, setActiveTab } = useApp();

  const TAB_KEYS = ["config", "orders", "resources", "templates"];
  const activeIndex = Math.max(0, TAB_KEYS.indexOf(activeTab));
  const handleTabClick = (index) => {
    const key = TAB_KEYS[index];
    if (key) setActiveTab(key);
  };

  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        <div className="app-page-head">
          <h1 className="app-title">云网专线业务开通</h1>
          <p className="app-subtitle">面向运营商客户的专线电路配置、资源核对与工单提交平台</p>
        </div>
        <Tab
          selectedIndex={activeIndex}
          draggable={false}
          onClick={handleTabClick}
          className="app-tabs"
        >
          <TabItem
            title={
              <span className="tab-label">
                <IconPlusIcIndustryConfiguration iconSize="0.875rem" iconColor={['currentcolor']} /> 开通配置
              </span>
            }
          >
            <div className="cfg-layout">
              <Panel title="电路开通参数" description="填写业务参数后生成配置清单" className="cfg-panel-form">
                <ConfigForm />
              </Panel>
              <Panel title="电路配置清单" description="表单生成结果，可编辑、批量下发与提交工单" className="cfg-panel-table">
                <ConfigTable />
              </Panel>
            </div>
          </TabItem>
          <TabItem
            title={
              <span className="tab-label">
                <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /> 开通工单
              </span>
            }
          >
            <Panel title="开通工单" description="查看工单进度，或将历史工单复制为新的开通草稿">
              <OrdersView />
            </Panel>
          </TabItem>
          <TabItem
            title={
              <span className="tab-label">
                <IconPlusIcIctServers iconSize="0.875rem" iconColor={['currentcolor']} /> 资源池管理
              </span>
            }
          >
            <ResourcesView />
          </TabItem>
          <TabItem
            title={
              <span className="tab-label">
                <IconPlusIcIctTemplate iconSize="0.875rem" iconColor={['currentcolor']} /> 参数模板
              </span>
            }
          >
            <Panel title="参数模板" description="将常用参数组合保存为模板，一键套用至开通表单">
              <TemplatesView />
            </Panel>
          </TabItem>
        </Tab>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
