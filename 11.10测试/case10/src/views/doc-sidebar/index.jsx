// Layer 4: 左侧栏 — 文档栏目 Menu（章节滚动定位）+ 接口目录树 Tree（资源分组、≥3 层）
import { useState, useEffect, useMemo } from "react";
import { Menu, Tree } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { buildTreeData } from "../../mock/api-registry.js";
import "./index.css";

const SECTION_ITEMS = [
  { key: "overview", icon: "book-open", label: "概述" },
  { key: "auth", icon: "key-round", label: "认证方式" },
  { key: "quickstart", icon: "rocket", label: "快速开始" },
  { key: "errors", icon: "circle-alert", label: "错误码" },
  { key: "apis", icon: "braces", label: "接口列表" },
  { key: "changelog", icon: "scroll-text", label: "更新日志" },
];

const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function DocSidebar() {
  const {
    versionApis,
    selectedApiId,
    setSelectedApiId,
    requestFocusApi,
    activeSection,
  } = useApp();

  // 目录树纯数据 → antd treeData（title 渲染在此层完成）
  const rawTree = useMemo(() => buildTreeData(versionApis), [versionApis]);

  const treeData = useMemo(
    () =>
      rawTree.map((group) => ({
        key: group.key,
        icon: <Icon name={group.icon} size="0.875rem" className="tree-group-icon" />,
        title: (
          <span className="tree-node-row">
            <span className="tree-node-name">{group.name}</span>
            <span className="tree-node-count">{group.count}</span>
          </span>
        ),
        children: group.children.map((sub) => ({
          key: sub.key,
          title: (
            <span className="tree-node-row">
              <span className="tree-node-name">{sub.name}</span>
              <span className="tree-node-count">{sub.count}</span>
            </span>
          ),
          children: sub.children.map((api) => ({
            key: api.key,
            isLeaf: true,
            title: (
              <span className="tree-leaf-row">
                <span className="tree-leaf-name">{api.name}</span>
                <span className={`tree-leaf-method tlm-${api.method.toLowerCase()}`}>
                  {api.method}
                </span>
              </span>
            ),
          })),
        })),
      })),
    [rawTree]
  );

  const [expandedKeys, setExpandedKeys] = useState([]);

  // 版本切换后重置为「展开全部分组」
  useEffect(() => {
    setExpandedKeys(rawTree.map((node) => node.key));
  }, [rawTree]);

  // 选中接口变化时，自动展开其父级链路（目录树联动）
  useEffect(() => {
    if (!selectedApiId) return;
    const api = versionApis.find((item) => item.apiId === selectedApiId);
    if (!api) return;
    setExpandedKeys((prev) => {
      const merged = new Set(prev);
      merged.add(`g:${api.group}`);
      merged.add(`s:${api.group}/${api.subgroup}`);
      return Array.from(merged);
    });
  }, [selectedApiId, versionApis]);

  const handleSelect = (keys) => {
    const key = keys[0];
    // 点击已选节点会触发取消选择 —— 忽略，保持选中态稳定
    if (!key) return;
    if (key.startsWith("a:")) {
      const apiId = key.slice(2);
      setSelectedApiId(apiId);
      requestFocusApi(apiId);
    } else {
      // 分组节点：滚动定位到接口列表
      scrollToSection("apis");
    }
  };

  return (
    <aside className="doc-sidebar">
      <div className="sidebar-menu">
        <Menu
          mode="inline"
          selectedKeys={[activeSection]}
          onClick={({ key }) => scrollToSection(key)}
          items={SECTION_ITEMS.map((item) => ({
            key: item.key,
            icon: <Icon name={item.icon} size="0.875rem" />,
            label: item.label,
          }))}
        />
      </div>
      <div className="tree-panel">
        <div className="tree-title">
          <Icon name="braces" size="0.75rem" />
          接口目录
        </div>
        <Tree
          className="api-tree"
          blockNode
          showIcon
          treeData={treeData}
          expandedKeys={expandedKeys}
          selectedKeys={selectedApiId ? [`a:${selectedApiId}`] : []}
          onExpand={(keys) => setExpandedKeys(keys)}
          onSelect={handleSelect}
        />
      </div>
    </aside>
  );
}
