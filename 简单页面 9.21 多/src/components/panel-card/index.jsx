// Layer 3: 内容卡片容器（标题 + 工具区 + 内容体）。
// eview-react 无"非折叠标题卡"原语（Panel/PanelItem 为折叠面板，会引入非预期折叠行为），
// 按 eview-react fallback pattern 用原生 JSX + 已冻结 token（--surface-container-highest / --shadow-card / --divider 等）。
// 暗色随 <body> 上的 .dark（与 aui3_1_dark 同步 toggle）自动翻转 token，无需本组件额外规则。
// TODO(eview-react): 若后续需要折叠能力，可改用 Panel/PanelItem。
import "./index.css";

export default function PanelCard({ title, subtitle, extra, children, className, bodyClassName }) {
  const rootClass = className ? "panel-card " + className : "panel-card";
  const bodyClass = bodyClassName ? "panel-card__body " + bodyClassName : "panel-card__body";
  return (
    <section className={rootClass}>
      {title || extra ? (
        <header className="panel-card__header">
          <div className="panel-card__titles">
            <h2 className="panel-card__title">{title}</h2>
            {subtitle ? <span className="panel-card__subtitle">{subtitle}</span> : null}
          </div>
          {extra ? <div className="panel-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}
