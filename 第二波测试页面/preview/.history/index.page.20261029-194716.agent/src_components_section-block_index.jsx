import { Divider } from "antd";
import "./index.css";

// Layer 3: 区块容器 — 锚点目标 + 标题 + 分隔线 + 正文
export default function SectionBlock({ id, title, icon, extra, children }) {
  return (
    <section id={id} className="cb-section">
      <div className="cb-section-head">
        <div className="cb-section-title">
          {icon}
          <h3>{title}</h3>
        </div>
        {extra ? <div className="cb-section-extra">{extra}</div> : null}
      </div>
      <Divider className="cb-section-divider" />
      <div className="cb-section-body">{children}</div>
    </section>
  );
}
