import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";
import { orgNodeMap, getDeptPath } from "./mock/organization.js";
import { memberList, membersByDept, roleConfig } from "./mock/members.js";
import { permissionGroups, getDefaultPermissions } from "./mock/permissions.js";
import { auditLogs } from "./mock/audit-logs.js";

// Layer 1: 全局状态 — 主题模式 + 业务状态
// 暗色三轨切换：html.dark（token 四层翻转）+ body.aui3_1_dark（eview 暗色 CSS）；
// aui3_1_dark.css 由 main.jsx import。eview 组件暗色由 aui3_1_dark.css 覆盖。

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // 暗色三轨切换：html.dark（token 四层翻转）+ body.aui3_1_dark（eview 暗色 CSS）；
  // aui3_1_dark.css 由 main.jsx import。
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
  }, [isDark]);

  // 通知浮层 — DivMessage 无命令式 API，用独立 state + createPortal 到 document.body
  // （抽离渲染树，避免通知触发父组件重渲染导致输入组件失焦，硬约束#10）
  const [notice, setNotice] = useState(null);
  const notify = useCallback((opts) => {
    setNotice({
      key: `N${Date.now()}`,
      type: opts.type || "default",
      title: opts.title,
      text: opts.text,
      duration: opts.duration != null ? opts.duration : 4500,
      onAction: opts.onAction,
      actionLabel: opts.actionLabel,
    });
  }, []);

  // 视角切换：管理员 / 审计员
  const [viewMode, setViewMode] = useState("admin");

  // 当前选中的部门节点（默认技术研发部）
  const [selectedDeptKey, setSelectedDeptKey] = useState("org-tech-rd");

  // 当前选中的成员 id（用于权限面板与详情抽屉联动）
  const [selectedMemberId, setSelectedMemberId] = useState("M002");

  // 详情抽屉
  const [drawerMemberId, setDrawerMemberId] = useState(null);

  // 模态弹窗
  const [modal, setModal] = useState(null); // null | "invite" | "department" | "transfer"

  // 成员行多选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 权限覆写：每个成员相对其角色默认权限的增减
  // { [memberId]: Set<permKey> }（仅记录当前已应用的完整权限集快照）
  const [permissionMap, setPermissionMap] = useState({});

  // 审计日志（顶部最新）
  const [logs, setLogs] = useState(auditLogs);

  // 当前部门成员列表
  const currentMembers = useMemo(() => {
    return membersByDept[selectedDeptKey] || [];
  }, [selectedDeptKey]);

  // 当前部门信息
  const currentDept = useMemo(() => orgNodeMap[selectedDeptKey], [selectedDeptKey]);

  // 当前部门路径文案
  const currentDeptPath = useMemo(() => getDeptPath(selectedDeptKey), [selectedDeptKey]);

  // 选中成员对象
  const selectedMember = useMemo(() => {
    return memberList.find((m) => m.id === selectedMemberId) || null;
  }, [selectedMemberId]);

  // 抽屉成员对象
  const drawerMember = useMemo(() => {
    return memberList.find((m) => m.id === drawerMemberId) || null;
  }, [drawerMemberId]);

  // 取成员当前权限集（覆写优先于角色默认）
  const getMemberPermissions = useCallback(
    (memberId) => {
      if (permissionMap[memberId]) return permissionMap[memberId];
      const m = memberList.find((x) => x.id === memberId);
      if (!m) return new Set();
      return getDefaultPermissions(m.role);
    },
    [permissionMap]
  );

  // 写入单条权限变更：即时更新权限集 + 在日志顶部插入记录 + 触发右上角通知卡片
  const togglePermission = useCallback(
    (memberId, permKey, checked) => {
      setPermissionMap((prev) => {
        const m = memberList.find((x) => x.id === memberId);
        if (!m) return prev;
        const base = prev[memberId] ? new Set(prev[memberId]) : getDefaultPermissions(m.role);
        if (checked) base.add(permKey);
        else base.delete(permKey);
        return { ...prev, [memberId]: base };
      });
      const m = memberList.find((x) => x.id === memberId);
      const permLabel = permissionGroups
        .flatMap((g) => g.items)
        .find((i) => i.key === permKey)?.label || permKey;
      const group = permissionGroups.find((g) => g.items.some((i) => i.key === permKey));
      const deptName = m?.deptKey ? orgNodeMap[m.deptKey]?.title : "";
      const entry = {
        id: `L${Date.now()}`,
        time: new Date().toISOString().slice(0, 19).replace("T", " "),
        operator: "当前管理员",
        operatorRole: "super_admin",
        action: checked ? "permission_grant" : "permission_revoke",
        actionLabel: checked ? "权限授予" : "权限撤销",
        target: `${m?.name || "未知"} — ${group?.groupLabel || ""}·${permLabel}`,
        result: "success",
        detail: `${checked ? "为" : "撤销"}「${deptName}」${m?.name || "成员"}${checked ? "授予" : "撤销"}「${group?.groupLabel || ""}·${permLabel}」权限`,
      };
      setLogs((prev) => [entry, ...prev].slice(0, 30));

      // 触发右上角通知卡片（标题"权限已更新" + 变更摘要 + 查看详情按钮）
      notify({
        type: "success",
        title: "权限已更新",
        text: `${checked ? "已为" : "已撤销"}「${m?.name || "成员"}」${checked ? "授予" : "撤销"}「${group?.groupLabel || ""} · ${permLabel}」权限`,
        duration: 4500,
        actionLabel: "查看详情",
        onAction: () => {
          const logEl = document.querySelector(".audit-log__list");
          if (logEl) logEl.scrollIntoView({ behavior: "smooth", block: "center" });
        },
      });
    },
    [notify]
  );

  // 批量应用角色切换：将成员权限重置为目标角色默认值，并触发通知
  const applyRoleChange = useCallback(
    (memberId, newRole) => {
      const m = memberList.find((x) => x.id === memberId);
      if (!m) return { enabled: [], disabled: [] };
      const current = permissionMap[memberId] ? new Set(permissionMap[memberId]) : getDefaultPermissions(m.role);
      const nextDefault = getDefaultPermissions(newRole);
      const enabled = [];
      const disabled = [];
      permissionGroups.forEach((g) => {
        g.items.forEach((i) => {
          if (nextDefault.has(i.key) && !current.has(i.key)) enabled.push(i);
          if (!nextDefault.has(i.key) && current.has(i.key)) disabled.push(i);
        });
      });
      setPermissionMap((prev) => ({ ...prev, [memberId]: new Set(nextDefault) }));
      const deptName = m?.deptKey ? orgNodeMap[m.deptKey]?.title : "";
      const entry = {
        id: `L${Date.now()}`,
        time: new Date().toISOString().slice(0, 19).replace("T", " "),
        operator: "当前管理员",
        operatorRole: "super_admin",
        action: "role_change",
        actionLabel: "角色变更",
        target: `${m.name} — ${roleConfig[newRole]?.label || newRole}`,
        result: "success",
        detail: `将「${deptName}」${m.name} 角色由「${roleConfig[m.role]?.label}」变更为「${roleConfig[newRole]?.label}」，开启 ${enabled.length} 项、关闭 ${disabled.length} 项权限`,
      };
      setLogs((prev) => [entry, ...prev].slice(0, 30));
      notify({
        type: "success",
        title: "权限已更新",
        text: `「${m.name}」角色变更为「${roleConfig[newRole]?.label}」，开启 ${enabled.length} 项、关闭 ${disabled.length} 项权限`,
        duration: 5000,
        actionLabel: "查看详情",
        onAction: () => {
          const logEl = document.querySelector(".audit-log__list");
          if (logEl) logEl.scrollIntoView({ behavior: "smooth", block: "center" });
        },
      });
      return { enabled, disabled };
    },
    [permissionMap, notify]
  );

  // 计算角色变更对比（不应用，仅预览）
  const previewRoleChange = useCallback(
    (memberId, newRole) => {
      const m = memberList.find((x) => x.id === memberId);
      if (!m) return { enabled: [], disabled: [] };
      const current = permissionMap[memberId] ? new Set(permissionMap[memberId]) : getDefaultPermissions(m.role);
      const nextDefault = getDefaultPermissions(newRole);
      const enabled = [];
      const disabled = [];
      permissionGroups.forEach((g) => {
        g.items.forEach((i) => {
          if (nextDefault.has(i.key) && !current.has(i.key)) enabled.push({ ...i, groupLabel: g.groupLabel });
          if (!nextDefault.has(i.key) && current.has(i.key)) disabled.push({ ...i, groupLabel: g.groupLabel });
        });
      });
      return { enabled, disabled };
    },
    [permissionMap]
  );

  // 成员操作：停用 / 启用（用于操作下拉演示）
  const setMemberStatus = useCallback(() => {
    // 仅触发审计日志
    const entry = {
      id: `L${Date.now()}`,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      operator: "当前管理员",
      operatorRole: "super_admin",
      action: "member_disable",
      actionLabel: "成员停用",
      target: "目标成员",
      result: "success",
      detail: "停用目标成员账号（演示）",
    };
    setLogs((prev) => [entry, ...prev].slice(0, 30));
  }, []);

  // 切换部门 + 清空选中
  const selectDept = useCallback((key) => {
    setSelectedDeptKey(key);
    setSelectedRowKeys([]);
  }, []);

  const value = {
    // 主题
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    // 视角
    viewMode,
    setViewMode,
    // 部门
    selectedDeptKey,
    selectDept,
    setSelectedDeptKey,
    currentDept,
    currentDeptPath,
    currentMembers,
    // 成员
    selectedMemberId,
    setSelectedMemberId,
    selectedMember,
    memberList,
    roleConfig,
    // 抽屉
    drawerMemberId,
    setDrawerMemberId,
    drawerMember,
    // 模态
    modal,
    setModal,
    // 多选
    selectedRowKeys,
    setSelectedRowKeys,
    // 权限
    permissionGroups,
    getMemberPermissions,
    togglePermission,
    applyRoleChange,
    previewRoleChange,
    // 审计
    logs,
    setLogs,
    setMemberStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {notice &&
        createPortal(
          <div className="app-notice" style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1050 }}>
            <DivMessage
              key={notice.key}
              display
              type={notice.type}
              title={notice.title}
              text={notice.text}
              enableDisposeTimeOut={notice.duration > 0}
              disposeTimeOut={notice.duration}
              onClose={() => setNotice(null)}
            >
              {notice.onAction ? (
                <button
                  type="button"
                  className="app-notice__action"
                  onClick={() => {
                    notice.onAction();
                    setNotice(null);
                  }}
                  style={{
                    border: "1px solid var(--primary)",
                    background: "var(--primary)",
                    color: "var(--on-primary)",
                    borderRadius: "var(--radius-base)",
                    padding: "0.125rem 0.625rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {notice.actionLabel || "查看详情"}
                </button>
              ) : null}
            </DivMessage>
          </div>,
          document.body
        )}
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
