import { Breadcrumb, Dropdown, Segmented, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const VIEW_OPTIONS = [
  { label: <span className="seg-opt"><Icon name="list" size="0.875rem" />列表</span>, value: "list" },
  { label: <span className="seg-opt"><Icon name="layout-grid" size="0.875rem" />网格</span>, value: "grid" },
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
  const crumbItems = [
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

  const sortMenu = {
    items: SORT_OPTIONS.map((o) => ({
      key: o.key,
      icon: <Icon name={o.icon} size="0.875rem" />,
      label: o.label,
    })),
    onClick: ({ key }) => onSortChange(key),
    selectable: true,
    selectedKeys: [sortField],
  };

  const newMenu = {
    items: [
      { key: "folder", icon: <Icon name="folder" size="0.875rem" />, label: "新建文件夹" },
      { key: "doc", icon: <Icon name="file-text" size="0.875rem" />, label: "新建文档" },
      { type: "divider" },
      { key: "sheet", icon: <Icon name="file-spreadsheet" size="0.875rem" />, label: "新建表格" },
      { key: "slide", icon: <Icon name="presentation" size="0.875rem" />, label: "新建演示" },
      { type: "divider" },
      { key: "upload", icon: <Icon name="upload" size="0.875rem" />, label: "上传文件" },
    ],
    onClick: ({ key }) => onNew(key),
  };

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortField)?.label || "排序";

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Breadcrumb items={crumbItems} />
      </div>

      <div className="toolbar-right">
        <Segmented
          options={VIEW_OPTIONS}
          value={viewMode}
          onChange={(v) => onViewChange(v)}
        />

        <Dropdown menu={sortMenu} trigger={["click"]}>
          <button className="tool-btn" title="排序方式">
            <Icon name="sliders-horizontal" size="0.875rem" />
            <span>{sortLabel}</span>
            <Icon name="chevron-down" size="0.75rem" color="#777777" />
          </button>
        </Dropdown>

        <Dropdown menu={newMenu} trigger={["click"]}>
          <Button type="primary" icon={<Icon name="plus" size="0.875rem" />}>
            新建
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
