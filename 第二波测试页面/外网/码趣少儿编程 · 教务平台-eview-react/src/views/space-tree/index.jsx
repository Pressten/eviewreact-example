import { useState } from "react";
import { IconPlusIcDigitalPowerDpMove, IconPlusIcPublicChevronDown, IconPlusIcPublicEllipsis, IconPlusIcPublicRightArrow, IconPlusIcPublicSearch, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicTrash, IconPlusIcCarUser, IconPlusIcPublicFolder, IconPlusIcPublicFolderFile, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import DivMessage from "@nce/eview-react/DivMessage";
import { treeRaw } from "../../mock/drive.jsx";
import "./index.css";

const NODE_ACTIONS = [
  { key: "rename", label: "重命名", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "move", label: "移动", icon: <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { divider: true, key: "d1" },
  { key: "delete", label: "删除", icon: <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

// 手写下拉菜单（替代 antd Dropdown）
function NodeMoreMenu({ node, onAction }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tree-node-more"
      onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      title="更多操作"
      style={{ position: "relative", display: "inline-flex", cursor: "pointer" }}
    >
      <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
      {open ? (
        <ul className="more-menu__popover" onClick={(e) => e.stopPropagation()}>
          {NODE_ACTIONS.map((it) =>
            it.divider ? (
              <li key={it.key} className="more-menu__divider" />
            ) : (
              <li
                key={it.key}
                className={`more-menu__item${it.danger ? " more-menu__item--danger" : ""}`}
                onClick={() => { onAction(node, it.key); setOpen(false); }}
              >
                {it.icon}
                <span>{it.label}</span>
              </li>
            )
          )}
        </ul>
      ) : null}
    </span>
  );
}

function NodeTitle({ node, selected, onAction }) {
  return (
    <div className={`tree-node${selected ? " tree-node--active" : ""}`}>
      <span className="tree-node-name">
        {node.shared && (
          <span className="tree-shared" title="共享空间">
            <IconPlusIcCarUser iconSize="0.75rem" iconColor={['currentcolor']} />
          </span>
        )}
        <span className="tree-name-text">{node.name}</span>
      </span>
      <span className="tree-node-meta">
        <span className="tree-count">{node.count}</span>
        <NodeMoreMenu node={node} onAction={onAction} />
      </span>
    </div>
  );
}

// 手写递归树（替代 antd Tree）：展开/选择语义保留
function TreeNode({ node, selectedKey, expandedKeys, onToggle, onSelect, onAction, depth }) {
  const hasChildren = node.children && node.children.length;
  const isExpanded = expandedKeys.has(node.key);
  const isSelected = node.key === selectedKey;
  return (
    <div className="tree-branch">
      <div
        className={"tree-branch__row" + (isSelected ? " is-selected" : "")}
        style={{ paddingLeft: `${depth * 0.9 + 0.25}rem` }}
        onClick={() => onSelect(node.key)}
      >
        <span
          className="tree-branch__toggle"
          onClick={(e) => { e.stopPropagation(); onToggle(node.key); }}
        >
          {hasChildren ? (
            isExpanded ? <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['#777777']} /> : <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['#777777']} />
          ) : (
            <span className="tree-branch__leaf-dot" />
          )}
        </span>
        {hasChildren ? (isExpanded ? <IconPlusIcPublicFolderFile iconSize="0.875rem" iconColor={[node.shared ? "#0067D1" : "#777777"]} /> : <IconPlusIcPublicFolder iconSize="0.875rem" iconColor={[node.shared ? "#0067D1" : "#777777"]} />) : <IconPlusIcPublicFolderFile iconSize="0.875rem" iconColor={[node.shared ? "#0067D1" : "#777777"]} />}
        <NodeTitle node={node} selected={isSelected} onAction={onAction} />
      </div>
      {hasChildren && isExpanded ? (
        <div className="tree-branch__children">
          {node.children.map((c) => (
            <TreeNode
              key={c.key}
              node={c}
              selectedKey={selectedKey}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
              onAction={onAction}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SpaceTree({ selectedKey, onSelect, onNodeAction }) {
  const [expandedKeys, setExpandedKeys] = useState(() => new Set([
    "company", "company-report", "dept", "dept-rd", "project", "proj-park",
  ]));
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState(null);

  const handleToggle = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAction = (node, action) => {
    if (action === "rename") setNotice({ type: "default", text: `重命名「${node.name}」` });
    else if (action === "move") setNotice({ type: "default", text: `移动「${node.name}」到其他空间` });
    else if (action === "delete") onNodeAction(node, action);
  };

  return (
    <aside className="space-tree">
      <div className="space-tree-head">
        <span className="space-tree-title">
          <IconPlusIcPublicFolder iconSize="1rem" iconColor={['currentcolor']} />
          文档空间
        </span>
        <button className="icon-btn-mini" title="刷新" onClick={() => setNotice({ type: "success", text: "目录已刷新" })}>
          <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />
        </button>
      </div>

      <div className="space-tree-search">
        <TextField
          size="small"
          placeholder="搜索目录"
          value={filter}
          onChange={(value) => setFilter(value)}
          suffix={<IconPlusIcPublicSearch iconSize="0.75rem" iconColor={['#AEAEAE']} />}
        />
      </div>

      <div className="space-tree-body">
        {treeRaw.map((n) => (
          <TreeNode
            key={n.key}
            node={n}
            selectedKey={selectedKey}
            expandedKeys={expandedKeys}
            onToggle={handleToggle}
            onSelect={onSelect}
            onAction={handleAction}
            depth={0}
          />
        ))}
      </div>

      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.text}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </aside>
  );
}
