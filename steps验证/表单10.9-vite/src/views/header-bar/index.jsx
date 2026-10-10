import { useState } from "react";
import { IconPlusIcIctBaseStation, IconPlusIcIctLogOut, IconPlusIcIctMoveLeftAndRight, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicPerson, IconPlusIcPublicSearch, IconPlusIcPublicSetting, IconPlusIcPublicSun } from '@nce/icon-plus';
import TextField from "@/shared/TextField";
import Badge from "@nce/eview-react/Badge";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4 — 顶部导航栏（原生 nav 自写，不使用 antd Menu）
const TOP_NAV = [
  { key: "workbench", label: "工作台" },
  { key: "order", label: "业务受理" },
  { key: "resource", label: "资源管理" },
  { key: "analysis", label: "运营分析" },
  { key: "service", label: "客户服务" },
];

const USER_MENU_OPTIONS = [
  { id: "profile", text: "个人中心", serialno: "profile", iconUrl: <IconPlusIcPublicPerson iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "setting", text: "账号设置", serialno: "setting", iconUrl: <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "switch", text: "切换组织", serialno: "switch", iconUrl: <IconPlusIcIctMoveLeftAndRight iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "divider", isDivider: true },
  { id: "logout", text: "退出登录", serialno: "logout", iconUrl: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  const [active, setActive] = useState("order");

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="brand-mark">
          <IconPlusIcIctBaseStation iconSize="1.25rem" iconColor={['var(--on-primary)']} />
        </span>
        <span className="brand-name">鲲鹏云网运营平台</span>
      </div>

      <nav className="topbar-nav">
        {TOP_NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={"topnav-item" + (active === item.key ? " is-active" : "")}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topbar-tools">
        <TextField
          className="topbar-search"
          placeholder="搜索客户、订单编号或资源"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        />
        <Badge content={3} offset={[-2, 4]}>
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} className="tool-icon" title="通知中心" onClick={() => {}} />
        </Badge>
        {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} className="tool-icon" /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} className="tool-icon" />}
        <PopUpMenu options={USER_MENU_OPTIONS} direction="bottom" hDirection="right" width="180px">
          <button type="button" className="topbar-user">
            <img className="user-avatar" src="./assets/uploads/user.png" alt="用户头像" />
            <span className="user-meta">
              <span className="user-name">王海涛</span>
              <span className="user-role">政企客户经理</span>
            </span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="user-caret" />
          </button>
        </PopUpMenu>
      </div>
    </header>
  );
}
