// Layer 3 — 表单分区容器

import {
  IconPlusIcPublicClipboard,
  IconPlusIcIctBuiltServer,
  IconPlusIcPublicNotes,
  IconPlusIcIctPerson,
  IconPlusIcPublicPaperclip,
  IconPlusIcPublicTelephone,
} from "@nce/icon-plus";
import "./index.css";

const iconColor = ["currentcolor"];

const SECTION_ICON_MAP = {
  "clipboard-list": IconPlusIcPublicClipboard,
  "server": IconPlusIcIctBuiltServer,
  "file-text": IconPlusIcPublicNotes,
  "users": IconPlusIcIctPerson,
  "paperclip": IconPlusIcPublicPaperclip,
  "phone": IconPlusIcPublicTelephone,
};

export default function FormSection({ index, icon, title, desc, extra, children }) {
  const IconComp = SECTION_ICON_MAP[icon] || IconPlusIcPublicClipboard;
  return (
    <section className="form-section">
      <header className="form-section__head">
        <span className="form-section__index">{index}</span>
        <div className="form-section__heading">
          <h3 className="form-section__title">
            <IconComp iconSize="1rem" iconColor={iconColor} className="form-section__icon" />
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
