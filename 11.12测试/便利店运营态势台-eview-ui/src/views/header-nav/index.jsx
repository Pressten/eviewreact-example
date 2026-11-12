import { useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import Menu from "@cloudsop/eview-ui/Menu";
import Accordion from "@cloudsop/eview-ui/Accordion";
import DivMessage from "@cloudsop/eview-ui/DivMessage";
import Icon from "@/shared/Icon";
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

  // message → DivMessage：受控通知浮层（独立 state）
  // TYPE_MAP 收口 antd→DivMessage 的 type 映射（DivMessage 无 info，info→default，否则整树白屏）
  const [notice, setNotice] = useState({ display: false, type: "default", text: "" });
  const TYPE_MAP = { info: "default", success: "success", warning: "warn", error: "error" };
  const notify = (antdType, text) =>
    setNotice({ display: true, type: TYPE_MAP[antdType] || "default", text });

  const handleNav = (item) => {
    setNavActive(item);
    if (item !== "网点态势") {
      notify("info", `「${item}」为演示入口，当前停留在网点态势`);
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
    { key: "excel", label: "导出 Excel" },
    { key: "pdf", label: "导出 PDF" },
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
        {/* antd Menu(items 数组, horizontal) → eview-ui Accordion（侧边导航主映射）。
            data=[{value, title}]；selectedValue 单 string；onClick(node) 取 node.value。
            顶部大区切换采用平铺单层菜单（data 无 children），与原 Menu 的水平条形态等价。 */}
        <Accordion
          className="region-menu"
          data={REGION_OPTIONS.map((r) => ({ value: r, title: r }))}
          selectedValue={region}
          enableExpand={false}
          onClick={(node) => selectRegion(node.value)}
          style={{ lineHeight: "2.75rem", borderBottom: "none", background: "transparent", flex: "0 0 auto" }}
        />
        <span className="upd-time">
          <Icon name="clock" size="0.75rem" />
          更新于 {fmtTime(lastUpdated)}
        </span>
        <Button
          size="small"
          disabled={spinning}
          onClick={handleRefresh}
        >
          {spinning ? <Icon name="loader" size="0.875rem" /> : <Icon name="refresh-cw" size="0.875rem" />}
          刷新
        </Button>
        <Dropdown
          placement="bottomRight"
          trigger={["hover"]}
          overlay={
            <Menu onClick={(e) => notify("success", `正在生成${e.key === "excel" ? " Excel" : " PDF"} 运营报表，完成后自动下载`)}>
              {exportItems.map((it) => (
                <Menu.Item key={it.key}>{it.label}</Menu.Item>
              ))}
            </Menu>
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

      <DivMessage
        key={notice.text + notice.type}
        display={notice.display}
        type={notice.type}
        text={notice.text}
        disposeTimeOut={3000}
        onClose={() => setNotice((s) => ({ ...s, display: false }))}
      />
    </header>
  );
}
