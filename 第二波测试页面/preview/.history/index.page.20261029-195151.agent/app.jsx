// App entry — 合同与账单中心（左侧锚点目录 + 右侧滚动正文，8 区块）
// Layer 5: Provider + 页头 + Anchor 布局 + 7 个锚点区块装配

import { useRef } from "react";
import { ConfigProvider, Empty, Anchor } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import PageHeader from "./src/views/page-header/index.jsx";
import ContractOverview from "./src/views/contract-overview/index.jsx";
import PlanBilling from "./src/views/plan-billing/index.jsx";
import BillRecords from "./src/views/bill-records/index.jsx";
import UsageOverage from "./src/views/usage-overage/index.jsx";
import PaymentInvoice from "./src/views/payment-invoice/index.jsx";
import RenewalChange from "./src/views/renewal-change/index.jsx";
import SlaSupport from "./src/views/sla-support/index.jsx";
import "./app.css";

const ANCHOR_ITEMS = [
  { key: "1", href: "#contract-overview", title: "合同概览" },
  { key: "2", href: "#plan-billing", title: "套餐计费" },
  { key: "3", href: "#bill-records", title: "账单记录" },
  { key: "4", href: "#usage-overage", title: "用量超额" },
  { key: "5", href: "#payment-invoice", title: "付款发票" },
  { key: "6", href: "#renewal-change", title: "续约变更" },
  { key: "7", href: "#sla-support", title: "SLA 支持" },
];

export default function App() {
  const contentRef = useRef(null);

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
          <PageHeader />
          <div className="cb-layout">
            <aside className="cb-anchor">
              <div className="cb-anchor-title">目录导航</div>
              <Anchor
                affix={false}
                targetOffset={16}
                getContainer={() => contentRef.current}
                items={ANCHOR_ITEMS}
              />
            </aside>
            <main className="cb-content" ref={contentRef}>
              <ContractOverview />
              <PlanBilling />
              <BillRecords />
              <UsageOverage />
              <PaymentInvoice />
              <RenewalChange />
              <SlaSupport />
            </main>
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
