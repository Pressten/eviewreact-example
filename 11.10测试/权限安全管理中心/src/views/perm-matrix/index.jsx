import { useState } from "react";
import { Tabs, Checkbox, Badge, Button, Tag, Tooltip, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { PERM_MODULES, PERM_ACTIONS } from "../../mock/perm.js";
import RoleModal from "../../components/role-modal/index.jsx";
import "./index.css";

function MatrixPanel({ role }) {
  const { perms, setPermCell, setModuleAll, setColumnAll, setRoleAll, roleMemberCounts, getRoleChangeCount, revertRole } = useApp();
  const rolePerms = perms[role.roleId] || {};
  const memberCount = roleMemberCounts[role.roleId] || 0;
  const roleChangeCount = getRoleChangeCount(role.roleId);

  const cellOf = (moduleId) => rolePerms[moduleId] || { view: false, edit: false, delete: false };

  const columnState = (actionId) => {
    const checked = PERM_MODULES.filter((m) => cellOf(m.moduleId)[actionId]).length;
    return { checked: checked === PERM_MODULES.length, indeterminate: checked > 0 && checked < PERM_MODULES.length };
  };

  const rowState = (moduleId) => {
    const cell = cellOf(moduleId);
    const count = PERM_ACTIONS.filter((a) => cell[a.actionId]).length;
    return { checked: count === 3, indeterminate: count > 0 && count < 3 };
  };

  const totalChecked = PERM_MODULES.reduce(
    (sum, m) => sum + PERM_ACTIONS.filter((a) => cellOf(m.moduleId)[a.actionId]).length,
    0
  );
  const allState = {
    checked: totalChecked === PERM_MODULES.length * 3,
    indeterminate: totalChecked > 0 && totalChecked < PERM_MODULES.length * 3,
  };

  return (
    <div className="matrix-panel">
      <div className="role-meta">
        <span className="role-desc">{role.description}</span>
        {roleChangeCount > 0 && (
          <>
            <span className="role-count">{memberCount} 人持有该角色</span>
            <Tag color="warning">未保存 {roleChangeCount} 项</Tag>
            <a
              className="revert-link"
              onClick={() => {
                const result = revertRole(role.roleId);
                if (result === "removed") {
                  message.info(`已撤销新建角色「${role.roleName}」，并从页签移除`);
                } else {
                  message.info(`已撤销「${role.roleName}」的未保存修改，恢复至上次保存的配置`);
                }
              }}
            >
              <Icon name="rotate-ccw" size="0.75rem" />
              撤销修改
            </a>
          </>
        )}
        {roleChangeCount === 0 && <span className="role-count">{memberCount} 人持有该角色</span>}
      </div>
      <div className="matrix-grid">
        <div className="mg-cell mg-head mod">功能模块</div>
        <div className="mg-cell mg-head">
          <Checkbox
            checked={allState.checked}
            indeterminate={allState.indeterminate}
            onChange={(e) => setRoleAll(role.roleId, e.target.checked)}
          >
            全部
          </Checkbox>
        </div>
        {PERM_ACTIONS.map((a) => {
          const st = columnState(a.actionId);
          return (
            <div className="mg-cell mg-head" key={a.actionId}>
              <Checkbox
                checked={st.checked}
                indeterminate={st.indeterminate}
                onChange={(e) => setColumnAll(role.roleId, a.actionId, e.target.checked)}
              >
                {a.actionName}
              </Checkbox>
            </div>
          );
        })}
        {PERM_MODULES.map((m, i) => {
          const row = rowState(m.moduleId);
          return (
            <div className={"mg-body-row" + (i % 2 ? " zebra" : "")} key={m.moduleId} style={{ display: "contents" }}>
              <div className="mg-cell mod">
                <Tooltip title={m.description}>
                  <span className="module-name">
                    <Icon name="info" size="0.75rem" className="module-help" />
                    {m.moduleName}
                  </span>
                </Tooltip>
              </div>
              <div className="mg-cell">
                <Checkbox
                  checked={row.checked}
                  indeterminate={row.indeterminate}
                  onChange={(e) => setModuleAll(role.roleId, m.moduleId, e.target.checked)}
                />
              </div>
              {PERM_ACTIONS.map((a) => (
                <div className="mg-cell" key={a.actionId}>
                  <Checkbox
                    checked={!!cellOf(m.moduleId)[a.actionId]}
                    onChange={(e) => setPermCell(role.roleId, m.moduleId, a.actionId, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="matrix-legend">
        <span className="legend-item"><span className="dot dot-full" />全选：模块全部操作已授权</span>
        <span className="legend-item"><span className="dot dot-half" />半选：部分操作已授权</span>
        <span className="legend-item"><span className="dot dot-empty" />空选：未授权任何操作</span>
      </div>
    </div>
  );
}

export default function PermMatrix() {
  const { roles, activeRoleId, setActiveRoleId, roleMemberCounts } = useApp();
  const [roleModal, setRoleModal] = useState(null); // { mode, role }

  const activeRole = roles.find((r) => r.roleId === activeRoleId) || roles[0];

  return (
    <section className="pc-card matrix-card">
      <div className="section-head">
        <span className="section-icon"><Icon name="layout-grid" size="1.125rem" /></span>
        <div>
          <div className="section-title">权限矩阵</div>
          <div className="section-sub">角色 × 功能模块 × 操作（查看 / 编辑 / 删除）三级授权，切换页签查看各角色配置</div>
        </div>
      </div>
      <Tabs
        activeKey={activeRoleId}
        onChange={setActiveRoleId}
        tabBarExtraContent={
          <div className="tab-extra">
            <a className="link-action" onClick={() => setRoleModal({ mode: "edit", role: activeRole })}>
              <Icon name="pencil" size="0.875rem" />
              编辑当前角色
            </a>
            <Button type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={() => setRoleModal({ mode: "create" })}>
              新建角色
            </Button>
          </div>
        }
        items={roles.map((role) => ({
          key: role.roleId,
          label: (
            <span className="role-tab-label">
              {role.roleName}
              <Badge
                count={roleMemberCounts[role.roleId] || 0}
                overflowCount={999}
                size="small"
                style={{ backgroundColor: "var(--primary)" }}
              />
            </span>
          ),
          children: <MatrixPanel role={role} />,
        }))}
      />
      {roleModal && (
        <RoleModal
          mode={roleModal.mode}
          role={roleModal.mode === "edit" ? roleModal.role : undefined}
          onClose={() => setRoleModal(null)}
        />
      )}
    </section>
  );
}
