import { Steps } from "antd";
import "./index.css";

// Layer 3: 步骤条
// - cell   : 表格内紧凑轨道(小圆点 + 连接线 + 当前阶段文案),避免撑高行高
// - detail : 详情页完整 Steps(带标题)
export default function StepFlow({ stages, stage = 0, status = "running", variant = "cell" }) {
  const isFailed = status === "failed";
  const isDone = status === "success";
  const current = isDone ? stages.length : stage;

  if (variant === "detail") {
    return (
      <Steps
        className="step-flow step-flow--detail"
        size="small"
        current={current}
        status={isFailed ? "error" : "process"}
        items={stages.map((title) => ({ title }))}
      />
    );
  }

  const stateOf = (i) => {
    if (i < current) return "done";
    if (i === current) return isFailed ? "error" : "active";
    return "todo";
  };

  const nodes = [];
  stages.forEach((title, i) => {
    if (i > 0) {
      nodes.push(<span key={"line-" + i} className={"step-track__line" + (i <= current ? " is-done" : "")} />);
    }
    nodes.push(<span key={"dot-" + i} className={"step-track__dot step-track__dot--" + stateOf(i)} title={title} />);
  });

  let label;
  if (isDone) label = "全部完成";
  else if (isFailed) label = "失败于 " + stages[Math.min(current, stages.length - 1)];
  else label = `${Math.min(current + 1, stages.length)}/${stages.length} ${stages[Math.min(current, stages.length - 1)]}`;

  return (
    <div className="step-track" title={stages.join(" → ")}>
      <div className="step-track__dots">{nodes}</div>
      <span className={"step-track__label" + (isFailed ? " is-error" : isDone ? " is-done" : "")}>{label}</span>
    </div>
  );
}
