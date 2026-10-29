// Layer 3: 图表卡右上角操作组 — 刷新 | 分隔线 | 设置 + 更多（Icon 组）
import { IconPlusIcPublicEllipsis, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSetting } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import "./index.css";

export default function ChartActions({ refreshText = "图表数据已刷新" }) {
  const { notify } = useApp();

  return (
    <div className="chart-actions">
      <IconPlusIcPublicRefreshClockwise
        iconSize="1rem"
        iconColor={['currentcolor']}
        className="chart-action-icon"
        title="刷新数据"
        onClick={() => notify("success", refreshText)}
      />
      <span className="chart-actions-divider" />
      <IconPlusIcPublicSetting
        iconSize="1rem"
        iconColor={['currentcolor']}
        className="chart-action-icon"
        title="图表设置"
        onClick={() => notify("info", "已打开图表设置（演示）")}
      />
      <IconPlusIcPublicEllipsis
        iconSize="1rem"
        iconColor={['currentcolor']}
        className="chart-action-icon"
        title="更多操作"
        onClick={() => notify("info", "已打开更多图表操作（演示）")}
      />
    </div>
  );
}
