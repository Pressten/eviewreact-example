// App entry — 合同与账单中心（左侧锚点目录 + 右侧滚动正文，8 区块）
// Layer 5: Provider + 页头 + Anchor 布局 + 7 个锚点区块装配
// 注：antd Anchor 无 eview-react 对应，左侧目录导航手写实现（点击锚点在 contentRef 滚动容器内平滑滚动到对应区块）。

import { useRef, useState, useEffect, useCallback } from "react";
import { AppProvider } from "./context.jsx";
import PageHeader from "./views/page-header/index.jsx";
import ContractOverview from "./views/contract-overview/index.jsx";
import PlanBilling from "./views/plan-billing/index.jsx";
import BillRecords from "./views/bill-records/index.jsx";
import UsageOverage from "./views/usage-overage/index.jsx";
import PaymentInvoice from "./views/payment-invoice/index.jsx";
import RenewalChange from "./views/renewal-change/index.jsx";
import SlaSupport from "./views/sla-support/index.jsx";
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

const TARGET_OFFSET = 16;

// 手写锚点目录导航：点击锚点在 contentRef 滚动容器内平滑滚动到对应区块，并高亮当前区块。
function AnchorNav({ items, contentRef }) {
  const [activeKey, setActiveKey] = useState(items[0]?.key);

  const scrollToItem = useCallback(
    (item) => {
      const container = contentRef.current;
      if (!container) return;
      const target = container.querySelector(item.href);
      if (target) {
        container.scrollTo({ top: target.offsetTop - TARGET_OFFSET, behavior: "smooth" });
        setActiveKey(item.key);
      }
    },
    [contentRef]
  );

  // 滚动时按各区块相对容器顶部的位置高亮当前锚点
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const onScroll = () => {
      const offsets = items.map((it) => {
        const el = container.querySelector(it.href);
        return el ? el.offsetTop - TARGET_OFFSET - 40 : Infinity;
      });
      let idx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (container.scrollTop >= offsets[i]) idx = i;
      }
      setActiveKey(items[idx].key);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [contentRef, items]);

  return (
    <nav className="cb-anchor-nav">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          className={`cb-anchor-link ${activeKey === it.key ? "cb-anchor-link-active" : ""}`}
          onClick={() => scrollToItem(it)}
        >
          <span className="cb-anchor-link-title">{it.title}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const contentRef = useRef(null);

  return (
    <AppProvider>
      <div className="app-root">
        <PageHeader />
        <div className="cb-layout">
          <aside className="cb-anchor">
            <div className="cb-anchor-title">目录导航</div>
            <AnchorNav items={ANCHOR_ITEMS} contentRef={contentRef} />
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
    </AppProvider>
  );
}
