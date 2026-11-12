import { useMemo, useState } from "react";
import { IconPlusIcPublicPredictionLine } from '@hui/icon-plus';
import SelectCard from "@nce/eview-react/SelectCard";
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import { TREND_30D } from "../../mock/data.js";
import { fmtInt, fmtMoney } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import "./index.css";

export default function TrendSection() {
  const { stores, setDetailStoreId, isDark } = useApp();
  const [range, setRange] = useState(30);

  // a2ui 视觉规范 + 暗色主题随 isDark 响应式派生（硬约束#11）
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  // 末位（今日）与 KPI 同口径：门店数据实时求和，刷新/歇业等操作后自动重算
  const data = useMemo(() => {
    const todaySales = stores.reduce((a, s) => a + s.dailySales, 0);
    const todayCust = stores.reduce((a, s) => a + s.customerCount, 0);
    const last = TREND_30D[TREND_30D.length - 1];
    const series = [
      ...TREND_30D.slice(0, -1),
      { date: last.date, dailySales: todaySales, customerCount: todayCust },
    ];
    return series.slice(-range).map((d) => ({
      日期: d.date,
      "营业额(万元)": +(d.dailySales / 10000).toFixed(1),
      "客流(千人)": +(d.customerCount / 1000).toFixed(1),
    }));
  }, [stores, range]);

  // 单店营业额 TOP5（实时，点击行查看门店详情）
  const top5 = useMemo(
    () =>
      stores
        .filter((s) => s.status === "营业中" && s.dailySales > 0)
        .sort((a, b) => b.dailySales - a.dailySales)
        .slice(0, 5),
    [stores]
  );

  const topSales = top5.length ? top5[0].dailySales : 1;

  return (
    <SectionCard
      className="ts-card"
      title="近 30 日营业额与客流趋势"
      icon={<IconPlusIcPublicPredictionLine iconSize="1rem" iconColor={['currentcolor']} />}
      extra={
        <SelectCard
          type="small"
          value={range}
          onChange={(v) => setRange(v)}
          data={[
            { text: "近 7 日", value: 7 },
            { text: "近 14 日", value: 14 },
            { text: "近 30 日", value: 30 },
          ]}
        />
      }
      bodyClassName="ts-body"
    >
      <div className="ts-chart">
        <Chart
          name="LineChart"
          option={{
            ...chartBase,
            data,
            xAxis: { data: "日期", name: `近 ${range} 日` },
            yAxisTitle: "", // 不渲染 Y 轴标题，单位已含在图例系列名中
            smooth: true,
            area: true,
          }}
        />
      </div>
      <aside className="ts-rank">
        <div className="ts-rank-head">
          <b>单店营业额 TOP5</b>
          <span>实时</span>
        </div>
        {top5.map((s, i) => (
          <div
            key={s.storeId}
            className="ts-rank-row"
            title="查看门店详情"
            onClick={() => setDetailStoreId(s.storeId)}
          >
            <span className={`rk rk-${i + 1}`}>{i + 1}</span>
            <div className="rk-main">
              <div className="rk-line1">
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailStoreId(s.storeId);
                  }}
                >
                  {s.storeName}
                </a>
              </div>
              <div className="rk-line2">
                {s.province} · {s.businessCircle} · 客流 {fmtInt(s.customerCount)}
              </div>
              <SimpleProgress
                percent={Math.max(4, Math.round((s.dailySales / topSales) * 100))}
                showInfo={false}
                color="var(--primary)"
              />
            </div>
            <span className="rk-sales">{fmtMoney(s.dailySales)}</span>
          </div>
        ))}
      </aside>
    </SectionCard>
  );
}
