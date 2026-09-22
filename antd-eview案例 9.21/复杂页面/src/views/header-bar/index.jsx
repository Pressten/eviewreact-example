import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import SelectCard from "@nce/eview-react/SelectCard";
import TextField from "@nce/eview-react/TextField";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 全局导航 / 国际化切换 / 明暗切换 / 用户区
// eview-react 无 Menu Reference，顶部水平导航手写 button 列表
export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

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
        <TipBox content={t("nav.toggleSider")}>
          <Button
            status="text"
            leftIcon={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
            onClick={toggleCollapsed}
          />
        </TipBox>
        <span className="header-bar__logo">
          <Icon name="shield-check" size={18} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">
            {lang === "zh" ? t("app.brandSub") : t("app.brandSub")}
          </span>
        </span>
      </div>

      <nav className="header-bar__nav">
        {topNav.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`header-bar__nav-item${m.key === "strategy" ? " is-active" : ""}`}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <TextField className="header-bar__search" placeholder={t("top.search")} />

        <TipBox content={t("top.lang")}>
          <SelectCard
            className="header-bar__lang"
            value={lang}
            data={[
              { text: "中", value: "zh" },
              { text: "EN", value: "en" },
            ]}
            onChange={(v) => setLang(v)}
          />
        </TipBox>

        <TipBox content={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}>
          <Button
            status="text"
            leftIcon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
            onClick={toggleDark}
          />
        </TipBox>

        <TipBox content={t("top.notify")}>
          <Badge content={6}>
            <Button status="text" leftIcon={<Icon name="bell" size={16} />} />
          </Badge>
        </TipBox>

        <TipBox content={t("top.help")}>
          <Button status="text" leftIcon={<Icon name="circle-question-mark" size={16} />} />
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

        <TipBox content={t("top.logout")}>
          <Button status="text" leftIcon={<Icon name="log-out" size={16} />} />
        </TipBox>
      </div>
    </header>
  );
}
