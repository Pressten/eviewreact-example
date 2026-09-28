import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import TextField from "@nce/eview-react/TextField";
import IconButton from "@nce/eview-react/IconButton";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 全局导航 / 国际化切换 / 明暗切换 / 用户区
// Menu 无对应，手写 app-topnav（horizontal nav，div + button + CSS 变量）
// Segmented 无对应，手写 app-segmented（语言切换）
// Tooltip + 纯图标 Button → IconButton tipText（不再包 TipBox）
// Tooltip 包裹其他元素 → TipBox content 包裹式
// Badge count → content
export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const [searchKW, setSearchKW] = useState("");
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const topNav = [
    { key: "overview", icon: "layout-dashboard", label: t("nav.overview") },
    { key: "strategy", icon: "scroll-text", label: t("nav.strategy") },
    { key: "device", icon: "network", label: t("nav.device") },
    { key: "alarm", icon: "bell", label: t("nav.alarm") },
    { key: "report", icon: "chart-column", label: t("nav.report") },
  ];

  const langOptions = [
    { label: "中", value: "zh" },
    { label: "EN", value: "en" },
  ];

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <IconButton
          iconName={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
          tipText={t("nav.toggleSider")}
          tipData={{ direction: "bottom" }}
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

      {/* Menu horizontal 无对应，手写 app-topnav */}
      <nav className="app-topnav">
        {topNav.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`app-topnav-item${m.key === "strategy" ? " active" : ""}`}
          >
            <Icon name={m.icon} size={16} />
            <span>{m.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <TextField
          className="header-bar__search"
          placeholder={t("top.search")}
          value={searchKW}
          onChange={(value) => setSearchKW(value)}
        />

        {/* Segmented 无对应，手写 app-segmented（语言切换） */}
        <TipBox type="simple" content={t("top.lang")} direction="bottom">
          <div className="app-segmented app-segmented--sm">
            {langOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`app-segmented-item${lang === opt.value ? " active" : ""}`}
                onClick={() => setLang(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </TipBox>

        <IconButton
          iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          tipText={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
          tipData={{ direction: "bottom" }}
          onClick={toggleDark}
        />

        <Badge content={6}>
          <IconButton
            iconName={<Icon name="bell" size={16} />}
            tipText={t("top.notify")}
            tipData={{ direction: "bottom" }}
            onClick={() => {}}
          />
        </Badge>

        <IconButton
          iconName={<Icon name="circle-question-mark" size={16} />}
          tipText={t("top.help")}
          tipData={{ direction: "bottom" }}
          onClick={() => {}}
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
          tipData={{ direction: "bottom" }}
          onClick={() => {}}
        />
      </div>
    </header>
  );
}
