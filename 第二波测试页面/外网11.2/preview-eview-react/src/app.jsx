// App entry — HCS1 基线合规检查 · 智能画布（由 config-agent-merged.html 迁移）
// Layering convention:
//   Layer 1 global state  → context.jsx        (AppProvider: 主题 + 任务流 + 页签)
//   Layer 2 mock data     → mock/              (devices / checks / audit / graph / workflow)
//   Layer 3 reusable      → components/status-marks/
//   Layer 4 views         → views/{stage,top-bar,left-rail,cockpit,lui-panel,canvas-area,
//                                      network-overview,mapping-card,report-card,device-pane}
//   Layer 5 layout        → app.jsx (本文件)

// 样式按原 HTML 中 <style> 块的级联顺序导入（stage 基础令牌最先）
import "./views/stage/index.css";
import "./views/top-bar/index.css";
import "./views/cockpit/index.css";
import "./views/lui-panel/index.css";
import "./views/canvas-area/index.css";
import "./views/network-overview/index.css";
import "./views/mapping-card/index.css";
import "./views/report-card/index.css";
import "./views/device-pane/index.css";
import "./views/uc2-canvas/uc2.css";
import "./views/uc4-sync.css";
import "./views/process-animation.css";
import "./views/stage/desktop.css";
import "./views/cockpit/responsive.css";
import "./views/artifact-surfaces/index.css";
import "./views/stage/typography.css";
import "./views/device-pane/design.css";

import "./components/form-controls/index.css";

import { AppProvider } from "./context.jsx";
import Stage from "./views/stage/index.jsx";

export default function App() {
  return (
    <AppProvider>
      <Stage />
    </AppProvider>
  );
}
