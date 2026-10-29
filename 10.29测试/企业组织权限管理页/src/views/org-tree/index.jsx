import { useMemo, useState } from "react";
import { Input, Tree, Badge } from "antd";
import { useApp } from "../../context.jsx";
import { orgTreeData, orgNodeMap } from "../../mock/organization.js";
import { membersByDept } from "../../mock/members.js";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// 左侧组织树 — 4 层结构、节点带人数 Badge、搜索可过滤
function highlightTitle(title, kw) {
  if (!kw) return title;
  const idx = title.indexOf(kw);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="org-tree__hit">{kw}</span>
      {title.slice(idx + kw.length)}
    </>
  );
}

// 递归构建 antd treeData：title 自定义为「文本 + Badge」
function buildTreeData(nodes, kw, expandedKeys) {
  return nodes.map((n) => {
    const directCount = (membersByDept[n.key] || []).length;
    const hasChild = n.children && n.children.length > 0;
    // 子树人数（包含所有后代直接归属）
    let totalCount = directCount;
    if (hasChild) {
      const sumChildren = (arr) => arr.reduce((acc, c) => {
        const cDirect = (membersByDept[c.key] || []).length;
        const cChildren = c.children ? sumChildren(c.children) : 0;
        return acc + cDirect + cChildren;
      }, 0);
      totalCount = directCount + sumChildren(n.children);
    }
    const titleEl = (
      <span className="org-tree__title">
        <span className="org-tree__title-text">{highlightTitle(n.title, kw)}</span>
        <Badge
          count={totalCount}
          overflowCount={999}
          className="org-tree__count"
          style={{
            backgroundColor: "var(--surface-variant)",
            color: "var(--on-surface-variant)",
            boxShadow: "none",
            fontSize: "0.6875rem",
            height: "1.0625rem",
            lineHeight: "1.0625rem",
            minWidth: "1.5rem",
            padding: "0 0.3125rem",
          }}
        />
      </span>
    );
    return {
      key: n.key,
      title: titleEl,
      icon: hasChild ? null : <Icon name="users" size="0.75rem" color="var(--on-surface-variant)" />,
      children: hasChild ? buildTreeData(n.children, kw, expandedKeys) : undefined,
    };
  });
}

// 过滤树 — 保留命中节点或含命中后代的节点
function filterTree(nodes, kw) {
  if (!kw) return nodes;
  const result = [];
  nodes.forEach((n) => {
    const self = n.title.includes(kw);
    const children = n.children ? filterTree(n.children, kw) : [];
    if (self || children.length > 0) {
      result.push({ ...n, children: children.length > 0 ? children : undefined });
    }
  });
  return result;
}

// 收集命中路径上所有需要展开的祖先 key
function collectExpandKeys(nodes, kw, acc = []) {
  nodes.forEach((n) => {
    const self = n.title.includes(kw);
    const children = n.children || [];
    const childHit = collectExpandKeys(children, kw, acc).length > 0;
    if ((self && children.length > 0) || childHit) acc.push(n.key);
  });
  return acc;
}

export default function OrgTree() {
  const { selectedDeptKey, selectDept, currentDeptPath } = useApp();
  const [search, setSearch] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([
    "org-root",
    "org-tech",
    "org-product",
    "org-market",
    "org-admin",
    "org-tech-rd",
    "org-tech-infra",
    "org-tech-qa",
  ]);

  // 默认展开：根 + 全部事业部 + 技术研发事业部的部门
  const filtered = useMemo(() => filterTree(orgTreeData, search.trim()), [search]);
  const treeData = useMemo(() => buildTreeData(filtered, search.trim(), expandedKeys), [filtered, search, expandedKeys]);

  // 搜索时自动展开命中路径
  const effectiveExpandedKeys = useMemo(() => {
    const kw = search.trim();
    if (!kw) return expandedKeys;
    const auto = [];
    collectExpandKeys(orgTreeData, kw, auto);
    return Array.from(new Set([...expandedKeys, ...auto]));
  }, [search, expandedKeys]);

  const onSelect = (keys) => {
    if (keys.length > 0) selectDept(keys[0]);
  };

  return (
    <div className="org-tree">
      <div className="org-tree__head">
        <h3 className="org-tree__title-label">
          <Icon name="folder-tree" size="1rem" />
          组织架构
        </h3>
        <span className="org-tree__path" title={currentDeptPath}>{currentDeptPath}</span>
      </div>
      <div className="org-tree__search">
        <Input
          allowClear
          placeholder="搜索部门或小组名称"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
        />
      </div>
      <div className="org-tree__body">
        {filtered.length === 0 ? (
          <div className="org-tree__empty">
            <Icon name="search-x" size="1.5rem" color="var(--on-surface-variant)" />
            <span>未找到匹配的部门</span>
          </div>
        ) : (
          <Tree
            blockNode
            showIcon
            treeData={treeData}
            expandedKeys={effectiveExpandedKeys}
            onExpand={setExpandedKeys}
            selectedKeys={[selectedDeptKey]}
            onSelect={onSelect}
            className="org-tree__ant"
          />
        )}
      </div>
      <div className="org-tree__foot">
        <Icon name="info" size="0.75rem" color="var(--on-surface-variant)" />
        <span>共 33 个节点 · 4 层级 · 含 2 个事业部直属岗位</span>
      </div>
    </div>
  );
}
