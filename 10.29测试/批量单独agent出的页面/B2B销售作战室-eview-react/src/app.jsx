// App entry — 销售作战室 (B2B Pipeline War Room)
// 分层: context(全局态) → mock(数据) → components(复用) → views(分区) → app(布局)
// antd ConfigProvider + theme.darkAlgorithm 已移除:换肤改为双轨 class 切换(见 context.jsx)。
import { AppProvider } from "./context.jsx";
import { IconPlusIcIctTrophy, IconPlusIcPublicFunnel, IconPlusIcPublicListBullet, IconPlusIcPublicLists, IconPlusIcCarUser } from '@hui/icon-plus';
import HeaderBar from "./views/header-bar/index.jsx";
import GoalBar from "./views/goal-bar/index.jsx";
import SalesFunnel from "./views/sales-funnel/index.jsx";
import OppBoard from "./views/opp-board/index.jsx";
import MyTodo from "./views/my-todo/index.jsx";
import TopCustomers from "./views/top-customers/index.jsx";
import TeamTable from "./views/team-table/index.jsx";
import SectionCard from "./components/section-card/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <GoalBar />
        <main className="app-main">
          <div className="app-grid">
            <SectionCard
              className="app-funnel"
              bodyClassName="app-body-flex"
              title="销售漏斗"
              icon={<IconPlusIcPublicFunnel iconSize="1.25rem" iconColor={['currentcolor']} />}
              iconColor="var(--primary)"
              accent="var(--primary)"
            >
              <SalesFunnel />
            </SectionCard>

            <SectionCard
              className="app-todo"
              bodyClassName="app-body-flex"
              title="我的待办"
              icon={<IconPlusIcPublicListBullet iconSize="1.25rem" iconColor={['currentcolor']} />}
              iconColor="var(--critical)"
              accent="var(--critical)"
            >
              <MyTodo />
            </SectionCard>

            <SectionCard
              className="app-board"
              bodyClassName="app-body-flex app-body-board"
              title="商机看板"
              icon={<IconPlusIcPublicLists iconSize="1.25rem" iconColor={['currentcolor']} />}
              iconColor="var(--primary)"
              accent="var(--primary)"
            >
              <OppBoard />
            </SectionCard>

            <SectionCard
              className="app-team"
              bodyClassName="app-body-flex"
              title="团队业绩"
              icon={<IconPlusIcCarUser iconSize="1.25rem" iconColor={['currentcolor']} />}
              iconColor="var(--success)"
              accent="var(--success)"
            >
              <TeamTable />
            </SectionCard>

            <SectionCard
              className="app-cust"
              bodyClassName="app-body-flex"
              title="重点客户榜"
              icon={<IconPlusIcIctTrophy iconSize="1.25rem" iconColor={['currentcolor']} />}
              iconColor="var(--critical)"
              accent="var(--critical)"
            >
              <TopCustomers />
            </SectionCard>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
