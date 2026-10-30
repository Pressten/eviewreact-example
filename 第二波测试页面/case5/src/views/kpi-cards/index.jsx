// Layer 4: ② 周核心指标 — 4 张可点击指标卡（销售额 / 客流量 / 客单价 / 会员新增）
// 点击卡片弹出近 8 周趋势详情（本期 vs 上年同期）
import { useState } from "react";
import { Button, Modal } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import MetricCard from "../../components/metric-card/index.jsx";
import "./index.css";

export default function KpiCards({ kpiList }) {
  const [activeMetricKey, setActiveMetricKey] = useState(null);
  const activeKpi = kpiList.find((kpi) => kpi.metricKey === activeMetricKey) || null;

  const detailChartData = activeKpi
    ? activeKpi.history.map((point) => ({
        "周次": point.weekLabel,
        "本期": point.current,
        "上年同期": point.lastYear,
      }))
    : [];

  const handleCancel = () => setActiveMetricKey(null);

  return (
    <div className="kpi-grid">
      {kpiList.map((kpi) => (
        <MetricCard key={kpi.metricKey} kpi={kpi} onClick={() => setActiveMetricKey(kpi.metricKey)} />
      ))}

      <Modal
        open={Boolean(activeKpi)}
        title={activeKpi ? `${activeKpi.metricName} · 近 8 周趋势` : ""}
        width={640}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>关闭</Button>,
        ]}
      >
        {activeKpi && (
          <div className="kpi-modal-body">
            <div className="kpi-modal-stats">
              <div className="kpi-modal-stat">
                <span className="kpi-modal-stat-label">本期（{activeKpi.latestWeekLabel}）</span>
                <span className="kpi-modal-stat-value">
                  {activeKpi.valueText} {activeKpi.unit}
                </span>
              </div>
              <div className="kpi-modal-stat">
                <span className="kpi-modal-stat-label">上年同期</span>
                <span className="kpi-modal-stat-value">
                  {activeKpi.lastYearText} {activeKpi.unit}
                </span>
              </div>
              <div className="kpi-modal-stat">
                <span className="kpi-modal-stat-label">周同比</span>
                <span className={`kpi-modal-stat-value ${activeKpi.yoyRate >= 0 ? "up" : "down"}`}>
                  {activeKpi.yoyRate >= 0 ? "+" : ""}{activeKpi.yoyRate}%
                </span>
              </div>
            </div>
            <div className="kpi-modal-chart">
              <Chart
                name="LineChart"
                option={{
                  data: detailChartData,
                  xAxis: { data: "周次", name: "周次" },
                  yAxisTitle: `${activeKpi.metricName} (${activeKpi.unit})`,
                  smooth: true,
                }}
                style={{ height: "100%" }}
              />
            </div>
            <p className="kpi-modal-note">口径：全部门店 20 家，不随页头「门店范围」筛选联动</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
