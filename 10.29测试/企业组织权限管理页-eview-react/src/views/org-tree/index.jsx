import { useMemo, useState } from "react";
import { IconPlusIcIctTree, IconPlusIcPublicInfo, IconPlusIcPublicSearch } from '@hui/icon-plus';
import Tree from "@nce/eview-react/Tree";
import Badge from "@nce/eview-react/Badge";
import TextField from "@/shared/TextField";
import { useApp } from "../../context.jsx";
import { orgTreeData, orgNodeMap } from "../../mock/organization.js";
import { membersByDept } from "../../mock/members.js";

import "./index.css";

// 宸︿晶缁勭粐鏍?鈥?4 灞傜粨鏋勩€佽妭鐐瑰甫浜烘暟 Badge銆佹悳绱㈠彲杩囨护
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

// 閫掑綊鏋勫缓 antd treeData锛歵itle 鑷畾涔変负銆屾枃鏈?+ Badge銆?function buildTreeData(nodes, kw, expandedKeys) {
  return nodes.map((n) => {
    const directCount = (membersByDept[n.key] || []).length;
    const hasChild = n.children && n.children.length > 0;
    // 瀛愭爲浜烘暟锛堝寘鍚墍鏈夊悗浠ｇ洿鎺ュ綊灞烇級
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
          content={totalCount}
          max={999}
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
      id: n.key,
      text: titleEl,
      children: hasChild ? buildTreeData(n.children, kw, expandedKeys) : undefined,
    };
  });
}

// 杩囨护鏍?鈥?淇濈暀鍛戒腑鑺傜偣鎴栧惈鍛戒腑鍚庝唬鐨勮妭鐐?function filterTree(nodes, kw) {
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

// 鏀堕泦鍛戒腑璺緞涓婃墍鏈夐渶瑕佸睍寮€鐨勭鍏?key
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

  // 榛樿灞曞紑锛氭牴 + 鍏ㄩ儴浜嬩笟閮?+ 鎶€鏈爺鍙戜簨涓氶儴鐨勯儴闂?  const filtered = useMemo(() => filterTree(orgTreeData, search.trim()), [search]);
  const treeData = useMemo(() => buildTreeData(filtered, search.trim(), expandedKeys), [filtered, search, expandedKeys]);

  // 鎼滅储鏃惰嚜鍔ㄥ睍寮€鍛戒腑璺緞
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
          <IconPlusIcIctTree iconSize="1rem" iconColor={['currentcolor']} />
          缁勭粐鏋舵瀯
        </h3>
        <span className="org-tree__path" title={currentDeptPath}>{currentDeptPath}</span>
      </div>
      <div className="org-tree__search">
        <TextField
          placeholder="鎼滅储閮ㄩ棬鎴栧皬缁勫悕绉?
          value={search}
          onChange={(value) => setSearch(value)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        />
      </div>
      <div className="org-tree__body">
        {filtered.length === 0 ? (
          <div className="org-tree__empty">
            <IconPlusIcPublicSearch iconSize="1.5rem" iconColor={['var(--on-surface-variant)']} />
            <span>鏈壘鍒板尮閰嶇殑閮ㄩ棬</span>
          </div>
        ) : (
          <Tree
            nodeKey="id"
            enableMultiSelect={false}
            data={treeData}
            expandedKeys={effectiveExpandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            selectedKeys={[selectedDeptKey]}
            onSelect={(keys) => onSelect(keys)}
            className="org-tree__ant"
          />
        )}
      </div>
      <div className="org-tree__foot">
        <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
        <span>鍏?33 涓妭鐐?路 4 灞傜骇 路 鍚?2 涓簨涓氶儴鐩村睘宀椾綅</span>
      </div>
    </div>
  );
}
