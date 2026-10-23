import { useMemo, useState } from "react";
import { IconPlusIcPublicInfo, IconPlusIcPublicFolder, IconPlusIcPublicTeams, IconPlusIcDigitalPowerDpMove } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import TreeSelector from "@/shared/TreeSelector";
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { parentLevelOptions, orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 批量调岗 — 把已选成员转入目标部门
export default function TransferModal() {
  const { modal, setModal, selectedRowKeys, memberList, selectDept, setLogs, notify } = useApp();
  const [targetDept, setTargetDept] = useState("org-tech-rd-fe");

  const selectedMembers = useMemo(
    () => memberList.filter((m) => selectedRowKeys.includes(m.id)),
    [memberList, selectedRowKeys]
  );

  const close = () => setModal(null);

  const treeData = [
    {
      id: "org-root",
      text: "星辰科技",
      children: parentLevelOptions[0].children.map((b) => ({
        id: b.value,
        text: b.label,
        children: b.children.map((d) => ({ id: d.value, text: d.label })),
      })),
    },
  ];

  const expandedKeys = ["org-root", ...parentLevelOptions[0].children.map((b) => b.value)];

  const onSubmit = () => {
    const targetName = orgNodeMap[targetDept]?.title || "—";
    notify({ type: "success", title: `已将 ${selectedMembers.length} 名成员调岗至「${targetName}」` });
    // 写入审计日志
    const entry = {
      id: `L${Date.now()}`,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      operator: "当前管理员",
      operatorRole: "super_admin",
      action: "member_transfer",
      actionLabel: "成员调岗",
      target: `${selectedMembers.length} 名成员 → ${targetName}`,
      result: "success",
      detail: `批量调岗：将 ${selectedMembers.map((m) => m.name).join("、")} 调入「${targetName}」`,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 30));
    selectDept(targetDept);
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcPublicFolder iconSize="1rem" iconColor={['currentcolor']} /> 批量调岗
        </span>
      }
      isOpen={modal === "transfer"}
      onClose={close}
      size={[560, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: close },
        { text: "确认调岗", status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">
        将以下 <Tag bordered={false} color="blue">{selectedMembers.length}</Tag> 名成员调岗至目标部门。调岗后将刷新目标部门的成员列表。
      </p>

      <div className="transfer-modal__selected">
        <div className="transfer-modal__selected-head">
          <IconPlusIcPublicTeams iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>已选成员（{selectedMembers.length}）</span>
        </div>
        <ul className="transfer-modal__member-list">
          {selectedMembers.length === 0 ? (
            <li className="transfer-modal__empty">未选择任何成员</li>
          ) : (
            selectedMembers.map((m) => (
              <li key={m.id} className="transfer-modal__member">
                <img src={m.avatar} alt="" className="transfer-modal__avatar" />
                <span className="transfer-modal__name">{m.name}</span>
                <span className="transfer-modal__from">来自：{orgNodeMap[m.deptKey]?.title || "—"}</span>
                <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="transfer-modal__target">
        <label className="form-label required">目标部门</label>
        <TreeSelector
          treeData={treeData}
          value={targetDept}
          onChange={(v) => setTargetDept(v)}
          expandedKeys={expandedKeys}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
        <div className="transfer-modal__hint">
          <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
          <span>调岗后成员将继承目标部门的默认权限策略，原有自定义权限保留。</span>
        </div>
      </div>
    </Dialog>
  );
}
