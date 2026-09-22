import "./index.css";

const STATUS = {
  published: { label: "已发布", cls: "success" },
  draft: { label: "草稿", cls: "neutral" },
  processing: { label: "处理中", cls: "processing" },
  offline: { label: "已下线", cls: "error" },
  running: { label: "运行中", cls: "processing" },
  queued: { label: "排队中", cls: "neutral" },
  failed: { label: "失败", cls: "error" },
  done: { label: "已完成", cls: "success" },
};

export default function StatusTag({ status }) {
  const s = STATUS[status] || STATUS.draft;
  return (
    <span className={`stag stag-${s.cls}`}>
      <i className="stag-dot" />
      {s.label}
    </span>
  );
}
