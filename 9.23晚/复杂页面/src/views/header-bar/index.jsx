import { Button, Menu, Input, Segmented, Badge, Tooltip } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 全局导航 / 国际化切换 / 明暗切换 / 用户区
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
        <Tooltip title={t("nav.toggleSider")}>
          <Button
            type="text"
            shape="circle"
            size="small"
            aria-label={t("nav.toggleSider")}
            onClick={toggleCollapsed}
            icon={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
          />
        </Tooltip>
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

      <Menu
        mode="horizontal"
        selectedKeys={["strategy"]}
        items={topNav}
        style={{ flex: 1, minWidth: 0, borderBottom: "none", background: "transparent" }}
      />

      <div className="header-bar__tools">
        <Input
          className="header-bar__search"
          prefix={<Icon name="search" size={14} />}
          placeholder={t("top.search")}
          allowClear
        />

        <Tooltip title={t("top.lang")}>
          <Segmented
            className="header-bar__lang"
            size="small"
            value={lang}
            onChange={setLang}
            options={[
              { label: "中", value: "zh" },
              { label: "EN", value: "en" },
            ]}
          />
        </Tooltip>

        <Tooltip title={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}>
          <Button
            type="text"
            shape="circle"
            aria-label={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
            onClick={toggleDark}
            icon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          />
        </Tooltip>

        <Tooltip title={t("top.notify")}>
          <Badge count={6} size="small" offset={[-2, 2]}>
            <Button type="text" shape="circle" aria-label={t("top.notify")} icon={<Icon name="bell" size={16} />} />
          </Badge>
        </Tooltip>

        <Tooltip title={t("top.help")}>
          <Button type="text" shape="circle" aria-label={t("top.help")} icon={<Icon name="circle-question-mark" size={16} />} />
        </Tooltip>

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

        <Tooltip title={t("top.logout")}>
          <Button type="text" shape="circle" aria-label={t("top.logout")} icon={<Icon name="log-out" size={16} />} />
        </Tooltip>
      </div>
    </header>
  );
}
