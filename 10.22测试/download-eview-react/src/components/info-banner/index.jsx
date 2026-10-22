import Icon from "@/shared/Icon";
import { IconPlusIcPublicAlert, IconPlusIcPublicInfo } from '@hui/icon-plus';
import "./index.css";

export default function InfoBanner({ type = "info", icon, children }) {
  const iconColor =
    type === "warning" ? "var(--critical)" : "var(--primary)";

  return (
    <div className={"info-banner " + type}>
      <span className="info-banner-icon" style={{ color: iconColor }}>
        {icon ? <Icon name={icon} size="1rem" /> : type === "warning" ? <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicInfo iconSize="1rem" iconColor={['currentcolor']} />}
      </span>
      <div className="info-banner-text">{children}</div>
    </div>
  );
}
