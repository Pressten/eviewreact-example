import { useState } from "react";
import { IconPlusIcPublicFunnel } from '@hui/icon-plus';
import Tree from "@nce/eview-react/Tree";
import Toggle from "@nce/eview-react/Toggle";
import { treeData } from "../../mock/tree.jsx";
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
        <IconPlusIcPublicFunnel iconSize="0.875rem" iconColor={['currentcolor']} className="asset-tree-filter" title="筛选" />
      </header>

      <div className="asset-tree-options">
        <div className="switch-row">
          <span className="switch-label">显示多选框</span>
          <Toggle toggled={showCheckbox} onToggle={setShowCheckbox} data={[false, true]} />
        </div>
        <div className="switch-row">
          <span className="switch-label">自动展开父节点</span>
          <Toggle toggled={autoExpand} onToggle={setAutoExpand} data={[false, true]} />
        </div>
      </div>

      <div className="asset-tree-body">
        <Tree
          data={treeData}
          nodeKey="id"
          enableMultiSelect={false}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          checkedKeys={checkedKeys}
          enableCheckbox={showCheckbox}
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
