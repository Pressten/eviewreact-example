import { useState, useMemo, useCallback, createContext, useContext } from "react";
import { PERM_MODULES, PERM_ACTIONS, INITIAL_ROLES, INITIAL_PERMS } from "./mock/perm.js";
import { INITIAL_MEMBERS } from "./mock/org.js";
import { INITIAL_POLICY, INITIAL_EXCEPTIONS } from "./mock/policy.js";

// Layer 1: 全局状态 — 主题模式 + 权限中心业务状态
// 换肤单轨驱动：isDark state 只在此持有 + toggleDark 暴露给业务侧；
// html .dark 轨与 eview-ui ConfigProvider theme 轨统一由 ThemeProvider
// （src/theme/useTheme.jsx）单点驱动，本文件不自写暗色 useEffect，避免双处切 .dark。

const clone = (v) => JSON.parse(JSON.stringify(v));

function makeInitialSnapshot() {
  return {
    roles: clone(INITIAL_ROLES),
    perms: clone(INITIAL_PERMS),
    members: INITIAL_MEMBERS.map((m) => ({ ...m })),
    policy: clone(INITIAL_POLICY),
    dataScope: "dept-sub",
    exceptions: clone(INITIAL_EXCEPTIONS),
  };
}

// 统计当前配置与已保存快照之间的差异数（按域拆分：矩阵单元格 / 角色信息 / 策略字段 / 数据范围 / 例外 / 成员变更）
function getChangeBreakdown(cur, snap) {
  const r = { matrix: 0, roleInfo: 0, policy: 0, scope: 0, exceptions: 0, members: 0 };
  const roleIds = new Set([...cur.roles.map((x) => x.roleId), ...snap.roles.map((x) => x.roleId)]);
  roleIds.forEach((roleId) => {
    const snapRole = snap.roles.find((x) => x.roleId === roleId);
    if (!snapRole) {
      r.roleInfo += 1; // 新建角色本身
      const p = cur.perms[roleId] || {};
      Object.keys(p).forEach((mid) => {
        const a = p[mid];
        r.matrix += (a.view ? 1 : 0) + (a.edit ? 1 : 0) + (a.delete ? 1 : 0);
      });
      return;
    }
    const curRole = cur.roles.find((x) => x.roleId === roleId);
    if (curRole.roleName !== snapRole.roleName) r.roleInfo += 1;
    if (curRole.description !== snapRole.description) r.roleInfo += 1;
    const cp = cur.perms[roleId] || {};
    const sp = snap.perms[roleId] || {};
    PERM_MODULES.forEach((m) => {
      PERM_ACTIONS.forEach((a) => {
        const now = !!(cp[m.moduleId] && cp[m.moduleId][a.actionId]);
        const was = !!(sp[m.moduleId] && sp[m.moduleId][a.actionId]);
        if (now !== was) r.matrix += 1;
      });
    });
  });
  Object.keys(cur.policy).forEach((k) => {
    if (JSON.stringify(cur.policy[k]) !== JSON.stringify(snap.policy[k])) r.policy += 1;
  });
  if (cur.dataScope !== snap.dataScope) r.scope += 1;
  const curExIds = new Set(cur.exceptions.map((e) => e.exceptionId));
  cur.exceptions.forEach((e) => {
    if (!snap.exceptions.some((s) => s.exceptionId === e.exceptionId)) r.exceptions += 1;
  });
  snap.exceptions.forEach((e) => {
    if (!curExIds.has(e.exceptionId)) r.exceptions += 1;
  });
  const snapMemberMap = new Map(snap.members.map((m) => [m.memberId, m]));
  const curMemberIds = new Set(cur.members.map((m) => m.memberId));
  cur.members.forEach((m) => {
    const s = snapMemberMap.get(m.memberId);
    if (!s) r.members += 1;
    else if (s.roleId !== m.roleId || s.status !== m.status) r.members += 1;
  });
  snap.members.forEach((m) => {
    if (!curMemberIds.has(m.memberId)) r.members += 1;
  });
  return r;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // ── 业务状态（草稿区） ──
  const [members, setMembers] = useState(() => INITIAL_MEMBERS.map((m) => ({ ...m })));
  const [roles, setRoles] = useState(() => clone(INITIAL_ROLES));
  const [perms, setPerms] = useState(() => clone(INITIAL_PERMS));
  const [policy, setPolicy] = useState(() => clone(INITIAL_POLICY));
  const [dataScope, setDataScope] = useState("dept-sub");
  const [exceptions, setExceptions] = useState(() => clone(INITIAL_EXCEPTIONS));

  // ── 已保存快照 ──
  const [snapshot, setSnapshot] = useState(makeInitialSnapshot);

  // ── UI 联动状态 ──
  const [selectedDeptId, setSelectedDeptId] = useState(null); // 组织树选中节点（部门/小组），null 为全部
  const [activeRoleId, setActiveRoleId] = useState("role-super");

  const changeBreakdown = useMemo(
    () => getChangeBreakdown({ roles, perms, members, policy, dataScope, exceptions }, snapshot),
    [roles, perms, members, policy, dataScope, exceptions, snapshot]
  );

  const changeCount = useMemo(
    () => Object.values(changeBreakdown).reduce((sum, n) => sum + n, 0),
    [changeBreakdown]
  );

  // 各角色当前持有人数（与成员数据实时一致）
  const roleMemberCounts = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[m.roleId] = (map[m.roleId] || 0) + 1;
    });
    return map;
  }, [members]);

  // 单个角色的未保存变更数（用于矩阵页签提示）
  const getRoleChangeCount = useCallback(
    (roleId) => {
      const snapRole = snapshot.roles.find((r) => r.roleId === roleId);
      const curRole = roles.find((r) => r.roleId === roleId);
      const cp = perms[roleId] || {};
      if (!snapRole) {
        let c = 1;
        Object.keys(cp).forEach((mid) => {
          const a = cp[mid];
          c += (a.view ? 1 : 0) + (a.edit ? 1 : 0) + (a.delete ? 1 : 0);
        });
        return c;
      }
      let c = 0;
      if (curRole.roleName !== snapRole.roleName) c += 1;
      if (curRole.description !== snapRole.description) c += 1;
      const sp = snapshot.perms[roleId] || {};
      PERM_MODULES.forEach((m) => {
        PERM_ACTIONS.forEach((a) => {
          const now = !!(cp[m.moduleId] && cp[m.moduleId][a.actionId]);
          const was = !!(sp[m.moduleId] && sp[m.moduleId][a.actionId]);
          if (now !== was) c += 1;
        });
      });
      return c;
    },
    [roles, perms, snapshot]
  );

  // ── 权限矩阵操作 ──
  const setPermCell = useCallback((roleId, moduleId, actionId, checked) => {
    setPerms((prev) => {
      const next = clone(prev);
      next[roleId] = next[roleId] || {};
      next[roleId][moduleId] = next[roleId][moduleId] || { view: false, edit: false, delete: false };
      next[roleId][moduleId][actionId] = checked;
      return next;
    });
  }, []);

  const setModuleAll = useCallback((roleId, moduleId, checked) => {
    setPerms((prev) => {
      const next = clone(prev);
      next[roleId] = next[roleId] || {};
      next[roleId][moduleId] = { view: checked, edit: checked, delete: checked };
      return next;
    });
  }, []);

  const setColumnAll = useCallback((roleId, actionId, checked) => {
    setPerms((prev) => {
      const next = clone(prev);
      next[roleId] = next[roleId] || {};
      PERM_MODULES.forEach((m) => {
        next[roleId][m.moduleId] = next[roleId][m.moduleId] || { view: false, edit: false, delete: false };
        next[roleId][m.moduleId][actionId] = checked;
      });
      return next;
    });
  }, []);

  const setRoleAll = useCallback((roleId, checked) => {
    setPerms((prev) => {
      const next = clone(prev);
      next[roleId] = {};
      PERM_MODULES.forEach((m) => {
        next[roleId][m.moduleId] = { view: checked, edit: checked, delete: checked };
      });
      return next;
    });
  }, []);

  // ── 角色 ──
  const upsertRole = useCallback((role, permMap) => {
    setRoles((prev) =>
      prev.some((r) => r.roleId === role.roleId)
        ? prev.map((r) => (r.roleId === role.roleId ? { ...r, ...role } : r))
        : [...prev, role]
    );
    setPerms((prev) => {
      const next = clone(prev);
      next[role.roleId] = clone(permMap);
      return next;
    });
    setActiveRoleId(role.roleId);
  }, []);

  // 撤销单个角色的未保存修改：恢复到快照；快照中不存在的新建角色则整体删除
  const revertRole = useCallback(
    (roleId) => {
      const snapRole = snapshot.roles.find((r) => r.roleId === roleId);
      if (!snapRole) {
        setRoles((prev) => prev.filter((r) => r.roleId !== roleId));
        setPerms((prev) => {
          const next = clone(prev);
          delete next[roleId];
          return next;
        });
        setActiveRoleId((cur) =>
          cur === roleId ? snapshot.roles[0].roleId : cur
        );
        return "removed";
      }
      setRoles((prev) => prev.map((r) => (r.roleId === roleId ? { ...snapRole } : r)));
      setPerms((prev) => {
        const next = clone(prev);
        next[roleId] = clone(snapshot.perms[roleId] || {});
        return next;
      });
      return "restored";
    },
    [snapshot]
  );

  // ── 成员 ──
  const adjustMemberRole = useCallback((memberId, roleId) => {
    setMembers((prev) => prev.map((m) => (m.memberId === memberId ? { ...m, roleId } : m)));
  }, []);

  const removeMember = useCallback((memberId) => {
    setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
  }, []);

  // ── 安全策略 / 数据权限 ──
  const setPolicyField = useCallback((key, value) => {
    setPolicy((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetPolicyDefaults = useCallback(() => {
    setPolicy(clone(INITIAL_POLICY));
  }, []);

  const removeException = useCallback((exceptionId) => {
    setExceptions((prev) => prev.filter((e) => e.exceptionId !== exceptionId));
  }, []);

  const addException = useCallback((payload) => {
    setExceptions((prev) => [...prev, { exceptionId: `ex-${Date.now()}`, ...payload }]);
  }, []);

  // ── 保存 / 重置 ──
  const saveAll = useCallback(() => {
    setSnapshot({
      roles: clone(roles),
      perms: clone(perms),
      members: members.map((m) => ({ ...m })),
      policy: clone(policy),
      dataScope,
      exceptions: clone(exceptions),
    });
  }, [roles, perms, members, policy, dataScope, exceptions]);

  const resetAll = useCallback(() => {
    setRoles(clone(snapshot.roles));
    setPerms(clone(snapshot.perms));
    setMembers(snapshot.members.map((m) => ({ ...m })));
    setPolicy(clone(snapshot.policy));
    setDataScope(snapshot.dataScope);
    setExceptions(clone(snapshot.exceptions));
    if (!snapshot.roles.some((r) => r.roleId === activeRoleId)) {
      setActiveRoleId(snapshot.roles[0].roleId);
    }
  }, [snapshot, activeRoleId]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    // 业务数据
    members, roles, perms, policy, dataScope, exceptions, snapshot,
    changeCount, changeBreakdown, roleMemberCounts, getRoleChangeCount,
    // UI 联动
    selectedDeptId, setSelectedDeptId, activeRoleId, setActiveRoleId,
    // 动作
    setPermCell, setModuleAll, setColumnAll, setRoleAll,
    upsertRole, revertRole, adjustMemberRole, removeMember,
    setPolicyField, resetPolicyDefaults, setDataScope, removeException, addException,
    saveAll, resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
