import "./card.css";

// Layer 3: 通用区块容器 — 标题 / 副标题 / 右侧操作 / 内容
export default function SectionCard({ title, subtitle, extra, children, bodyClassName }) {
  return (
    <section className="card">
      <div className="card-head">
        <div className="card-heading">
          <h2 className="card-title">{title}</h2>
          {subtitle ? <p className="card-sub">{subtitle}</p> : null}
        </div>
        {extra ? <div className="card-extra">{extra}</div> : null}
      </div>
      <div className={bodyClassName ? "card-body " + bodyClassName : "card-body"}>{children}</div>
    </section>
  );
}
