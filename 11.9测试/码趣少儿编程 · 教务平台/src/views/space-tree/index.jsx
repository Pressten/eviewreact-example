import { useState } from "react";
import { Tree, Dropdown, Input, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { treeRaw } from "../../mock/drive.js";
import "./index.css";

const NODE_ACTIONS = [
  { key: "rename", label: "重命名", icon: "pencil" },
  { key: "move", label: "移动", icon: "move" },
  { type: "divider" },
  { key: "delete", label: "删除", icon: "trash-2", danger: true },
];

function NodeTitle({ node, selected, onAction }) {
  const actionMenu = {
    items: NODE_ACTIONS,
    onClick: ({ key }) => onAction(node, key),
  };
  return (
    <div className={`tree-node${selected ? " tree-node--active" : ""}`}>
      <span className="tree-node-name">
        {node.shared && (
          <span className="tree-shared" title="共享空间">
            <Icon name="users" size="0.75rem" />
          </span>
        )}
        <span className="tree-name-text">{node.name}</span>
      </span>
      <span className="tree-node-meta">
        <span className="tree-count">{node.count}</span>
        <Dropdown menu={actionMenu} trigger={["click"]} placement="bottomRight">
          <span
            className="tree-node-more"
            onClick={(e) => e.stopPropagation()}
            title="更多操作"
          >
            <Icon name="ellipsis" size="0.875rem" />
          </span>
        </Dropdown>
      </span>
    </div>
  );
}

function buildTreeData(nodes, selectedKey, onAction) {
  return nodes.map((n) => {
    const hasChildren = n.children && n.children.length;
    return {
      key: n.key,
      title: <NodeTitle node={n} selected={n.key === selectedKey} onAction={onAction} />,
      icon: (
        <Icon name={hasChildren ? "folder" : "folder-open"} size="0.875rem" color={n.shared ? "#0067D1" : "#777777"} />
      ),
      children: hasChildren ? buildTreeData(n.children, selectedKey, onAction) : undefined,
    };
  });
}

export default function SpaceTree({ selectedKey, onSelect, onNodeAction }) {
  const [expandedKeys, setExpandedKeys] = useState([
    "company", "company-report", "dept", "dept-rd", "project", "proj-park",
  ]);
  const [filter, setFilter] = useState("");

  const handleAction = (node, action) => {
    if (action === "rename") message.info(`重命名「${node.name}」`);
    else if (action === "move") message.info(`移动「${node.name}」到其他空间`);
    else if (action === "delete") onNodeAction(node, action);
  };

  const treeData = buildTreeData(treeRaw, selectedKey, handleAction);

  return (
    <aside className="space-tree">
      <div className="space-tree-head">
        <span className="space-tree-title">
          <Icon name="folder-tree" size="1rem" />
          文档空间
        </span>
        <button className="icon-btn-mini" title="刷新" onClick={() => message.success("目录已刷新")}>
          <Icon name="rotate-cw" size="0.875rem" />
        </button>
      </div>

      <div className="space-tree-search">
        <Input
          size="small"
          placeholder="搜索目录"
          allowClear
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          suffix={<Icon name="search" size="0.75rem" color="#AEAEAE" />}
        />
      </div>

      <div className="space-tree-body">
        <Tree
          treeData={treeData}
          selectedKeys={selectedKey ? [selectedKey] : []}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          onSelect={(keys) => onSelect(keys[0] || null)}
          showLine={{ showLeafIcon: false }}
          blockNode
        />
      </div>
    </aside>
  );
}
