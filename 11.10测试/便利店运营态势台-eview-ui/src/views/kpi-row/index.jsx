import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context.jsx";
import { useToast } from "../../components/toast/index.jsx";
import { isStoreAbnormal } from "../../mock/data.js";
import { fmtWan } from "../../utils.js";
import DeltaChip from "../../components/delta-chip/index.jsx";
import "./index.css";

// 数字滚动动画：目标值变化时 700ms 缓动逼近
function useCountUp(target, decimals) {
  const [display, setDisplay] = useState(() => target);
  const prevRef = useRef(target);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    if (Math.abs(from - target) < Math.pow(10, -decimals) / 2) return;
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, decimals]);

  return display.toFixed(decimals);
}

function KpiValue({ num, decimals }) {
  const text = useCountUp(num, decimals);
  return <span className="kpi-value">{text}</span>;
}

export default function KpiRow() {
  const { stores, setAbnormalOnly } = useApp();
  const notify = useToast();

  const openStores = stores.filter((s) => s.status === "营业中");
  const salesTotal = stores.reduce((a, s) => a + s.dailySales, 0);
  const custTotal = stores.reduce((a, s) => a + s.customerCount, 0);
  const avgSales = openStores.length ? salesTotal / openStores.length : 0;
  const abnormalCount = stores.filter(isStoreAbnormal).length;

  // 昨日基数（同一份门店数据的 yesterday 字段口径）
  const ySales = stores.reduce((a, s) => a + s.yesterdaySales, 0);
  const yCust = Math.round(stores.reduce((a, s) => a + s.yesterdaySales / 13.8, 0));
  const yOpen = Math.max(openStores.length - 2, 1);
  const yAvg = ySales / yOpen;
  const yAbnormal = abnormalCount + 3;

  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // KPI 卡点击 → 联动对应区块
  const jumpToTable = (abnormalView) => {
    setAbnormalOnly(abnormalView);
    scrollTo(".st-card");
    notify("default", `门店明细已切换为「${abnormalView ? "异常门店" : "全部门店"}」视图`);
  };

  const cards = [
    {
      key: "open",
      label: "在营门店数",
      num: openStores.length,
      decimals: 0,
      unit: "家",
      abs: openStores.length - yOpen,
      note: `全网 ${stores.length} 家 · 今日新开 2 家 · 点击查看`,
      warn: false,
      onClick: () => jumpToTable(false),
    },
    {
      key: "sales",
      label: "今日全国营业额",
      num: salesTotal / 10000,
      decimals: 1,
      unit: "万元",
      pct: (salesTotal / ySales - 1) * 100,
      note: `昨日 ${fmtWan(ySales)} · 周末回落 · 点击看趋势`,
      warn: false,
      onClick: () => {
        scrollTo(".ts-card");
        notify("default", "已定位近 30 日营业额趋势");
      },
    },
    {
      key: "cust",
      label: "今日总客单数",
      num: custTotal / 10000,
      decimals: 1,
      unit: "万人次",
      pct: (custTotal / yCust - 1) * 100,
      note: `折算客单价 ¥${custTotal ? (salesTotal / custTotal).toFixed(1) : "0"} · 点击看商圈`,
      warn: false,
      onClick: () => {
        scrollTo(".cc-card");
        notify("default", "已定位商圈绩效对比");
      }
    },
    {
      key: "avg",
      label: "平均单店营业额",
      num: avgSales,
      decimals: 0,
      unit: "元/店",
      pct: (avgSales / yAvg - 1) * 100,
      note: `样本为 ${openStores.length} 家在营门店 · 点击看明细`,
      warn: false,
      onClick: () => jumpToTable(false),
    },
    {
      key: "abnormal",
      label: "异常门店数",
      num: abnormalCount,
      decimals: 0,
      unit: "家",
      abs: abnormalCount - yAbnormal,
      note: "非营业态 / 缺货>20 / 高危巡检 · 点击追查",
      warn: true,
      onClick: () => jumpToTable(true),
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <div
          key={c.key}
          className={`kpi-card ${c.warn ? "kpi-warn" : ""} ${c.onClick ? "kpi-clickable" : ""}`}
          onClick={c.onClick}
        >
          <div className="kpi-label">{c.label}</div>
          <div className="kpi-value-row">
            <KpiValue num={c.num} decimals={c.decimals} />
            <span className="kpi-unit">{c.unit}</span>
            <DeltaChip pct={c.pct} abs={c.abs} />
          </div>
          <div className="kpi-note">{c.note}</div>
        </div>
      ))}
    </div>
  );
}
