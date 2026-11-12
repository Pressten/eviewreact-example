import { useMemo, useState } from "react";
import { IconPlusIcPublicBarChart, IconPlusIcPublicChevronDown, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import DropDown from "@nce/eview-react/DropDown";
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import { message } from "../../components/notice/index.jsx";
import { BUSINESS_CIRCLES } from "../../mock/data.js";
import { fmtWan } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const METRIC_KEYS = { 营业额: "营业额(万元)", 客单价: "客单价(元)", 坪效: "坪效(元/㎡)" };

export default function CircleChart() {
  const { region, stores, isDark } = useApp();
  const [metric, setMetric] = useState("营业额");

  // a2ui 视觉规范 + 暗色主题随 isDark 响应式派生（硬约束#11）
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  const { rows, totalSales } = useMemo(() => {
    const scoped = stores.filter((s) => region === "全部" || s.region === region);
    const list = BUSINESS_CIRCLES.map((c) => {
      const group = scoped.filter((s) => s.businessCircle === c);
      const sales = group.reduce((a, s) => a + s.dailySales, 0);
      const cust = group.reduce((a, s) => a + s.customerCount, 0);
      const area = group.reduce((a, s) => a + s.areaSqm, 0);
      return {
        商圈: c,
        门店数: group.length,
        "营业额(万元)": +(sales / 10000).toFixed(1),
        "客单价(元)": cust ? +(sales / cust).toFixed(1) : 0,
        "坪效(元/㎡)": area ? +(sales / area).toFixed(1) : 0,
      };
    }).sort((a, b) => b[METRIC_KEYS[metric]] - a[METRIC_KEYS[metric]]);
    return { rows: list, totalSales: scoped.reduce((a, s) => a + s.dailySales, 0) };
  }, [stores, region, metric]);

  return (
    <SectionCard
      className="cc-card"
      title="商圈绩效对比"
      icon={<IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />}
      extra={
        <div className="cc-actions">
          <DropDown
            position="right"
            popupDirection="bottom"
            data={Object.keys(METRIC_KEYS).map((k) => ({ value: k, text: `按${k}排序` }))}
            onItemClick={(item) => setMetric(item.value)}
          >
            <Button size="small">
              按{metric}排序
              <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} style={{ marginLeft: "0.25rem" }} />
            </Button>
          </DropDown>
          <span className="cc-divider" />
          <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} className="cc-refresh" title="按最新门店数据重新聚合" onClick={() => message.success("商圈绩效已按最新门店数据重新聚合")} />
        </div>
      }
      bodyClassName="cc-body"
    >
      <Chart
        name="BarChart"
        option={{
          ...chartBase,
          data: rows,
          xAxis: { data: "商圈" },
          yAxisTitle: "", // 不渲染 Y 轴标题，单位已含在图例系列名中
        }}
        style={{ flex: "1 1 0", minHeight: "17.5rem" }}
      />
      <p className="cc-note">
        {region === "全部" ? "全国" : `${region}大区`}四类商圈营业额合计 {fmtWan(totalSales)}，与 KPI
        营业额同口径（今日实时）。
      </p>
    </SectionCard>
  );
}
