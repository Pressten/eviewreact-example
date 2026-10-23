// Layer 4: ③ 状态页签 — eview Tab + 数量角标（切换联动、当前页签高亮）
import Tab, { TabItem } from "@nce/eview-react/Tab";
import "./index.css";

export default function StatusTabs({ tabs, active, onChange }) {
  const activeIndex = tabs.findIndex((t) => t.key === active);

  return (
    <div className="status-tabs">
      <Tab
        selectedIndex={activeIndex >= 0 ? activeIndex : 0}
        draggable={false}
        onClick={(index) => {
          const tab = tabs[index];
          if (tab) onChange(tab.key);
        }}
      >
        {tabs.map((t) => (
          <TabItem
            key={t.key}
            title={t.label}
            titleExtraContent={<span className="stab-count">{t.count}</span>}
          />
        ))}
      </Tab>
    </div>
  );
}
