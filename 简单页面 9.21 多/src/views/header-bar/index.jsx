import SearchInput from "@nce/eview-react/SearchInput";
import Toggle from "@nce/eview-react/Toggle";
import Badge from "@nce/eview-react/Badge";
import IconButton from "@nce/eview-react/IconButton";
import TipBox from "@nce/eview-react/TipBox";
import {
  IconPlusIcPublicGauge,
  IconPlusIcPublicBell,
  IconPlusIcPublicChevronDown,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部全局栏 — 品牌标识 / 全局检索 / 主题切换 / 用户区
export default function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, applyFilters } = useApp();

  const handleSearch = (event) => {
    if (event.key === "Enter") applyFilters();
  };

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconPlusIcPublicGauge iconSize={20} />
        </span>
        <span className="header-bar__name">数据指标中心</span>
        <span className="header-bar__divider" />
        <span className="header-bar__module">指标管理</span>
      </div>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder="搜索指标名称、编码或负责人"
          value={draft.keyword}
          onChange={(value) => updateDraft("keyword", value)}
          onClear={() => updateDraft("keyword", "")}
          inputProps={{ onKeyDown: handleSearch }}
        />
        <TipBox
          type="simple"
          content={isDark ? "切换浅色模式" : "切换深色模式"}
          direction="bottom"
        >
          <Toggle data={[false, true]} toggled={isDark} onToggle={toggleDark} />
        </TipBox>
        <Badge content={3} offset={[-2, 2]}>
          <IconButton iconName={<IconPlusIcPublicBell iconSize={16} />} />
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="用户头像" />
          <span className="header-bar__username">顾云舟</span>
          <IconPlusIcPublicChevronDown iconSize={14} />
        </button>
      </div>
    </header>
  );
}
