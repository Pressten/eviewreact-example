// Layer 4: 顶部导航栏 — 品牌 + 主菜单 + 全局工具（原生 nav 自写）
import { useState } from "react";
import { IconPlusIcIctBaseStation, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicQuestionmarkCircle, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import TextField from "@/shared/TextField";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "home", label: "首页" },
  { key: "resource", label: "资源管理" },
  { key: "order", label: "工单中心" },
  { key: "report", label: "数据填报" },
  { key: "analysis", label: "报表分析" },
  { key: "system", label: "系统设置" },
];

export default function HeaderBar() {
  const [active, setActive] = useState("report");
  const { isDark, toggleDark } = useApp();

  return (
    <header className="header-bar">
      <div className="header-bar__left">
        <div className="header-bar__brand">
          <span className="header-bar__logo">
            <IconPlusIcIctBaseStation iconSize="1.25rem" iconColor={['currentcolor']} />
          </span>
          <span className="header-bar__brand-name">运营商资源填报平台</span>
        </div>

        <nav className="header-bar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`header-bar__nav-item${active === item.key ? " is-active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="header-bar__right">
        <TextField
          className="header-bar__search"
          placeholder="搜索站点、编码或设备 SN"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        />

        <TipBox type="simple" content={isDark ? "切换为浅色模式" : "切换为深色模式"} direction="bottom">
          <button type="button" className="header-bar__icon-btn" onClick={toggleDark}>
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
          </button>
        </TipBox>

        <TipBox type="simple" content="消息通知" direction="bottom">
          <button type="button" className="header-bar__icon-btn">
            <Badge content={5} offset={[2, -2]}>
              <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
            </Badge>
          </button>
        </TipBox>

        <TipBox type="simple" content="帮助中心" direction="bottom">
          <button type="button" className="header-bar__icon-btn">
            <IconPlusIcPublicQuestionmarkCircle iconSize="1rem" iconColor={['currentcolor']} />
          </button>
        </TipBox>

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="" />
          <div className="header-bar__user-meta">
            <span className="header-bar__user-name">张启航</span>
            <span className="header-bar__user-role">广东移动 · 网优工程师</span>
          </div>
          <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
        </div>
      </div>
    </header>
  );
}
