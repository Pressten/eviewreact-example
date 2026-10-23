import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { orgNodeMap, getDeptPath } from "./mock/organization.js";
import { memberList, membersByDept, roleConfig } from "./mock/members.js";
import { permissionGroups, getDefaultPermissions } from "./mock/permissions.js";
import { auditLogs } from "./mock/audit-logs.js";

// Layer 1: 全局状态 — 主题模式 + 业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 右上角通知卡片 — DivMessage 状态驱动（无命令式 API）
  const [notice, setNotice] = useState(null);
  const closeNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((opts) => {
    setNotice({ key: Date.now(), type: opts.type || "success", title: opts.title, description: opts.description });
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
        description: `${checked ? "已为" : "已撤销"}「${m?.name || "成员"}」${checked ? "授予" : "撤销"}「${group?.groupLabel || ""} · ${permLabel}」权限`,
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
        description: `「${m.name}」角色变更为「${roleConfig[newRole]?.label}」，开启 ${enabled.length} 项、关闭 ${disabled.length} 项权限`,
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
    // 通知
    notify,
    closeNotice,
  };

  return (
    <AppContext.Provider value={value}>
      {notice ? (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            title={notice.title}
            text={notice.description}
            onClose={closeNotice}
          />
        </div>
      ) : null}
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
