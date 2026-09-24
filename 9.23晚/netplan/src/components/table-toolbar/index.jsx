import { Button, Input } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3: 表格工具区（搜索 + 已选提示 + 操作按钮）
export default function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  selectedCount,
  onClearSelection,
  actions,
  children,
}) {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar-left">
        {onSearchChange ? (
          <Input
            className="table-toolbar-search"
            allowClear
            value={searchValue}
            placeholder={searchPlaceholder || "搜索"}
            suffix={<Icon name="search" size={14} />}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        ) : null}
        {children}
        {selectedCount > 0 ? (
          <div className="table-toolbar-selection">
            <span className="table-toolbar-selection-text">
              已选 <strong>{selectedCount}</strong> 项
            </span>
            <Button type="link" onClick={onClearSelection}>
              取消选择
            </Button>
          </div>
        ) : null}
      </div>
      <div className="table-toolbar-right">{actions}</div>
    </div>
  );
}
