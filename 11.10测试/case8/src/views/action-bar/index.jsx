import { useState } from "react";
import { Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { EVENTS } from "../../mock/ops.js";
import { useOpsNow, useApp } from "../../context.jsx";
import DelayWizard from "./delay-wizard.jsx";
import SwapModal from "./swap-modal.jsx";
import CancelModal from "./cancel-modal.jsx";
import "./index.css";

// 区块⑨ 底部操作栏 —— 发布延误(四步向导) / 更换飞机 / 取消航班 / 导出运行日报
// 延误发布与取消均经 context.applyOverride 同步主表、摘要、网格、波及链与机组面板
export default function ActionBar() {
  const { airport, dataset, selectedFlightId } = useApp();
  const now = useOpsNow();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const selected = dataset.find((r) => r.id === selectedFlightId) || null;

  const requireSelected = () => {
    if (!selected) {
      message.warning("请先在主表选择一个航班");
      return false;
    }
    return true;
  };

  const openSwap = () => {
    if (!requireSelected()) return;
    if (selected.status === "cancelled") {
      message.warning("该航班已取消，无需更换飞机");
      return;
    }
    setSwapOpen(true);
  };

  const openCancel = () => {
    if (!requireSelected()) return;
    if (selected.status === "cancelled") {
      message.warning("该航班已取消");
      return;
    }
    setCancelOpen(true);
  };

  const handleExport = () => {
    message.loading({ content: "运行日报生成中……", key: "export", duration: 0 });
    setTimeout(() => {
      message.success({
        content: `运行日报已导出（PDF）：${airport} ${dataset.length} 班航班 · ${EVENTS[airport].length} 条不正常事件 · 3 条流控`,
        key: "export",
        duration: 3,
      });
      setLastAction(`${now.format("HH:mm")} 导出运行日报（PDF）`);
    }, 1200);
  };

  return (
    <footer className="action-bar">
      <span className="ab-title">
        <Icon name="zap" size="1rem" />
        运行处置
      </span>
      <Button type="primary" icon={<Icon name="megaphone" size="0.875rem" />} onClick={() => setWizardOpen(true)}>
        发布延误
      </Button>
      <Button icon={<Icon name="plane" size="0.875rem" />} onClick={openSwap}>
        更换飞机
      </Button>
      <Button danger icon={<Icon name="circle-x" size="0.875rem" />} onClick={openCancel}>
        取消航班
      </Button>
      <Button icon={<Icon name="download" size="0.875rem" />} onClick={handleExport}>
        导出运行日报
      </Button>
      <div className="ab-log">
        {lastAction ? (
          <span className="mono" title="最近一次处置动作">{lastAction}</span>
        ) : (
          <span>目标航班：{selected ? `${selected.flightNo} · ${selected.tailNo}` : "未选择（在主表点击航班）"}</span>
        )}
      </div>

      <DelayWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onLog={(t) => setLastAction(`${now.format("HH:mm")} ${t}`)} />
      <SwapModal open={swapOpen} onClose={() => setSwapOpen(false)} onLog={(t) => setLastAction(`${now.format("HH:mm")} ${t}`)} />
      <CancelModal open={cancelOpen} onClose={() => setCancelOpen(false)} onLog={(t) => setLastAction(`${now.format("HH:mm")} ${t}`)} />
    </footer>
  );
}
