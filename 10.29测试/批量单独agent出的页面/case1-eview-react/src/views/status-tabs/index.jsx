// Layer 4: ③ 状态页签 — Tab + 数量角标（切换联动、当前页签高亮）
// antd Tabs(items + activeKey + onChange) → eview Tab(children 驱动 + selectedIndex + onClick(index,title,event))
// Tab 是 index 受控，需 index↔key 桥接（title 是文案不可当 key）
import { Tab, TabItem } from "@nce/eview-react/Tab";
import "./index.css";

export default function StatusTabs({ tabs, active, onChange }) {
  const selectedIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === active)
  );

  return (
    <div className="status-tabs">
      <Tab
        selectedIndex={selectedIndex}
        draggable={false}
        onClick={(index, title, event) => {
          const t = tabs[index];
          if (t) onChange(t.key);
        }}
      >
        {tabs.map((t) => (
          <TabItem
            key={t.key}
            title={
              <span className="stab">
                {t.label}
                <span className="stab-count">{t.count}</span>
              </span>
            }
          />
        ))}
      </Tab>
    </div>
  );
}
