import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function SectionCard({ icon, title, subtitle, extra, children, className = "", style }) {
  return (
    <section className={`sec-card ${className}`.trim()} style={style}>
      {(title || extra) && (
        <header className="sec-card-head">
          <div className="sec-card-title">
            {icon ? (
              <span className="sec-card-icon">
                <Icon name={icon} size={16} />
              </span>
            ) : null}
            <span className="sec-card-text">{title}</span>
            {subtitle ? <span className="sec-card-sub">{subtitle}</span> : null}
          </div>
          {extra ? <div className="sec-card-extra">{extra}</div> : null}
        </header>
      )}
      <div className="sec-card-body">{children}</div>
    </section>
  );
}
