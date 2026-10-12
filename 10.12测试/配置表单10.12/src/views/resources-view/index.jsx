import { Table, Progress } from "antd";
import StatusTag from "../../components/status-tag/index.jsx";
import Panel from "../../components/panel/index.jsx";
import { useApp } from "../../context.jsx";
import { RESOURCE_POOLS, REGIONS, ORDER_STATUS } from "../../mock/packages.js";
import "./index.css";

const REGION_FILTERS = REGIONS.map((r) => ({ text: r.label, value: r.label }));

export default function ResourcesView() {
  const { orders } = useApp();

  const total = RESOURCE_POOLS.reduce((s, r) => s + r.totalPorts, 0);
  const used = RESOURCE_POOLS.reduce((s, r) => s + r.usedPorts, 0);
  const available = total - used;
  const avg = Math.round((used / total) * 100);
  const running = orders.filter((o) => o.status === "processing").length;

  const stats = [
    { label: "总端口容量", value: total.toLocaleString(), unit: "口", icon: "server", tone: "brand" },
    { label: "已用端口", value: used.toLocaleString(), unit: "口", icon: "activity", tone: "normal" },
    { label: "可用端口", value: available.toLocaleString(), unit: "口", icon: "circle-check", tone: "success" },
    { label: "平均利用率", value: `${avg}%`, unit: "", icon: "gauge", tone: "warning" },
  ];

  const columns = [
    { title: "城市", dataIndex: "city", width: 120 },
    { title: "所属区域", dataIndex: "region", width: 130, filters: REGION_FILTERS, onFilter: (v, r) => r.region === v },
    { title: "机房等级", dataIndex: "grade", width: 110 },
    { title: "总端口", dataIndex: "totalPorts", width: 100, align: "right", sorter: (a, b) => a.totalPorts - b.totalPorts, render: (v) => v.toLocaleString() },
    { title: "已用端口", dataIndex: "usedPorts", width: 100, align: "right", sorter: (a, b) => a.usedPorts - b.usedPorts, render: (v) => v.toLocaleString() },
    { title: "可用端口", key: "free", width: 100, align: "right", render: (_, r) => (r.totalPorts - r.usedPorts).toLocaleString() },
    {
      title: "利用率",
      key: "usage",
      width: 200,
      sorter: (a, b) => a.usedPorts / a.totalPorts - b.usedPorts / b.totalPorts,
      render: (_, r) => {
        const pct = Math.round((r.usedPorts / r.totalPorts) * 100);
        const status = pct >= 90 ? "exception" : pct >= 75 ? "normal" : "success";
        return <Progress percent={pct} size="small" status={status} />;
      },
    },
    { title: "状态", dataIndex: "status", width: 110, render: (v) => <StatusTag value={v} map={ORDER_STATUS} /> },
  ];

  return (
    <div className="res-view">
      <div className="res-stats">
        {stats.map((s) => (
          <div className={`res-stat res-stat-${s.tone}`} key={s.label}>
            <div className="res-stat-head">
              <span className="res-stat-label">{s.label}</span>
              <span className="res-stat-value">{s.value}{s.unit && <em className="res-stat-unit">{s.unit}</em>}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="res-note">
        当前有 <strong>{running}</strong> 个工单处于开通中，请关注高利用率区域的端口余量。
      </div>

      <Panel title="区域资源池明细" description="端口容量、利用率与状态">
        <Table rowKey="id" size="middle" columns={columns} dataSource={RESOURCE_POOLS} pagination={false} />
      </Panel>
    </div>
  );
}
