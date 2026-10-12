import SelectCard from "@nce/eview-react/SelectCard";
import Chart from "@/shared/Chart";
import SectionCard from "../../components/section-card/index.jsx";
import {
  requestTrend,
  alarmDistribution,
  regionUsage,
  clusterGauge,
} from "../../mock/dashboard.jsx";
import "./index.css";

export default function ChartBoard() {
  const lineOption = {
    data: requestTrend,
    xAxis: { data: "日期", name: "日期" },
    yAxisTitle: "请求量 (万次)",
    smooth: true,
    area: true,
  };

  const pieOption = {
    data: alarmDistribution,
    title: { text: "124", subtext: "告警总数" },
    legendPosition: "bottomCenter",
  };

  const barOption = {
    data: regionUsage,
    xAxis: { data: "区域" },
    yAxisTitle: "资源用量 (核)",
    direction: "horizontal",
  };

  const gaugeOption = {
    data: [{ value: clusterGauge.value, name: clusterGauge.name }],
    min: 0,
    max: 100,
    splitNumber: 4,
    markLine: 88,
  };

  return (
    <div className="chart-board">
      <SectionCard
        className="chart-board__cell chart-board__cell--wide"
        title="请求量趋势"
        subtitle="近 15 天 · 单位：万次"
        extra={
          <SelectCard
            type="small"
            value="qps"
            data={[
              { text: "请求量", value: "qps" },
              { text: "峰值", value: "peak" },
            ]}
          />
        }
        bodyClassName="section-card__body--chart"
      >
        <Chart name="LineChart" option={lineOption} style={{ flex: 1, minHeight: 0 }} />
      </SectionCard>

      <SectionCard
        className="chart-board__cell"
        title="告警类型分布"
        subtitle="当前未处理告警"
        bodyClassName="section-card__body--chart"
      >
        <Chart name="PieChart" option={pieOption} style={{ flex: 1, minHeight: 0 }} />
      </SectionCard>

      <SectionCard
        className="chart-board__cell chart-board__cell--wide"
        title="各区域资源用量"
        subtitle="单位：核"
        bodyClassName="section-card__body--chart"
      >
        <Chart name="BarChart" option={barOption} style={{ flex: 1, minHeight: 0 }} />
      </SectionCard>

      <SectionCard
        className="chart-board__cell"
        title="集群资源利用率"
        subtitle="整体水位"
        bodyClassName="section-card__body--chart"
      >
        <Chart name="GaugeChart" option={gaugeOption} style={{ flex: 1, minHeight: 0 }} />
      </SectionCard>
    </div>
  );
}
