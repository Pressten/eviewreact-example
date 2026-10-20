import Icon from "@/shared/Icon";
import "./index.css";

export default function InfoBanner({ type = "info", icon, children }) {
  const iconColor =
    type === "warning" ? "var(--critical)" : "var(--primary)";

  return (
    <div className={"info-banner " + type}>
      <span className="info-banner-icon" style={{ color: iconColor }}>
        <Icon
          name={icon ? icon : type === "warning" ? "triangle-alert" : "info"}
          size="1rem"
        />
      </span>
      <div className="info-banner-text">{children}</div>
    </div>
  );
}
