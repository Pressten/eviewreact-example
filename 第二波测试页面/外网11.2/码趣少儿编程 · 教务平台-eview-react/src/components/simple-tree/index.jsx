import { useState } from "react";
import "./index.css";

function TreeNode({ node, depth, selectedKey, expandedKeys, onToggleExpand, onSelect }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedKeys.has(node.key);
  const isSelected = node.key === selectedKey;

  return (
    <div className="simple-tree__node">
      <div
        className={`simple-tree__row${isSelected ? " is-selected" : ""}`}
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        onClick={() => onSelect(node.key)}
      >
        {hasChildren ? (
          <span className="simple-tree__arrow" onClick={(e) => { e.stopPropagation(); onToggleExpand(node.key); }}>
            {isExpanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="simple-tree__arrow simple-tree__arrow--leaf">•</span>
        )}
        {node.icon && <span className="simple-tree__icon">{node.icon}</span>}
        <span className="simple-tree__title">{node.title}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="simple-tree__children">
          {node.children.map((child) => (
            <TreeNode
              key={child.key}
              node={child}
              depth={depth + 1}
              selectedKey={selectedKey}
              expandedKeys={expandedKeys}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SimpleTree({ treeData, selectedKeys = [], expandedKeys: controlledExpandedKeys, onExpand, onSelect }) {
  const [internalExpanded, setInternalExpanded] = useState(() => {
    const set = new Set(controlledExpandedKeys || []);
    return set;
  });

  const expandedKeys = internalExpanded;

  const handleToggleExpand = (key) => {
    const next = new Set(expandedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setInternalExpanded(next);
    if (onExpand) onExpand(Array.from(next));
  };

  const handleSelect = (key) => {
    if (onSelect) onSelect(key);
  };

  const selectedKey = selectedKeys[0];

  return (
    <div className="simple-tree">
      {treeData.map((node) => (
        <TreeNode
          key={node.key}
          node={node}
          depth={0}
          selectedKey={selectedKey}
          expandedKeys={expandedKeys}
          onToggleExpand={handleToggleExpand}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
