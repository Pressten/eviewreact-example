import { useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicInfo, IconPlusIcPublicMinusCircle, IconPlusIcPublicPlusCircle, IconPlusIcPublicQuestionmarkCircle, IconPlusIcPublicRadiowave, IconPlusIcPublicSortUp, IconPlusIcPublicSortDown, IconPlusIcPublicStar } from '@hui/icon-plus';
import Checkbox from "@nce/eview-react/Checkbox";
import Tag from "@/shared/Tag";
import TipBox from "@nce/eview-react/TipBox";
import Divider from "@nce/eview-react/Divider";
import SelectCard from "@nce/eview-react/SelectCard";
import Select from "@/shared/Select";
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";
import { orgNodeMap } from "../../mock/organization.js";
import { getDefaultPermissions } from "../../mock/permissions.js";
import "./index.css";

export default function PermissionPanel() {
  const {
    selectedMember,
    viewMode,
    permissionGroups,
    getMemberPermissions,
    togglePermission,
    previewRoleChange,
    applyRoleChange,
    roleConfig,
  } = useApp();

  const [view, setView] = useState("current"); // "current" | "compare"
  const [compareRole, setCompareRole] = useState(null);

  if (!selectedMember) {
    return (
      <div className="perm-panel perm-panel--empty">
        <div className="perm-panel__empty-state">
          <IconPlusIcPublicQuestionmarkCircle iconSize="2rem" iconColor={['var(--on-surface-variant)']} />
          <p>从成员表格中选择一名成员以查看其权限矩阵</p>
        </div>
      </div>
    );
  }

  const perms = getMemberPermissions(selectedMember.id);
  const dept = orgNodeMap[selectedMember.deptKey];
  const isAuditor = viewMode === "auditor";
  const effectiveCompareRole = compareRole || selectedMember.role;
  const diff = previewRoleChange(selectedMember.id, effectiveCompareRole);
  const isSameRole = effectiveCompareRole === selectedMember.role;

  return (
    <div className="perm-panel">
      <header className="perm-panel__head">
        <h3 className="perm-panel__title">
          <IconPlusIcDigitalPowerDpCheck iconSize="1.25rem" iconColor={['currentcolor']} />
          权限矩阵
        </h3>
        <TipBox content="勾选变更将实时写入审计日志并触发右上角通知" direction="top">
          <Tag bordered={false} color="processing" className="perm-panel__live-tag">
            <IconPlusIcPublicRadiowave iconSize="0.625rem" iconColor={['currentcolor']} /> 实时写入
          </Tag>
        </TipBox>
      </header>

      <section className="perm-panel__summary">
        <img src={selectedMember.avatar} alt="" className="perm-panel__avatar" />
        <div className="perm-panel__info">
          <div className="perm-panel__info-row">
            <span className="perm-panel__name">{selectedMember.name}</span>
            <RoleTag role={selectedMember.role} />
            <StatusDot status={selectedMember.status} />
          </div>
          <dl className="perm-panel__meta">
            <div><dt>工号</dt><dd>{selectedMember.employeeId}</dd></div>
            <div><dt>职位</dt><dd>{selectedMember.title}</dd></div>
            <div><dt>部门</dt><dd>{dept?.title || "—"}</dd></div>
            <div><dt>直属上级</dt><dd>{selectedMember.supervisor}</dd></div>
            <div><dt>邮箱</dt><dd>{selectedMember.email}</dd></div>
            <div><dt>最近活跃</dt><dd>{selectedMember.lastActive}</dd></div>
          </dl>
        </div>
      </section>

      <div className="perm-panel__view-switch">
        <SelectCard
          type="small"
          value={view}
          onChange={(v) => setView(v)}
          data={[
            { text: "当前权限", value: "current" },
            { text: "变更对比", value: "compare" },
          ]}
        />
      </div>

      {view === "current" ? (
        <>
          <Divider style={{ margin: "0 0 0.5rem" }} />
          <div className="perm-panel__matrix">            <div className="perm-panel__matrix-head">
              <span className="perm-panel__matrix-col perm-panel__matrix-col--perm">功能权限</span>
              <span className="perm-panel__matrix-col perm-panel__matrix-col--stat">已授予 / 总数</span>
            </div>
            {permissionGroups.map((g) => {
              const granted = g.items.filter((i) => perms.has(i.key)).length;
              const total = g.items.length;
              const allChecked = granted === total;
              const indeterminate = granted > 0 && granted < total;
              return (
                <GroupRow
                  key={g.group}
                  group={g}
                  perms={perms}
                  memberId={selectedMember.id}
                  togglePermission={togglePermission}
                  disabled={isAuditor}
                  allChecked={allChecked}
                  indeterminate={indeterminate}
                  granted={granted}
                  total={total}
                  memberRole={selectedMember.role}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="perm-panel__compare">
          <div className="perm-panel__compare-head">
            <div className="perm-panel__compare-role">
              <label className="form-label">对比目标角色</label>
              <Select
                value={effectiveCompareRole}
                onChange={(v) => setCompareRole(v)}
                defaultLabel="选择对比角色"
                style={{ width: "100%", marginTop: "0.25rem" }}
                options={Object.entries(roleConfig).map(([k, v]) => ({
                  value: k,
                  text: (
                    <span className="form-option">
                      <Tag bordered={false} color={v.color}>{v.label}</Tag>
                      <span className="form-option-desc">{v.desc.slice(0, 16)}…</span>
                    </span>
                  ),
                }))}
              />
            </div>
            <div className="perm-panel__compare-stat">
              <div className="perm-panel__compare-stat-item is-enabled">
                <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
                <span className="perm-panel__compare-stat-num">{diff.enabled.length}</span>
                <span className="perm-panel__compare-stat-label">将开启</span>
              </div>
              <div className="perm-panel__compare-stat-item is-disabled">
                <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />
                <span className="perm-panel__compare-stat-num">{diff.disabled.length}</span>
                <span className="perm-panel__compare-stat-label">将关闭</span>
              </div>
            </div>
          </div>

          {isSameRole ? (
            <div className="perm-panel__compare-same">
              <IconPlusIcPublicInfo iconSize="1rem" iconColor={['var(--on-surface-variant)']} />
              <span>当前选择的角色与成员现有角色相同，无变更差异。</span>
            </div>
          ) : diff.enabled.length === 0 && diff.disabled.length === 0 ? (
            <div className="perm-panel__compare-same">
              <IconPlusIcDigitalPowerDpCheck iconSize="1rem" iconColor={['var(--success)']} />
              <span>切换到该角色后权限集与当前完全一致，无差异。</span>
            </div>
          ) : (
            <>
              <div className="perm-panel__diff-section perm-panel__diff-section--enabled">
                <h4 className="perm-panel__diff-title">
                  <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
                  将要开启的权限
                  <Tag bordered={false} color="success" className="perm-panel__diff-count">{diff.enabled.length}</Tag>
                </h4>
                {diff.enabled.length === 0 ? (
                  <p className="perm-panel__diff-empty">无新增权限</p>
                ) : (
                  <ul className="perm-panel__diff-list">
                    {diff.enabled.map((i) => (
                      <li key={i.key} className="perm-panel__diff-item perm-panel__diff-item--enabled">
                        <IconPlusIcPublicPlusCircle iconSize="0.75rem" iconColor={['currentcolor']} />
                        <div className="perm-panel__diff-item-info">
                          <span className="perm-panel__diff-group">{i.groupLabel}</span>
                          <span className="perm-panel__diff-name">{i.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="perm-panel__diff-section perm-panel__diff-section--disabled">
                <h4 className="perm-panel__diff-title">
                  <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />
                  将要关闭的权限
                  <Tag bordered={false} color="error" className="perm-panel__diff-count">{diff.disabled.length}</Tag>
                </h4>
                {diff.disabled.length === 0 ? (
                  <p className="perm-panel__diff-empty">无收回权限</p>
                ) : (
                  <ul className="perm-panel__diff-list">
                    {diff.disabled.map((i) => (
                      <li key={i.key} className="perm-panel__diff-item perm-panel__diff-item--disabled">
                        <IconPlusIcPublicMinusCircle iconSize="0.75rem" iconColor={['currentcolor']} />
                        <div className="perm-panel__diff-item-info">
                          <span className="perm-panel__diff-group">{i.groupLabel}</span>
                          <span className="perm-panel__diff-name">{i.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="perm-panel__compare-action">
                <Button
                  status="primary"
                  disabled={isAuditor}
                  leftIcon={<IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />}
                  text="应用角色变更"
                  onClick={() => {
                    applyRoleChange(selectedMember.id, effectiveCompareRole);
                    setView("current");
                    setCompareRole(null);
                  }}
                />
                {isAuditor && <span className="perm-panel__compare-hint">审计员视角下不可应用变更</span>}
              </div>
            </>
          )}
        </div>
      )}

      <footer className="perm-panel__foot">
        <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['currentcolor']} />
        <span>权限配置基于角色默认值，可针对成员单独覆盖。审计员视角下为只读模式。</span>
      </footer>
    </div>
  );
}

function GroupRow({ group, perms, memberId, togglePermission, disabled, allChecked, indeterminate, granted, total, memberRole }) {
  const roleDefault = useMemo(() => getDefaultPermissions(memberRole), [memberRole]);
  const onGroupToggle = (value, checked) => {
    group.items.forEach((i) => {
      if (perms.has(i.key) !== checked) togglePermission(memberId, i.key, checked);
    });
  };
  return (
    <div className="perm-group">
      <header className="perm-group__head">
        <div className="perm-group__head-left">
          <Checkbox
            checked={allChecked}
            halfChecked={indeterminate}
            disabled={disabled}
            onChange={onGroupToggle}
          />
          <div>
            <h4 className="perm-group__title">{group.groupLabel}</h4>
            <p className="perm-group__desc">{group.groupDesc}</p>
          </div>
        </div>
        <span className={`perm-group__stat ${granted === 0 ? "is-zero" : granted === total ? "is-full" : "is-part"}`}>
          {granted} / {total}
        </span>
      </header>
      <ul className="perm-group__items">
        {group.items.map((i) => {
          const checked = perms.has(i.key);
          const isOverride = roleDefault.has(i.key) !== checked;
          return (
            <li key={i.key} className={`perm-item ${isOverride ? "is-override" : ""}`}>
              <label className="perm-item__label">
                <Checkbox
                  checked={checked}
                  disabled={disabled}
                  onChange={(value, checked) => togglePermission(memberId, i.key, checked)}
                />
                <span className="perm-item__name">{i.label}</span>
                {isOverride && (
                  <TipBox content={checked ? "已对成员单独授予" : "已对成员单独撤销"} direction="top">
                    <IconPlusIcPublicStar iconSize="0.625rem" iconColor={['var(--critical)']} className="perm-item__override" />
                  </TipBox>
                )}
              </label>
              <span className="perm-item__key">{i.key}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
