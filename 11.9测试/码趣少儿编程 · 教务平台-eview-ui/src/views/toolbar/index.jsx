import Crumbs from "eview-ui/Crumbs";
import Dropdown from "eview-ui/Dropdown";
import SelectCard from "eview-ui/SelectCard";
import Button from "eview-ui/Button";
import Icon from "@/shared/Icon";
import "./index.css";

const VIEW_OPTIONS = [
  { text: (<span className="seg-opt"><Icon name="list" size="0.875rem" />列表</span>), value: "list" },
  { text: (<span className="seg-opt"><Icon name="layout-grid" size="0.875rem" />网格</span>), value: "grid" },
];

const SORT_OPTIONS = [
  { key: "name", label: "名称", icon: "arrow-down-a-z" },
  { key: "size", label: "大小", icon: "arrow-up-down" },
  { key: "updateTime", label: "更新时间", icon: "clock" },
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
  const crumbData = [
    {
      title: (
        <a className="crumb-link" onClick={(e) => { e.preventDefault(); onBreadcrumb(null); }} href="#">
          <Icon name="house" size="0.875rem" />
          我的文件
        </a>
      ),
    },
    ...breadcrumb.map((node, i) => ({
      title: i === breadcrumb.length - 1 ? (
        <span className="crumb-current">{node.name}</span>
      ) : (
        <a className="crumb-link" onClick={(e) => { e.preventDefault(); onBreadcrumb(node.key); }} href="#">
          {node.name}
        </a>
      ),
    })),
  ];

  const sortOverlay = (
    <div className="sort-menu">
      {SORT_OPTIONS.map((o) => (
        <div
          key={o.key}
          className={"sort-menu-item" + (sortField === o.key ? " is-active" : "")}
          onClick={() => onSortChange(o.key)}
        >
          <Icon name={o.icon} size="0.875rem" />
          <span>{o.label}</span>
        </div>
      ))}
    </div>
  );

  const newOverlay = (
    <div className="new-menu">
      <div className="new-menu-item" onClick={() => onNew("folder")}>
        <Icon name="folder" size="0.875rem" /> <span>新建文件夹</span>
      </div>
      <div className="new-menu-item" onClick={() => onNew("doc")}>
        <Icon name="file-text" size="0.875rem" /> <span>新建文档</span>
      </div>
      <div className="new-menu-divider" />
      <div className="new-menu-item" onClick={() => onNew("sheet")}>
        <Icon name="file-spreadsheet" size="0.875rem" /> <span>新建表格</span>
      </div>
      <div className="new-menu-item" onClick={() => onNew("slide")}>
        <Icon name="presentation" size="0.875rem" /> <span>新建演示</span>
      </div>
      <div className="new-menu-divider" />
      <div className="new-menu-item" onClick={() => onNew("upload")}>
        <Icon name="upload" size="0.875rem" /> <span>上传文件</span>
      </div>
    </div>
  );

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortField)?.label || "排序";

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Crumbs data={crumbData} />
      </div>

      <div className="toolbar-right">
        <SelectCard
          data={VIEW_OPTIONS}
          value={viewMode}
          onChange={(v) => onViewChange(v)}
        />

        <Dropdown overlay={sortOverlay} trigger={["click"]}>
          <button className="tool-btn" title="排序方式">
            <Icon name="sliders-horizontal" size="0.875rem" />
            <span>{sortLabel}</span>
            <Icon name="chevron-down" size="0.75rem" color="#777777" />
          </button>
        </Dropdown>

        <Dropdown overlay={newOverlay} trigger={["click"]}>
          <Button status="primary">
            <Icon name="plus" size="0.875rem" />
            <span style={{ marginLeft: "0.25rem" }}>新建</span>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
