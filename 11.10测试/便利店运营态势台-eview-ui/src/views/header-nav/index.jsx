import { useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { useToast } from "../../components/toast/index.jsx";
import { REGION_OPTIONS } from "../../mock/data.js";
import "./index.css";

const NAV_ITEMS = ["网点态势", "门店管理", "商品中心", "补货调度", "巡检督导", "设置"];

function fmtTime(d) {
  const p = (x) => String(x).padStart(2, "0");
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function HeaderNav() {
  const { region, selectRegion, lastUpdated, refresh, isDark, toggleDark } = useApp();
  const notify = useToast();
  const [spinning, setSpinning] = useState(false);
  const [navActive, setNavActive] = useState("网点态势");

  const handleNav = (item) => {
    setNavActive(item);
    if (item !== "网点态势") {
      notify("default", `「${item}」为演示入口，当前停留在网点态势`);
    }
  };

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      refresh();
      notify("success", "数据已刷新，展示最新运营快照");
    }, 600);
  };

  const exportItems = [
    { key: "excel", icon: "file-spreadsheet", label: "导出 Excel" },
    { key: "pdf", icon: "file-text", label: "导出 PDF" },
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
        {/* TODO(eview-ui): antd Menu（mode="horizontal" 大区切换标签）无 eview-ui 对应——Accordion 是
            侧边导航（垂直，§7.3 标注「侧边导航主映射」），API 无 horizontal 模式，硬塞会破坏顶栏横向布局。
            按 handwrite 策略用横向标签手写（与上方 main-nav 的 <a> 标签同构），样式沿用源项目 token CSS 变量。 */}
        <div className="region-menu" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: "0 0 auto" }}>
          {REGION_OPTIONS.map((r) => (
            <a
              key={r}
              className={region === r ? "active" : ""}
              onClick={() => selectRegion(r)}
              style={{ lineHeight: "2.75rem", padding: "0 0.75rem" }}
            >
              {r}
            </a>
          ))}
        </div>
        <span className="upd-time">
          <Icon name="clock" size="0.75rem" />
          更新于 {fmtTime(lastUpdated)}
        </span>
        <Button size="small" disabled={spinning} onClick={handleRefresh}>
          <Icon name="refresh-cw" size="0.875rem" />
          刷新
        </Button>
        <Dropdown
          placement="bottomRight"
          trigger={["hover"]}
          overlay={
            <div className="hn-export-menu" style={{ minWidth: "10rem" }}>
              {exportItems.map((it) => (
                <a
                  key={it.key}
                  className="hn-export-item"
                  onClick={() => notify("success", `正在生成${it.key === "excel" ? " Excel" : " PDF"} 运营报表，完成后自动下载`)}
                >
                  <Icon name={it.icon} size="0.875rem" /> {it.label}
                </a>
              ))}
            </div>
          }
        >
          <Button size="small">
            <Icon name="download" size="0.875rem" />
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
