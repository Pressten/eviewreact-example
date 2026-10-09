// Layer 3 — 表单分区容器

import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function FormSection({ index, icon, title, desc, extra, children }) {
  return (
    <section className="form-section">
      <header className="form-section__head">
        <span className="form-section__index">{index}</span>
        <div className="form-section__heading">
          <h3 className="form-section__title">
            <Icon name={icon} size="1rem" className="form-section__icon" />
            {title}
          </h3>
          {desc ? <p className="form-section__desc">{desc}</p> : null}
        </div>
        {extra ? <div className="form-section__extra">{extra}</div> : null}
      </header>
      <div className="form-section__body">{children}</div>
    </section>
  );
}
