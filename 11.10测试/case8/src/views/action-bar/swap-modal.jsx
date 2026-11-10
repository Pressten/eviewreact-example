import { useEffect, useState } from "react";
import { Button, Modal, Radio, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { SPARES } from "../../mock/crew.js";
import { useApp } from "../../context.jsx";

// 更换飞机 · Modal: 备用机列表 + 剩余运力(容量 - 航班旅客数)
// 二次确认: 操作栏触发 → 弹窗内选定备用机 → 确认更换
export default function SwapModal({ open, onClose, onLog }) {
  const { airport, dataset, selectedFlightId, applyOverride } = useApp();
  const flight = dataset.find((r) => r.id === selectedFlightId);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    if (open) setPicked(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedFlightId]);

  if (!flight) return null;

  const spares = SPARES[airport];
  const margin = (sp) => sp.capacity - flight.paxCount;
  const usable = (sp) => sp.status === "可用" && margin(sp) >= 0;

  const handleSwap = () => {
    const sp = spares.find((s) => s.tailNo === picked);
    if (!sp) return;
    applyOverride([{ id: flight.id, patch: { tailNo: sp.tailNo } }]);
    message.success(`${flight.flightNo} 已更换飞机 ${sp.tailNo}（${sp.acType} · 剩余运力 ${margin(sp)} 座）`);
    onLog(`更换飞机 · ${flight.flightNo} → ${sp.tailNo}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={`更换飞机 · ${flight.flightNo}`}
      width={600}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="go" type="primary" disabled={!picked} onClick={handleSwap}>确认更换</Button>,
      ]}
    >
      <div className="sw-flight mono">
        {flight.flightNo} · {flight.from}→{flight.to} · 当前 {flight.tailNo}（{flight.acType}） · 旅客 {flight.paxCount} 人
      </div>
      <div className="sw-list">
        {spares.map((sp) => (
          <label key={sp.tailNo} className={`sw-item ${usable(sp) ? "" : "sw-disabled"}`}>
            <Radio checked={picked === sp.tailNo} disabled={!usable(sp)} onChange={() => setPicked(sp.tailNo)} />
            <span className="mono sw-tail">{sp.tailNo}</span>
            <span className="sw-type">{sp.acType}</span>
            <span className="mono sw-cap">{sp.capacity} 座</span>
            <span className={`sw-margin mono ${margin(sp) < 0 ? "bad" : ""}`}>
              {margin(sp) >= 0 ? `余 ${margin(sp)} 座` : `缺 ${-margin(sp)} 座`}
            </span>
            <span className="sw-status">{sp.status}</span>
            <span className="sw-note" title={sp.note}>{sp.note}</span>
          </label>
        ))}
      </div>
      <div className="sw-warn">
        <Icon name="triangle-alert" size="0.75rem" />
        确认后主表注册号、延误波及链与机组执勤面板将按新机号同步刷新。
      </div>
    </Modal>
  );
}
