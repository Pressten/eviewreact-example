// Layer 3: 设备状态标签(可复用)
import "./index.css";

const TONE_MAP = {
  运行中: "success",
  待机: "info",
  告警: "warning",
  离线: "error",
};

export default function StatusTag({ status }) {
  const tone = TONE_MAP[status] || "info";
  return (
    <span className={"status-tag status-tag--" + tone}>
      <i className="status-tag__dot" />
      {status}
    </span>
  );
}
