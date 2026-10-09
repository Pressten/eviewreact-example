// Layer 4: 设备详情弹窗(默认弹出)
import { Modal, Button, Timeline } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import Chart from "../../../assets/shared/chart.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { loadCurve, recentAlarms } from "../../mock/dashboard.js";
import "./index.css";

const curveOption = {
  data: loadCurve,
  xAxis: { data: "时间", name: "时间" },
  yAxisTitle: "负载率 (%)",
  smooth: true,
  area: true,
};

export default function DetailModal({ open, device, onClose }) {
  if (!device) return null;

  const infoList = [
    { label: "所属区域", value: device.region },
    { label: "设备类型", value: device.type },
    { label: "生产厂商", value: device.manufacturer },
    { label: "固件版本", value: device.firmware },
    { label: "实时负载率", value: `${device.load}%` },
    { label: "设备温度", value: `${device.temp}°C` },
    { label: "IP 地址", value: device.ip },
    { label: "累计在线", value: `${device.uptimeHours} 小时` },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={760}
      title={null}
      className="detail-modal"
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="export" icon={<Icon name="download" size="0.875rem" />}>
          导出报告
        </Button>,
        <Button key="goto" type="primary" onClick={onClose}>
          前往设备管理
        </Button>,
      ]}
    >
      <div className="detail-modal__header">
        <div className="detail-modal__heading">
          <h3 className="detail-modal__name">{device.name}</h3>
          <StatusTag status={device.status} />
        </div>
        <p className="detail-modal__meta">
          {device.code} · {device.region} · {device.type} · 最后上报 {device.updated}
        </p>
      </div>

      <div className="detail-modal__info">
        {infoList.map((it) => (
          <div className="detail-modal__info-item" key={it.label}>
            <span className="detail-modal__info-label">{it.label}</span>
            <span className="detail-modal__info-value">{it.value}</span>
          </div>
        ))}
      </div>

      <div className="detail-modal__section">
        <h4 className="detail-modal__section-title">近 24 小时负载曲线</h4>
        <div className="detail-modal__chart">
          <Chart name="LineChart" option={curveOption} />
        </div>
      </div>

      <div className="detail-modal__section">
        <h4 className="detail-modal__section-title">近期事件</h4>
        <Timeline
          items={recentAlarms.map((a) => ({
            color: a.color,
            children: (
              <div className="detail-modal__event">
                <div className="detail-modal__event-head">
                  <span className="detail-modal__event-title">{a.title}</span>
                  <span className="detail-modal__event-time">{a.time}</span>
                </div>
                <p className="detail-modal__event-desc">{a.desc}</p>
              </div>
            ),
          }))}
        />
      </div>
    </Modal>
  );
}
