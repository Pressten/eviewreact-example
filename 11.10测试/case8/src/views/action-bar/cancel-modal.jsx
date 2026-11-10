import { useEffect, useState } from "react";
import { Button, Checkbox, Modal, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { STATUS_META, fmt } from "../../mock/flight.js";
import { useApp } from "../../context.jsx";

const COMPENSATIONS = [
  { value: "rebook", label: "改签最近可用航班（含中转衔接保护）" },
  { value: "refund", label: "全额退票 + 300 元延误补偿券" },
  { value: "hotel", label: "免费食宿与地面交通安排" },
];

// 取消航班 · danger Modal: 二次确认 + 旅客补偿方案勾选(至少一项)
// 确认后主表行状态置为「取消」, 顶部运行摘要计数同步扣减(经 context overrides)
export default function CancelModal({ open, onClose, onLog }) {
  const { dataset, selectedFlightId, applyOverride } = useApp();
  const flight = dataset.find((r) => r.id === selectedFlightId);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (open) setPlans([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedFlightId]);

  if (!flight) return null;

  const handleCancel = () => {
    applyOverride([
      {
        id: flight.id,
        patch: { status: "cancelled", delayMinutes: 0, delayReason: "运控取消 · 旅客补偿方案已下发" },
      },
    ]);
    message.warning(`${flight.flightNo} 已取消，${flight.paxCount} 名旅客补偿方案已下发（${plans.length} 项）`);
    onLog(`取消航班 · ${flight.flightNo}（补偿 ${plans.length} 项）`);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={
        <span className="cm-title">
          <Icon name="circle-x" size="1rem" />
          取消航班 · {flight.flightNo}
        </span>
      }
      width={560}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>关闭</Button>,
        <Button key="go" danger disabled={plans.length === 0} onClick={handleCancel}>
          确认取消航班
        </Button>,
      ]}
    >
      <div className="cm-info mono">
        {flight.flightNo} · {flight.from}→{flight.to} · 计划 {fmt(flight.schedDep)} 起飞 · 登机口 {flight.gate}
      </div>
      <div className="cm-impact">
        <span className="cm-impact-item">旅客 <b className="mono">{flight.paxCount}</b> 人</span>
        <span className="cm-impact-item">中转旅客 <b className="mono">{flight.transferPax}</b> 人</span>
        <span className="cm-impact-item">当前状态 <b>{STATUS_META[flight.status] ? STATUS_META[flight.status].label : flight.status}</b></span>
      </div>
      <div className="cm-label">旅客补偿方案（至少勾选一项后方可确认）</div>
      <Checkbox.Group className="cm-plans" value={plans} onChange={setPlans}>
        {COMPENSATIONS.map((c) => (
          <Checkbox key={c.value} value={c.value} className="cm-plan">
            {c.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
      <div className="cm-warn">
        <Icon name="triangle-alert" size="0.75rem" />
        确认后主表该行状态置为「取消」，延误分钟清零，顶部运行摘要「已执行/延误/取消」计数同步扣减更新。
      </div>
    </Modal>
  );
}
