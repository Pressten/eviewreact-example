import { useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicSearch, IconPlusIcCarUser, IconPlusIcPublicFolder, IconPlusIcIctTree, IconPlusIcCarRotateRight } from '@hui/icon-plus';
import SimpleTree from "../../components/simple-tree/index.jsx";
import SimpleDropdown from "../../components/simple-dropdown/index.jsx";
import TextField from "@/shared/TextField";
import DivMessage from "@nce/eview-react/DivMessage";
import { treeRaw } from "../../mock/drive.js";
import "./index.css";

const NODE_ACTIONS = [
  { key: "rename", label: "重命名", icon: "pencil" },
  { key: "move", label: "移动", icon: "move" },
  { type: "divider" },
  { key: "delete", label: "删除", icon: "trash-2", danger: true },
];

function NodeTitle({ node, selected, onAction }) {
  const actionItems = NODE_ACTIONS;
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
        <SimpleDropdown items={actionItems} onSelect={(key) => onAction(node, key)} placement="bottomRight">
          <span
            className="tree-node-more"
            onClick={(e) => e.stopPropagation()}
            title="更多操作"
          >
            <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
          </span>
        </SimpleDropdown>
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
        <IconPlusIcPublicFolder iconSize="0.875rem" iconColor={[n.shared ? "#0067D1" : "#777777"]} />
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
  const [notice, setNotice] = useState(null);

  const handleAction = (node, action) => {
    if (action === "rename") setNotice({ type: "info", text: `重命名「${node.name}」`, key: Date.now() });
    else if (action === "move") setNotice({ type: "info", text: `移动「${node.name}」到其他空间`, key: Date.now() });
    else if (action === "delete") onNodeAction(node, action);
  };

  const treeData = buildTreeData(treeRaw, selectedKey, handleAction);

  return (
    <aside className="space-tree">
      {notice && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={notice.type !== "error"}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
      <div className="space-tree-head">
        <span className="space-tree-title">
          <IconPlusIcIctTree iconSize="1rem" iconColor={['currentcolor']} />
          文档空间
        </span>
        <button className="icon-btn-mini" title="刷新" onClick={() => setNotice({ type: "success", text: "目录已刷新", key: Date.now() })}>
          <IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} />
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
        <SimpleTree
          treeData={treeData}
          selectedKeys={selectedKey ? [selectedKey] : []}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          onSelect={(key) => onSelect(key || null)}
        />
      </div>
    </aside>
  );
}
