// Layer 4: 趋势区 — 折线图 3 系列（活跃度 / 工单量 / 使用时长），随时间范围与行业联动；点击数据点查看数值
import Chart from "@nce/eview-react/Chart";
import ChartActions from "../../components/chart-actions/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { TIME_RANGES, getTrendData } from "../../mock/dashboard.jsx";
import "./index.css";

export default function TrendCard() {
  const { timeRange, industry, notify, isDark } = useApp();

  const activeRange = TIME_RANGES.find((range) => range.key === timeRange);
  const rangeLabel = activeRange ? activeRange.label : "近30天";

  const trend = getTrendData(timeRange, industry);
  const chartData = trend.labels.map((label, index) => {
    const row = { 日期: label };
    trend.series.forEach((seriesItem) => {
      row[seriesItem.name] = seriesItem.data[index];
    });
    return row;
  });

  // 图表 option 必含 a2ui + theme（随全局暗色状态派生）
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  // 点击数据点 → 反馈该点指标数值
  // onChartRendered 的参数即底层 echarts 实例，直接 .on() 绑定，禁止再调 getEchartsInstance()
  const handleChartRendered = (echartsInstance) => {
    if (!echartsInstance) return;
    echartsInstance.on("click", (params) => {
      if (!params || !params.seriesName) return;
      notify("info", `${params.seriesName} · ${params.name}：${params.value}`);
    });
  };

  return (
    <SectionCard
      className="trend-card"
      title="客户活跃趋势"
      subtitle={`${rangeLabel} · ${industry} · 3 项核心行为指标 · 点击数据点查看数值`}
      actions={<ChartActions refreshText="趋势数据已刷新" />}
    >
      <Chart
        name="LineChart"
        option={{
          ...chartBase,
          data: chartData,
          xAxis: { data: "日期" },
          yAxisTitle: "数值",
          smooth: true,
        }}
        onChartRendered={handleChartRendered}
        style={{ height: "16rem" }}
      />
    </SectionCard>
  );
}
