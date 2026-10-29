import { useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicInfo, IconPlusIcPublicMinusCircle, IconPlusIcPublicPlusCircle, IconPlusIcPublicQuestionmarkCircle, IconPlusIcPublicRadiowave, IconPlusIcPublicSecurity, IconPlusIcPublicSortDown, IconPlusIcPublicSortUp, IconPlusIcPublicStar } from '@hui/icon-plus';
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
          <p>浠庢垚鍛樿〃鏍间腑閫夋嫨涓€鍚嶆垚鍛樹互鏌ョ湅鍏舵潈闄愮煩闃?/p>
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
          <IconPlusIcPublicSecurity iconSize="1.25rem" iconColor={['currentcolor']} />
          鏉冮檺鐭╅樀
        </h3>
        <TipBox type="simple" content="鍕鹃€夊彉鏇村皢瀹炴椂鍐欏叆瀹¤鏃ュ織骞惰Е鍙戝彸涓婅閫氱煡">
          <Tag bordered={false} color="processing" className="perm-panel__live-tag">
            <IconPlusIcPublicRadiowave iconSize="0.625rem" iconColor={['currentcolor']} /> 瀹炴椂鍐欏叆
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
            <div><dt>宸ュ彿</dt><dd>{selectedMember.employeeId}</dd></div>
            <div><dt>鑱屼綅</dt><dd>{selectedMember.title}</dd></div>
            <div><dt>閮ㄩ棬</dt><dd>{dept?.title || "鈥?}</dd></div>
            <div><dt>鐩村睘涓婄骇</dt><dd>{selectedMember.supervisor}</dd></div>
            <div><dt>閭</dt><dd>{selectedMember.email}</dd></div>
            <div><dt>鏈€杩戞椿璺?/dt><dd>{selectedMember.lastActive}</dd></div>
          </dl>
        </div>
      </section>

      <div className="perm-panel__view-switch">
        <SelectCard
          type="small"
          value={view}
          onChange={(v) => setView(v)}
          data={[
            { text: "褰撳墠鏉冮檺", value: "current" },
            { text: "鍙樻洿瀵规瘮", value: "compare" },
          ]}
        />
      </div>

      {view === "current" ? (
        <>
          <Divider style={{ margin: "0 0 0.5rem" }} />
          <div className="perm-panel__matrix">
            <div className="perm-panel__matrix-head">
              <span className="perm-panel__matrix-col perm-panel__matrix-col--perm">鍔熻兘鏉冮檺</span>
              <span className="perm-panel__matrix-col perm-panel__matrix-col--stat">宸叉巿浜?/ 鎬绘暟</span>
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
              <label className="form-label">瀵规瘮鐩爣瑙掕壊</label>
              <Select
                value={effectiveCompareRole}
                onChange={(v) => setCompareRole(v)}
                defaultLabel="璇烽€夋嫨瑙掕壊"
                style={{ width: "100%", marginTop: "0.25rem" }}
                options={Object.entries(roleConfig).map(([k, v]) => ({
                  value: k,
                  text: (
                    <span className="form-option">
                      <Tag bordered={false} color={v.color}>{v.label}</Tag>
                      <span className="form-option-desc">{v.desc.slice(0, 16)}鈥?/span>
                    </span>
                  ),
                }))}
              />
            </div>
            <div className="perm-panel__compare-stat">
              <div className="perm-panel__compare-stat-item is-enabled">
                <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
                <span className="perm-panel__compare-stat-num">{diff.enabled.length}</span>
                <span className="perm-panel__compare-stat-label">灏嗗紑鍚?/span>
              </div>
              <div className="perm-panel__compare-stat-item is-disabled">
                <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />
                <span className="perm-panel__compare-stat-num">{diff.disabled.length}</span>
                <span className="perm-panel__compare-stat-label">灏嗗叧闂?/span>
              </div>
            </div>
          </div>

          {isSameRole ? (
            <div className="perm-panel__compare-same">
              <IconPlusIcPublicInfo iconSize="1rem" iconColor={['var(--on-surface-variant)']} />
              <span>褰撳墠閫夋嫨鐨勮鑹蹭笌鎴愬憳鐜版湁瑙掕壊鐩稿悓锛屾棤鍙樻洿宸紓銆?/span>
            </div>
          ) : diff.enabled.length === 0 && diff.disabled.length === 0 ? (
            <div className="perm-panel__compare-same">
              <IconPlusIcDigitalPowerDpCheck iconSize="1rem" iconColor={['var(--success)']} />
              <span>鍒囨崲鍒拌瑙掕壊鍚庢潈闄愰泦涓庡綋鍓嶅畬鍏ㄤ竴鑷达紝鏃犲樊寮傘€?/span>
            </div>
          ) : (
            <>
              <div className="perm-panel__diff-section perm-panel__diff-section--enabled">
                <h4 className="perm-panel__diff-title">
                  <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
                  灏嗚寮€鍚殑鏉冮檺
                  <Tag bordered={false} color="success" className="perm-panel__diff-count">{diff.enabled.length}</Tag>
                </h4>
                {diff.enabled.length === 0 ? (
                  <p className="perm-panel__diff-empty">鏃犳柊澧炴潈闄?/p>
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
                  灏嗚鍏抽棴鐨勬潈闄?                  <Tag bordered={false} color="error" className="perm-panel__diff-count">{diff.disabled.length}</Tag>
                </h4>
                {diff.disabled.length === 0 ? (
                  <p className="perm-panel__diff-empty">鏃犳敹鍥炴潈闄?/p>
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
                  onClick={() => {
                    applyRoleChange(selectedMember.id, effectiveCompareRole);
                    setView("current");
                    setCompareRole(null);
                  }}
                  text="搴旂敤瑙掕壊鍙樻洿"
                  leftIcon={<IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />}
                />
                {isAuditor && <span className="perm-panel__compare-hint">瀹¤鍛樿瑙掍笅涓嶅彲搴旂敤鍙樻洿</span>}
              </div>
            </>
          )}
        </div>
      )}

      <footer className="perm-panel__foot">
        <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['currentcolor']} />
        <span>鏉冮檺閰嶇疆鍩轰簬瑙掕壊榛樿鍊硷紝鍙拡瀵规垚鍛樺崟鐙鐩栥€傚璁″憳瑙嗚涓嬩负鍙妯″紡銆?/span>
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
                  onChange={(_value, _checked) => togglePermission(memberId, i.key, _checked)}
                />
                <span className="perm-item__name">{i.label}</span>
                {isOverride && (
                  <TipBox type="simple" content={checked ? "宸插鎴愬憳鍗曠嫭鎺堜簣" : "宸插鎴愬憳鍗曠嫭鎾ら攢"}>
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
