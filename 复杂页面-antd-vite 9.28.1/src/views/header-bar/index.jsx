import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import SearchInput from "@nce/eview-react/SearchInput";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });
  const [activeNav, setActiveNav] = useState("strategy");
  const [searchValue, setSearchValue] = useState("");

  const topNav = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: t("nav.overview") },
    { key: "strategy", icon: <Icon name="scroll-text" size={16} />, label: t("nav.strategy") },
    { key: "device", icon: <Icon name="network" size={16} />, label: t("nav.device") },
    { key: "alarm", icon: <Icon name="bell" size={16} />, label: t("nav.alarm") },
    { key: "report", icon: <Icon name="chart-column" size={16} />, label: t("nav.report") },
  ];

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <TipBox content={t("nav.toggleSider")} direction="bottom">
          <Button
            status="text"
            leftIcon={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
            className="header-bar__icon-btn"
            onClick={toggleCollapsed}
          />
        </TipBox>
        <span className="header-bar__logo">
          <Icon name="shield-check" size={18} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">{t("app.brandSub")}</span>
        </span>
      </div>

      <nav className="header-bar__nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item ${activeNav === item.key ? "active" : ""}`}
            onClick={() => setActiveNav(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder={t("top.search")}
          value={searchValue}
          onChange={(v) => setSearchValue(v)}
          onSearch={() => {}}
          onClear={() => setSearchValue("")}
        />

        <TipBox content={t("top.lang")} direction="bottom">
          <div className="header-bar__lang">
            <button
              type="button"
              className={`header-bar__lang-btn ${lang === "zh" ? "active" : ""}`}
              onClick={() => setLang("zh")}
            >
              中
            </button>
            <button
              type="button"
              className={`header-bar__lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </TipBox>

        <TipBox content={isDark ? t("top.theme.toLight") : t("top.theme.toDark")} direction="bottom">
          <Button
            status="text"
            leftIcon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
            className="header-bar__icon-btn"
            onClick={toggleDark}
          />
        </TipBox>

        <TipBox content={t("top.notify")} direction="bottom">
          <Badge content={6} offset={[-2, 2]}>
            <Button
              status="text"
              leftIcon={<Icon name="bell" size={16} />}
              className="header-bar__icon-btn"
              onClick={() => {}}
            />
          </Badge>
        </TipBox>

        <TipBox content={t("top.help")} direction="bottom">
          <Button
            status="text"
            leftIcon={<Icon name="circle-question-mark" size={16} />}
            className="header-bar__icon-btn"
            onClick={() => {}}
          />
        </TipBox>

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

        <TipBox content={t("top.logout")} direction="bottom">
          <Button
            status="text"
            leftIcon={<Icon name="log-out" size={16} />}
            className="header-bar__icon-btn"
            onClick={() => {}}
          />
        </TipBox>
      </div>
    </header>
  );
}
