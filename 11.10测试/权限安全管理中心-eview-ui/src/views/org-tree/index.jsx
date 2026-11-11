import { useMemo, useState } from "react";
import Tree from "@cloudsop/eview-ui/Tree";
import TextField from "@cloudsop/eview-ui/TextField";
import Icon from "@/shared/Icon";
import AppBadge from "@/shared/AppBadge";
import { useApp } from "../../context.jsx";
import { ORG_INFO, DEPTS, TEAM_INDEX, ROOT_NODE_KEY } from "../../mock/org.js";
import "./index.css";

export default function OrgTree() {
  const { members, selectedDeptId, setSelectedDeptId } = useApp();
  const [query, setQuery] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([ROOT_NODE_KEY]);

  // 人数统计：与成员数据实时一致
  const counts = useMemo(() => {
    const team = {};
    const dept = {};
    let total = 0;
    members.forEach((m) => {
      const info = TEAM_INDEX[m.teamId];
      if (!info) return;
      total += 1;
      team[m.teamId] = (team[m.teamId] || 0) + 1;
      dept[info.deptId] = (dept[info.deptId] || 0) + 1;
    });
    return { team, dept, total };
  }, [members]);

  // Tree→Tree：treeData→data；节点 title→text、key→id（嵌套逐层）
  const treeData = useMemo(() => {
    const kw = query.trim();
    const match = (name) => !kw || name.includes(kw);
    const deptNodes = [];
    DEPTS.forEach((d) => {
      const teamNodes = d.teams
        .filter((t) => match(t.teamName) || match(d.deptName))
        .map((t) => ({
          id: t.teamId,
          text: (
            <span className="tree-node-label">
              <span className="tree-node-name">{t.teamName}</span>
              <AppBadge count={counts.team[t.teamId] || 0} max={999} color="var(--primary)" />
            </span>
          ),
        }));
      if (teamNodes.length === 0) return;
      deptNodes.push({
        id: d.deptId,
        text: (
          <span className="tree-node-label">
            <span className="tree-node-name">{d.deptName}</span>
            <AppBadge count={counts.dept[d.deptId] || 0} max={999} color="var(--primary)" />
          </span>
        ),
        children: teamNodes,
      });
    });
    return [
      {
        id: ROOT_NODE_KEY,
        text: (
          <span className="tree-node-label root">
            <Icon name="building-2" size="0.875rem" className="tree-org-icon" />
            <span className="tree-node-name">{ORG_INFO.orgName}</span>
            <AppBadge count={counts.total} max={999} color="var(--primary)" />
          </span>
        ),
        children: deptNodes,
      },
    ];
  }, [query, counts]);

  // 搜索时自动展开全部可见节点
  const effectiveExpanded = useMemo(() => {
    if (!query.trim()) return expandedKeys;
    const keys = [ROOT_NODE_KEY];
    treeData.forEach((root) =>
      (root.children || []).forEach((d) => {
        keys.push(d.id);
        (d.children || []).forEach((t) => keys.push(t.id));
      })
    );
    return keys;
  }, [query, expandedKeys, treeData]);

  const selectedName = useMemo(() => {
    if (!selectedDeptId) return "";
    if (selectedDeptId === ROOT_NODE_KEY) return ORG_INFO.orgName;
    const dept = DEPTS.find((d) => d.deptId === selectedDeptId);
    if (dept) return dept.deptName;
    const teamInfo = TEAM_INDEX[selectedDeptId];
    return teamInfo ? teamInfo.teamName : "";
  }, [selectedDeptId]);

  const maxDeptCount = Math.max(1, ...DEPTS.map((d) => counts.dept[d.deptId] || 0));

  return (
    <aside className="pc-card org-panel">
      <div className="section-head">
        <span className="section-icon"><Icon name="network" size="1.125rem" /></span>
        <div>
          <div className="section-title">组织架构</div>
          <div className="section-sub">{counts.total} 名成员 · 6 个部门 · 15 个小组</div>
        </div>
      </div>
      {/* Input→TextField：onChange(value1, value2, event) 首参是值；无 allowClear/suffix（API 表无，不写）。
          原 suffix 搜索图标用外层 div 同级定位保留视觉。 */}
      <div className="tree-search-wrap">
        <TextField
          className="tree-search"
          value={query}
          placeholder="搜索部门或小组名称"
          onChange={(value) => setQuery(value)}
        />
        <Icon name="search" size="0.875rem" className="search-icon" />
      </div>
      <div className="tree-scroll">
        <Tree
          className="org-tree"
          data={treeData}
          expandedKeys={effectiveExpanded}
          selectedKeys={selectedDeptId ? [selectedDeptId] : []}
          enableMultiSelect={false}
          onExpand={(keys) => setExpandedKeys(keys)}
          onSelect={(keys) => setSelectedDeptId(keys[0] || null)}
        />
      </div>
      <div className="dept-stats">
        <div className="dept-stats-title">部门人数分布</div>
        {DEPTS.map((d) => {
          const count = counts.dept[d.deptId] || 0;
          return (
            <div
              className={"dept-stat-row" + (selectedDeptId === d.deptId ? " active" : "")}
              key={d.deptId}
              onClick={() => setSelectedDeptId(selectedDeptId === d.deptId ? null : d.deptId)}
            >
              <span className="dept-stat-name" title={d.deptName}>{d.deptName}</span>
              <span className="dept-stat-bar">
                <span className="dept-stat-fill" style={{ width: `${(count / maxDeptCount) * 100}%` }} />
              </span>
              <span className="dept-stat-count">{count}</span>
            </div>
          );
        })}
      </div>
      <div className="tree-footer">
        {selectedDeptId ? (
          <span className="tree-selected">
            <Icon name="funnel" size="0.875rem" className="filter-icon" />
            已筛选：{selectedName}
            <a onClick={() => setSelectedDeptId(null)}>清除</a>
          </span>
        ) : (
          <span className="tree-hint">点击部门 / 小组节点，联动筛选右侧角色成员列表</span>
        )}
      </div>
    </aside>
  );
}
