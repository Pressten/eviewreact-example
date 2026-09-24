import Button from "@nce/eview-react/Button";
import { Icon } from "../shared/icon.jsx";

function ContextBanner({ icon = "link-2", title, crumb, fields = [], onBack, backText = "返回上一级" }) {
  return (
    <div className="context-banner">
      <span className="context-banner__icon">
        <Icon name={icon} size={16} />
      </span>
      <div className="context-banner__body">
        <div className="context-banner__head">
          <span className="context-banner__title">{title}</span>
          {crumb ? <span className="context-banner__crumb">{crumb}</span> : null}
        </div>
        {fields.length > 0 ? (
          <div className="context-banner__fields">
            {fields.map((f) => (
              <span className="context-banner__field" key={f.label}>
                <span className="context-banner__field-label">{f.label}</span>
                <span className="context-banner__field-value">{f.value}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {onBack ? (
        <Button leftIcon={<Icon name="arrow-left" size={14} />} text={backText} onClick={onBack} />
      ) : null}
    </div>
  );
}

export default ContextBanner;
