import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import TipBox from "@nce/eview-react/TipBox";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const TOP_NAV = [
  { key: "overview", icon: "layout-dashboard", msgId: "nav.overview" },
  { key: "strategy", icon: "scroll-text", msgId: "nav.strategy" },
  { key: "device", icon: "network", msgId: "nav.device" },
  { key: "alarm", icon: "bell", msgId: "nav.alarm" },
  { key: "report", icon: "chart-column", msgId: "nav.report" },
];

export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const activeKey = "strategy";

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <IconButton
          iconName={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
          tipText={t("nav.toggleSider")}
          size="small"
          onClick={toggleCollapsed}
        />
        <span className="header-bar__logo">
          <Icon name="shield-check" size={18} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">{t("app.brandSub")}</span>
        </span>
      </div>

      <nav className="header-bar__topnav">
        {TOP_NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__topnav-item${activeKey === item.key ? " is-active" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span>{t(item.msgId)}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder={t("top.search")}
          value=""
          onChange={() => {}}
          inputStyle={{ width: 220 }}
        />

        <TipBox type="simple" content={t("top.lang")} direction="bottom">
          <SelectCard
            type="small"
            data={[
              { value: "zh", text: "中" },
              { value: "en", text: "EN" },
            ]}
            value={lang}
            onChange={(v) => setLang(v)}
          />
        </TipBox>

        <IconButton
          iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          tipText={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
          onClick={toggleDark}
        />

        <TipBox type="simple" content={t("top.notify")} direction="bottom">
          <Badge content={6} offset={[-2, 2]}>
            <IconButton iconName={<Icon name="bell" size={16} />} tipText={t("top.notify")} />
          </Badge>
        </TipBox>

        <IconButton
          iconName={<Icon name="circle-question-mark" size={16} />}
          tipText={t("top.help")}
        />

        <div className="header-bar__divider" />

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="" />
          <span className="header-bar__user-text">
            <strong>{lang === "zh" ? "李伟" : "Li Wei"}</strong>
            <em>
              <FormattedMessage id="top.role" defaultMessage="网络运维管理员" />
            </em>
          </span>
        </div>

        <IconButton
          iconName={<Icon name="log-out" size={16} />}
          tipText={t("top.logout")}
        />
      </div>
    </header>
  );
}
