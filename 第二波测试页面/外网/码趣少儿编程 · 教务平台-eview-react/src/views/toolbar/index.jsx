import { useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicClock, IconPlusIcPublicPlus, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicListBullet, IconPlusIcPublicDashboard, IconPlusIcPublicFolder, IconPlusIcPublicTxtFileTextured, IconPlusIcPublicExcleFileTextured, IconPlusIcPublicPowerPointFileTextured, IconPlusIcPublicUpload, IconPlusIcPublicHome, IconPlusIcPublicSetting } from '@hui/icon-plus';
import Crumbs from "@/shared/Crumbs";
import SelectCard from "@nce/eview-react/SelectCard";
import Button from "@nce/eview-react/Button";
import "./index.css";

const VIEW_OPTIONS = [
  { text: <span className="seg-opt"><IconPlusIcPublicListBullet iconSize="0.875rem" iconColor={['currentcolor']} />列表</span>, value: "list" },
  { text: <span className="seg-opt"><IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} />网格</span>, value: "grid" },
];

const SORT_OPTIONS = [
  { key: "name", label: "名称", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "size", label: "大小", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "updateTime", label: "更新时间", icon: <IconPlusIcPublicClock iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

const NEW_OPTIONS = [
  { key: "folder", icon: <IconPlusIcPublicFolder iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建文件夹" },
  { key: "doc", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建文档" },
  { divider: true, key: "d1" },
  { key: "sheet", icon: <IconPlusIcPublicExcleFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建表格" },
  { key: "slide", icon: <IconPlusIcPublicPowerPointFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建演示" },
  { divider: true, key: "d2" },
  { key: "upload", icon: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />, label: "上传文件" },
];

export default function Toolbar({
  breadcrumb,
  viewMode,
  onViewChange,
  sortField,
  onSortChange,
  onBreadcrumb,
  onNew,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const crumbItems = [
    {
      title: (
        <span className="crumb-link">
          <IconPlusIcPublicHome iconSize="0.875rem" iconColor={['currentcolor']} />
          我的文件
        </span>
      ),
      url: "root",
    },
    ...breadcrumb.map((node, i) => ({
      title: <span className={i === breadcrumb.length - 1 ? "crumb-current" : "crumb-link"}>{node.name}</span>,
      url: i === breadcrumb.length - 1 ? null : node.key,
    })),
  ];

  const handleCrumbClick = (data, event) => {
    event?.preventDefault?.();
    if (!data.url || data.url === "root") onBreadcrumb(null);
    else onBreadcrumb(data.url);
  };

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortField)?.label || "排序";

  const renderMenuItem = (o, onSelect) =>
    o.divider ? (
      <li key={o.key} className="more-menu__divider" />
    ) : (
      <li
        key={o.key}
        className={`more-menu__item${o.key === sortField ? " is-selected" : ""}`}
        onClick={() => { onSelect(o.key); setSortOpen(false); setNewOpen(false); }}
      >
        {o.icon ? o.icon : null}
        <span>{o.label}</span>
      </li>
    );

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Crumbs data={crumbItems} onClick={handleCrumbClick} />
      </div>

      <div className="toolbar-right">
        <SelectCard
          data={VIEW_OPTIONS}
          value={viewMode}
          onChange={(v) => onViewChange(v)}
        />

        <span
          className="tool-dropdown"
          style={{ position: "relative", display: "inline-flex" }}
          onClick={(e) => { e.stopPropagation(); setSortOpen((o) => !o); }}
          onBlur={() => setSortOpen(false)}
          tabIndex={0}
        >
          <button type="button" className="tool-btn" title="排序方式">
            <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />
            <span>{sortLabel}</span>
            <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['#777777']} />
          </button>
          {sortOpen ? (
            <ul className="more-menu__popover" onClick={(e) => e.stopPropagation()}>
              {SORT_OPTIONS.map((o) => renderMenuItem(o, onSortChange))}
            </ul>
          ) : null}
        </span>

        <span
          className="tool-dropdown"
          style={{ position: "relative", display: "inline-flex" }}
          onClick={(e) => { e.stopPropagation(); setNewOpen((o) => !o); }}
          onBlur={() => setNewOpen(false)}
          tabIndex={0}
        >
          <Button status="primary" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="新建" />
          {newOpen ? (
            <ul className="more-menu__popover" onClick={(e) => e.stopPropagation()}>
              {NEW_OPTIONS.map((o) => renderMenuItem(o, onNew))}
            </ul>
          ) : null}
        </span>
      </div>
    </div>
  );
}
