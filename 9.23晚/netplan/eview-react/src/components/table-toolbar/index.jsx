import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import { Icon } from "../../shared/icon.jsx";
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
          <SearchInput
            className="table-toolbar-search"
            value={searchValue}
            placeholder={searchPlaceholder || "搜索"}
            onChange={(value) => onSearchChange(value)}
            onClear={() => onSearchChange("")}
          />
        ) : null}
        {children}
        {selectedCount > 0 ? (
          <div className="table-toolbar-selection">
            <span className="table-toolbar-selection-text">
              已选 <strong>{selectedCount}</strong> 项
            </span>
            <Button status="text" text="取消选择" onClick={onClearSelection} />
          </div>
        ) : null}
      </div>
      <div className="table-toolbar-right">{actions}</div>
    </div>
  );
}
