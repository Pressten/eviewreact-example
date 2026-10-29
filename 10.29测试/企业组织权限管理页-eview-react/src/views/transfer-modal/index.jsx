import { useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpMove, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcPublicFolder, IconPlusIcPublicInfo } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import TreeSelector from "@/shared/TreeSelector";
import Tag from "@/shared/Tag";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";

import { parentLevelOptions, orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 鎵归噺璋冨矖 鈥?鎶婂凡閫夋垚鍛樿浆鍏ョ洰鏍囬儴闂?export default function TransferModal() {
  const { modal, setModal, selectedRowKeys, memberList, selectDept, setLogs } = useApp();
  const [targetDept, setTargetDept] = useState("org-tech-rd-fe");
  const [notice, setNotice] = useState(null);

  const selectedMembers = useMemo(
    () => memberList.filter((m) => selectedRowKeys.includes(m.id)),
    [memberList, selectedRowKeys]
  );

  const close = () => setModal(null);

  const treeData = [
    {
      id: "org-root",
      text: "鏄熻景绉戞妧",
      children: parentLevelOptions[0].children.map((b) => ({
        id: b.value,
        text: b.label,
        children: b.children.map((d) => ({ id: d.value, text: d.label })),
      })),
    },
  ];

  const onSubmit = () => {
    const targetName = orgNodeMap[targetDept]?.title || "鈥?;
    setNotice({ key: `N${Date.now()}`, text: `宸插皢 ${selectedMembers.length} 鍚嶆垚鍛樿皟宀楄嚦銆?{targetName}銆峘 });
    // 鍐欏叆瀹¤鏃ュ織
    const entry = {
      id: `L${Date.now()}`,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      operator: "褰撳墠绠＄悊鍛?,
      operatorRole: "super_admin",
      action: "member_transfer",
      actionLabel: "鎴愬憳璋冨矖",
      target: `${selectedMembers.length} 鍚嶆垚鍛?鈫?${targetName}`,
      result: "success",
      detail: `鎵归噺璋冨矖锛氬皢 ${selectedMembers.map((m) => m.name).join("銆?)} 璋冨叆銆?{targetName}銆峘,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 30));
    selectDept(targetDept);
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcPublicFolder iconSize="1rem" iconColor={['currentcolor']} /> 鎵归噺璋冨矖
        </span>
      }
      isOpen={modal === "transfer"}
      onClose={close}
      size={[560, "auto"]}
      destroyOnClose
      buttons={[
        { text: "鍙栨秷", onClick: close },
        { text: "纭璋冨矖", status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">
        灏嗕互涓?<Tag bordered={false} color="blue">{selectedMembers.length}</Tag> 鍚嶆垚鍛樿皟宀楄嚦鐩爣閮ㄩ棬銆傝皟宀楀悗灏嗗埛鏂扮洰鏍囬儴闂ㄧ殑鎴愬憳鍒楄〃銆?      </p>

      <div className="transfer-modal__selected">
        <div className="transfer-modal__selected-head">
          <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>宸查€夋垚鍛橈紙{selectedMembers.length}锛?/span>
        </div>
        <ul className="transfer-modal__member-list">
          {selectedMembers.length === 0 ? (
            <li className="transfer-modal__empty">鏈€夋嫨浠讳綍鎴愬憳</li>
          ) : (
            selectedMembers.map((m) => (
              <li key={m.id} className="transfer-modal__member">
                <img src={m.avatar} alt="" className="transfer-modal__avatar" />
                <span className="transfer-modal__name">{m.name}</span>
                <span className="transfer-modal__from">鏉ヨ嚜锛歿orgNodeMap[m.deptKey]?.title || "鈥?}</span>
                <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="transfer-modal__target">
        <label className="form-label required">鐩爣閮ㄩ棬</label>
        <TreeSelector
          value={targetDept}
          onChange={(value) => setTargetDept(value)}
          treeData={treeData}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
        <div className="transfer-modal__hint">
          <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
          <span>璋冨矖鍚庢垚鍛樺皢缁ф壙鐩爣閮ㄩ棬鐨勯粯璁ゆ潈闄愮瓥鐣ワ紝鍘熸湁鑷畾涔夋潈闄愪繚鐣欍€?/span>
        </div>
      </div>
    </Dialog>
    {notice ? (
      <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
        <DivMessage
          key={notice.key}
          display
          type="success"
          text={notice.text}
          enableDisposeTimeOut
          disposeTimeOut={4000}
          onClose={() => setNotice(null)}
        />
      </div>
    ) : null}
  );
}
