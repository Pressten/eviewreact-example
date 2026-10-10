import SelectCard from "@nce/eview-react/SelectCard";
import { useState } from "react";
import { IconPlusIcIct360Dashboard, IconPlusIcPublicBarChart, IconPlusIcPublicDoughnutChart } from '@nce/icon-plus';
import Chart from "../../shared/chart.jsx";
import { trendData, regionLoad, statusDist, gaugeData } from "../../mock/dashboard.jsx";
import "./index.css";

const lineOption = {
  data: trendData,
  xAxis: { data: "日期", name: "日期" },
  yAxisTitle: "发电量 (kWh)",
  smooth: true,
  area: true,
  markLine: { bottom: 38000 },
};

const barOption = {
  data: regionLoad,
  xAxis: { data: "区域" },
  yAxisTitle: "平均负载率 (%)",
  direction: "horizontal",
};

const pieOption = {
  data: statusDist,
  title: { text: "设备状态", subtext: "共 1286 台" },
  legendPosition: "bottomCenter",
};

const gaugeOption = {
  data: gaugeData,
  min: 0,
  max: 100,
  splitNumber: 4,
};

export default function ChartBoard() {
  const [range, setRange] = useState("近 7 日");

  return (
    <section className="chart-board">
      <div className="chart-card">
        <div className="chart-card__head">
          <h3 className="chart-card__title">发电量趋势</h3>
          <SelectCard
            type="small"
            data={[
              { text: "近 7 日", value: "近 7 日" },
              { text: "近 30 日", value: "近 30 日" },
            ]}
            value={range}
            onChange={(value) => setRange(value)}
          />
        </div>
        <div className="chart-card__chart">
          <Chart name="LineChart" option={lineOption} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card__head">
          <h3 className="chart-card__title">设备状态分布</h3>
          <IconPlusIcPublicDoughnutChart iconSize="1rem" iconColor={['currentcolor']} />
        </div>
        <div className="chart-card__chart">
          <Chart name="PieChart" option={pieOption} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card__head">
          <h3 className="chart-card__title">各区域平均负载率</h3>
          <IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />
        </div>
        <div className="chart-card__chart">
          <Chart name="BarChart" option={barOption} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card__head">
          <h3 className="chart-card__title">综合利用率</h3>
          <IconPlusIcIct360Dashboard iconSize="1rem" iconColor={['currentcolor']} />
        </div>
        <div className="chart-card__chart">
          <Chart name="GaugeChart" option={gaugeOption} />
        </div>
      </div>
    </section>
  );
}
