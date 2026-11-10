import { useState } from "react";
import { Button, Dropdown, Menu, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { REGION_OPTIONS } from "../../mock/data.js";
import "./index.css";

const NAV_ITEMS = ["网点态势", "门店管理", "商品中心", "补货调度", "巡检督导", "设置"];

function fmtTime(d) {
  const p = (x) => String(x).padStart(2, "0");
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function HeaderNav() {
  const { region, selectRegion, lastUpdated, refresh, isDark, toggleDark } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [navActive, setNavActive] = useState("网点态势");

  const handleNav = (item) => {
    setNavActive(item);
    if (item !== "网点态势") {
      message.info(`「${item}」为演示入口，当前停留在网点态势`);
    }
  };

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      refresh();
      message.success("数据已刷新，展示最新运营快照");
    }, 600);
  };

  const exportItems = [
    { key: "excel", icon: <Icon name="file-spreadsheet" size="0.875rem" />, label: "导出 Excel" },
    { key: "pdf", icon: <Icon name="file-text" size="0.875rem" />, label: "导出 PDF" },
  ];

  return (
    <header className="top-header">
      <div className="brand">
        <span className="brand-logo">
          <Icon name="store" size="1.25rem" color="#FFFFFF" />
        </span>
        <span className="brand-text">
          <strong>惠邻便利店</strong>
          <em>网点运营态势台</em>
        </span>
      </div>

      <nav className="main-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            className={navActive === item ? "active" : ""}
            onClick={() => handleNav(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="header-tools">
        <Menu
          className="region-menu"
          mode="horizontal"
          disabledOverflow
          selectedKeys={[region]}
          onClick={(e) => selectRegion(e.key)}
          style={{ lineHeight: "2.75rem", borderBottom: "none", background: "transparent", flex: "0 0 auto" }}
          items={REGION_OPTIONS.map((r) => ({ key: r, label: r }))}
        />
        <span className="upd-time">
          <Icon name="clock" size="0.75rem" />
          更新于 {fmtTime(lastUpdated)}
        </span>
        <Button
          size="small"
          loading={spinning}
          icon={spinning ? undefined : <Icon name="refresh-cw" size="0.875rem" />}
          onClick={handleRefresh}
        >
          刷新
        </Button>
        <Dropdown
          placement="bottomRight"
          menu={{
            items: exportItems,
            onClick: ({ key }) =>
              message.success(`正在生成${key === "excel" ? " Excel" : " PDF"} 运营报表，完成后自动下载`),
          }}
        >
          <Button size="small" icon={<Icon name="download" size="0.875rem" />}>
            导出
            <Icon name="chevron-down" size="0.75rem" style={{ marginLeft: "0.25rem" }} />
          </Button>
        </Dropdown>
        <Icon
          name={isDark ? "sun" : "moon"}
          size="1rem"
          className="dark-toggle"
          title={isDark ? "切换亮色模式" : "切换暗色模式"}
          onClick={toggleDark}
        />
      </div>
    </header>
  );
}
