// Layer 3: 接口状态标签（正常 / 即将下线 / 已下线）+ 版本新增标记
import "./index.css";

const STATUS_MAP = {
  active: { label: "正常", cls: "st-active" },
  deprecating: { label: "即将下线", cls: "st-deprecating" },
  sunset: { label: "已下线", cls: "st-sunset" },
};

export default function StatusTag({ status }) {
  const conf = STATUS_MAP[status] || STATUS_MAP.active;
  return <span className={`status-tag ${conf.cls}`}>{conf.label}</span>;
}

// 「新增」标记：该接口由当前版本引入
export function NewTag() {
  return <span className="status-tag st-new">新增</span>;
}
