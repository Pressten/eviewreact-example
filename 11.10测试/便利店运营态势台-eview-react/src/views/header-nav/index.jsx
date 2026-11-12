import { useState } from "react";
import { IconPlusIcHuaweiCloudStoreNew, IconPlusIcPublicChevronDown, IconPlusIcPublicClock, IconPlusIcPublicDownload, IconPlusIcPublicExcleFileTextured, IconPlusIcPublicMoon, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSun, IconPlusIcPublicTxtFileTextured } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import DropDown from "@nce/eview-react/DropDown";
import Accordion from "@/shared/Accordion";
import { useApp } from "../../context.jsx";
import { message } from "../../components/notice/index.jsx";
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
    { value: "excel", icon: <IconPlusIcPublicExcleFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, text: "导出 Excel" },
    { value: "pdf", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, text: "导出 PDF" },
  ];

  return (
    <header className="top-header">
      <div className="brand">
        <span className="brand-logo">
          <IconPlusIcHuaweiCloudStoreNew iconSize="1.25rem" iconColor={['#FFFFFF']} />
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
        <Accordion
          className="region-menu"
          selectedValue={region}
          onClick={(node) => selectRegion(node.value)}
          enableExpand={false}
          hideIcons
          hideTitleBar
          style={{ lineHeight: "2.75rem", borderBottom: "none", background: "transparent", flex: "0 0 auto" }}
          data={REGION_OPTIONS.map((r) => ({ value: r, title: r }))}
        />
        <span className="upd-time">
          <IconPlusIcPublicClock iconSize="0.75rem" iconColor={['currentcolor']} />
          更新于 {fmtTime(lastUpdated)}
        </span>
        <Button
          size="small"
          disabled={spinning}
          onClick={handleRefresh}
        >
          <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />
          {spinning ? "刷新中…" : "刷新"}
        </Button>
        <DropDown
          position="right"
          popupDirection="bottom"
          data={exportItems}
          onItemClick={(item) =>
            message.success(`正在生成${item.value === "excel" ? " Excel" : " PDF"} 运营报表，完成后自动下载`)
          }
        >
          <Button size="small">
            <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />
            导出
            <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} style={{ marginLeft: "0.25rem" }} />
          </Button>
        </DropDown>
        {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} className="dark-toggle" title={isDark ? "切换亮色模式" : "切换暗色模式"} onClick={toggleDark} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} className="dark-toggle" title={isDark ? "切换亮色模式" : "切换暗色模式"} onClick={toggleDark} />}
      </div>
    </header>
  );
}
