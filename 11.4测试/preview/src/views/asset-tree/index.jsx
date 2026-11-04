import { useState } from "react";
import { Tree, Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { treeData } from "../../mock/tree.js";
import "./index.css";

export default function AssetTree() {
  const [expandedKeys, setExpandedKeys] = useState(["east", "east-sh"]);
  const [selectedKeys, setSelectedKeys] = useState(["east-sh-a01"]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpand, setAutoExpand] = useState(true);
  const [showCheckbox, setShowCheckbox] = useState(true);

  const onSelect = (keys) => setSelectedKeys(keys);
  const onExpand = (keys) => {
    setExpandedKeys(keys);
    setAutoExpand(false);
  };
  const onCheck = (keys) => setCheckedKeys(keys);

  return (
    <section className="asset-tree">
      <header className="asset-tree-head">
        <h2 className="asset-tree-title">资源目录树</h2>
        <Icon name="funnel" size="0.875rem" title="筛选" className="asset-tree-filter" />
      </header>

      <div className="asset-tree-options">
        <div className="switch-row">
          <span className="switch-label">显示多选框</span>
          <Switch checked={showCheckbox} onChange={setShowCheckbox} />
        </div>
        <div className="switch-row">
          <span className="switch-label">自动展开父节点</span>
          <Switch checked={autoExpand} onChange={setAutoExpand} />
        </div>
      </div>

      <div className="asset-tree-body">
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          checkedKeys={checkedKeys}
          checkable={showCheckbox}
          autoExpandParent={autoExpand}
          onSelect={onSelect}
          onExpand={onExpand}
          onCheck={onCheck}
        />
      </div>

      <footer className="asset-tree-footer">
        <span className="asset-tree-hint">
          已选中 {selectedKeys.length} 个节点 · 勾选 {checkedKeys.length} 个资源
        </span>
      </footer>
    </section>
  );
}
