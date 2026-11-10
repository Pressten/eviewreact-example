// App entry — 航空公司运行控制中心(AOC)
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: AOC 运行上下文 + dark mode toggle)
//   Layer 2 mock data     → src/mock/flight.js     (3 机场 × 3 运行日航班/波及链)
//                          src/mock/crew.js        (机组配组/备用机/执勤推算)
//                          src/mock/ops.js         (气象/流量控制/不正常事件)
//   Layer 3 reusable      → src/components/{name}/ (status-tag / delay-minutes / level-tag)
//   Layer 4 views         → src/views/{name}/       (ops-header ① / flight-table ② / delay-chain ③
//                                                   gate-grid ④ / crew-panel ⑤ / weather-flow ⑥
//                                                   event-list ⑦ / ops-quality ⑧ / action-bar ⑨)
//   Layer 5 layout        → app.jsx                 (Provider + 9 区块完整骨架)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import OpsHeader from "./src/views/ops-header/index.jsx";
import FlightTable from "./src/views/flight-table/index.jsx";
import DelayChain from "./src/views/delay-chain/index.jsx";
import GateGrid from "./src/views/gate-grid/index.jsx";
import CrewPanel from "./src/views/crew-panel/index.jsx";
import WeatherFlow from "./src/views/weather-flow/index.jsx";
import EventList from "./src/views/event-list/index.jsx";
import OpsQuality from "./src/views/ops-quality/index.jsx";
import ActionBar from "./src/views/action-bar/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root aoc-root">
          {/* 区块① 顶部运行栏 */}
          <OpsHeader />

          {/* 主体工作区: 左列(② 航班动态主表 + ④ 登机口调度网格) / 右列(③ 延误波及链 + ⑤ 机组执勤 + ⑧ 运行质量) */}
          <main className="aoc-main">
            <div className="aoc-table-region">
              <FlightTable />
              <GateGrid />
            </div>
            <aside className="aoc-side-region">
              <DelayChain />
              <CrewPanel />
              <OpsQuality />
            </aside>
          </main>

          {/* 次级工作区: ⑥ 气象与流量 + ⑦ 不正常事件 */}
          <div className="aoc-sub-row">
            <WeatherFlow />
            <EventList />
          </div>

          {/* 区块⑨ 底部操作栏: 发布延误 / 更换飞机 / 取消航班 / 导出运行日报 */}
          <ActionBar />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
