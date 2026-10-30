import { Table, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import Chart from "../../../assets/shared/chart.jsx";
import SectionBlock from "../../components/section-block/index.jsx";
import { usage, overageDetails } from "../../mock/data.js";
import "./index.css";

const STATE_TAG = {
  normal: { color: "success", text: "正常" },
  warning: { color: "warning", text: "接近上限" },
  overage: { color: "error", text: "超额" },
};

function formatMoney(n) {
  return "￥" + Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function UsageOverage() {
  const chartData = usage.map((u) => ({ 模块: u.module, 已用占比: u.ratio }));

  const overColumns = [
    { title: "模块", dataIndex: "module", key: "module" },
    {
      title: "已用",
      key: "used",
      align: "right",
      render: (_, r) => <span>{r.used.toLocaleString()} {usage.find((u) => u.key === r.key)?.unit}</span>,
    },
    {
      title: "上限",
      key: "limit",
      align: "right",
      render: (_, r) => <span>{r.limit.toLocaleString()} {usage.find((u) => u.key === r.key)?.unit}</span>,
    },
    {
      title: "超额量",
      key: "overage",
      align: "right",
      render: (_, r) => (
        <span className="cb-uo-over-num">
          +{r.overage.toLocaleString()} {usage.find((u) => u.key === r.key)?.unit}
        </span>
      ),
    },
    {
      title: "超额费用",
      dataIndex: "fee",
      key: "fee",
      align: "right",
      render: (v) => <span className="cb-uo-over-fee">{formatMoney(v)}</span>,
    },
    { title: "计费区间", dataIndex: "period", key: "period" },
  ];

  return (
    <SectionBlock
      id="usage-overage"
      title="用量与超额"
      icon={<Icon name="gauge" size="1.25rem" color="#0067D1" />}
      extra={
        <div className="cb-uo-legend">
          <span className="cb-uo-legend-item">
            <i className="cb-uo-dot cb-uo-dot-normal" /> 正常
          </span>
          <span className="cb-uo-legend-item">
            <i className="cb-uo-dot cb-uo-dot-warning" /> 接近上限
          </span>
          <span className="cb-uo-legend-item">
            <i className="cb-uo-dot cb-uo-dot-overage" /> 超额
          </span>
        </div>
      }
    >
      <div className="cb-uo-chart-card">
        <div className="cb-uo-chart-head">
          <span className="cb-uo-chart-title">当前周期用量占比（对比标准额度 100%）</span>
          <span className="cb-uo-chart-sub">2026-Q1 · 6 个核心模块</span>
        </div>
        <div className="cb-uo-chart-box">
          <Chart
            name="BarChart"
            option={{
              data: chartData,
              xAxis: { data: "模块" },
              yAxisTitle: "已用占比 (%)",
              direction: "horizontal",
              markLine: { bottom: 100 },
            }}
          />
        </div>
      </div>

      <div className="cb-uo-states">
        {usage.map((u) => (
          <div className={`cb-uo-state cb-uo-state-${u.state}`} key={u.key}>
            <div className="cb-uo-state-name">{u.module}</div>
            <div className="cb-uo-state-bar">
              <div
                className="cb-uo-state-fill"
                style={{ width: `${Math.min(u.ratio, 100)}%` }}
              />
            </div>
            <div className="cb-uo-state-num">
              {u.used.toLocaleString()} / {u.limit.toLocaleString()} {u.unit}
            </div>
            <Tag color={STATE_TAG[u.state].color}>{STATE_TAG[u.state].text}</Tag>
          </div>
        ))}
      </div>

      <div className="cb-uo-over-table">
        <div className="cb-uo-over-title">超额明细</div>
        <Table
          size="middle"
          rowKey="key"
          columns={overColumns}
          dataSource={overageDetails}
          pagination={false}
          rowClassName={() => "cb-uo-over-row"}
        />
      </div>
    </SectionBlock>
  );
}
