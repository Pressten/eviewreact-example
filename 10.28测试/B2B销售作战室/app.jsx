// App entry — 销售作战室 (B2B Pipeline War Room)
// 分层: context(全局态) → mock(数据) → components(复用) → views(分区) → app(布局)
import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import GoalBar from "./src/views/goal-bar/index.jsx";
import SalesFunnel from "./src/views/sales-funnel/index.jsx";
import OppBoard from "./src/views/opp-board/index.jsx";
import MyTodo from "./src/views/my-todo/index.jsx";
import TopCustomers from "./src/views/top-customers/index.jsx";
import TeamTable from "./src/views/team-table/index.jsx";
import SectionCard from "./src/components/section-card/index.jsx";
import "./app.css";

// 幂等挂载守卫:预览宿主会对页面做预渲染+预编译注入,可能把含 createRoot 的应用
// 代码重复写入多份。React 18 对同一 #root 多次 createRoot 会破坏事件代理 → 点击失效。
// 此守卫拦截 ReactDOM.createRoot,保证全局仅首次对 #root 真正挂载,后续重复调用
// 降级为空操作 root,从而无论注入几份都能单次挂载、交互正常。
(function () {
  if (typeof window === "undefined" || window.__odMountGuard) return;
  window.__odMountGuard = true;
  if (typeof ReactDOM === "undefined" || typeof ReactDOM.createRoot !== "function") return;
  var rawCreateRoot = ReactDOM.createRoot;
  ReactDOM.createRoot = function (container) {
    if (container && container.nodeType === 1 && container.id === "root") {
      if (window.__odAppMounted) {
        return { render: function () {}, unmount: function () {}, update: function () {} };
      }
      window.__odAppMounted = true;
    }
    return rawCreateRoot.call(ReactDOM, container);
  };
})();

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
        <div className="app-root">
          <HeaderBar />
          <GoalBar />
          <main className="app-main">
            <div className="app-grid">
              <SectionCard
                className="app-funnel"
                bodyClassName="app-body-flex"
                title="销售漏斗"
                icon="funnel"
                iconColor="var(--primary)"
                accent="var(--primary)"
              >
                <SalesFunnel />
              </SectionCard>

              <SectionCard
                className="app-todo"
                bodyClassName="app-body-flex"
                title="我的待办"
                icon="list-checks"
                iconColor="var(--critical)"
                accent="var(--critical)"
              >
                <MyTodo />
              </SectionCard>

              <SectionCard
                className="app-board"
                bodyClassName="app-body-flex app-body-board"
                title="商机看板"
                icon="table-2"
                iconColor="var(--primary)"
                accent="var(--primary)"
              >
                <OppBoard />
              </SectionCard>

              <SectionCard
                className="app-team"
                bodyClassName="app-body-flex"
                title="团队业绩"
                icon="users"
                iconColor="var(--success)"
                accent="var(--success)"
              >
                <TeamTable />
              </SectionCard>

              <SectionCard
                className="app-cust"
                bodyClassName="app-body-flex"
                title="重点客户榜"
                icon="trophy"
                iconColor="var(--critical)"
                accent="var(--critical)"
              >
                <TopCustomers />
              </SectionCard>
            </div>
          </main>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
