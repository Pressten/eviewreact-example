import { useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Cascader from "@/shared/Cascader";
import Tag from "@/shared/Tag";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";
import { IconPlusIcDevBranch, IconPlusIcIctNewFolder } from '@hui/icon-plus';
import { parentLevelOptions, orgNodeMap } from "../../mock/organization.js";
import { memberList } from "../../mock/members.js";
import "./index.css";

// 鏂板缓閮ㄩ棬 鈥?鍚嶇О + 鐖剁骇灞傜骇閫夋嫨锛圕ascader锛? 閮ㄩ棬璐熻矗浜?const EMPTY = { name: "", parentPath: ["org-root", "org-tech", "org-tech-rd"], managerId: undefined };

export default function DepartmentModal() {
  const { modal, setModal, selectedDeptKey } = useApp();
  const [form, setForm] = useState({ ...EMPTY, parentPath: pathFromKey(selectedDeptKey) });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const close = () => {
    setForm({ ...EMPTY, parentPath: pathFromKey(selectedDeptKey) });
    setErrors({});
    setModal(null);
  };

  // 鎶婇€変腑鐨?dept key 杞崲鎴愬埌鏍圭殑璺緞鏁扮粍
  function pathFromKey(key) {
    const path = [];
    let cur = orgNodeMap[key];
    while (cur) {
      path.unshift(cur.key);
      cur = cur.parentKey ? orgNodeMap[cur.parentKey] : null;
    }
    return path.length ? path : ["org-root"];
  }

  const cascaderOptions = parentLevelOptions.map((root) => ({
    value: root.value,
    label: root.label,
    children: root.children.map((b) => ({
      value: b.value,
      label: b.label,
      children: b.children ? b.children.map((d) => ({ value: d.value, label: d.label })) : undefined,
    })),
  }));

  const parentKey = form.parentPath[form.parentPath.length - 1];
  const parentLevel = orgNodeMap[parentKey]?.level ?? 0;
  const newLevel = parentLevel + 1;
  const levelLabel = ["涓€绾э紙浜嬩笟閮級", "浜岀骇锛堥儴闂級", "涓夌骇锛堝皬缁勶級", "鍥涚骇锛堝皬闃燂級"][newLevel] || "瀛愮骇";

  const managerOptions = memberList
    .filter((m) => m.deptKey === parentKey || m.deptKey === selectedDeptKey)
    .slice(0, 8)
    .map((m) => ({ value: m.id, label: `${m.name} 路 ${m.title}` }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "璇疯緭鍏ラ儴闂ㄥ悕绉?;
    if (!form.parentPath || form.parentPath.length === 0) errs.parentPath = "璇烽€夋嫨鐖剁骇";
    const ok = Object.keys(errs).length === 0;
    setErrors(errs);
    return ok;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const parentName = orgNodeMap[parentKey]?.title || "鈥?;
    setNotice({ key: `N${Date.now()}`, text: `宸插湪銆?{parentName}銆嶄笅鍒涘缓 ${levelLabel} 閮ㄩ棬銆?{form.name}銆峘 });
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcIctNewFolder iconSize="1rem" iconColor={['currentcolor']} /> 鏂板缓閮ㄩ棬
        </span>
      }
      isOpen={modal === "department"}
      onClose={close}
      size={[520, "auto"]}
      destroyOnClose
      buttons={[
        { text: "鍙栨秷", onClick: close },
        { text: "鍒涘缓", status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">閫夋嫨鐖剁骇灞傜骇骞跺懡鍚嶆柊閮ㄩ棬锛屽彲鎸囧畾閮ㄩ棬璐熻矗浜恒€?/p>
      <form className="invite-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="d-name">閮ㄩ棬鍚嶇О</label>
            <div className="form-field">
              <TextField
                id="d-name"
                value={form.name}
                onChange={(value) => setForm((f) => ({ ...f, name: value }))}
                placeholder="濡?鏁版嵁涓彴缁?
                style={{ width: "100%" }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="d-parent">鐖剁骇灞傜骇</label>
            <div className="form-field">
              <Cascader
                id="d-parent"
                value={form.parentPath}
                onChange={(v) => setForm((f) => ({ ...f, parentPath: v }))}
                options={cascaderOptions}
                changeOnSelect
                style={{ width: "100%" }}
                placeholder="璇烽€夋嫨鐖剁骇閮ㄩ棬"
              />
              {errors.parentPath && <div className="form-error">{errors.parentPath}</div>}
            </div>
          </div>
        </div>

        <div className="dept-modal__level">
          <IconPlusIcDevBranch iconSize="0.875rem" iconColor={['var(--primary)']} />
          <span>鏂拌妭鐐瑰皢鍒涘缓涓?<Tag bordered={false} color="blue">{levelLabel}</Tag>锛屾寕鍦ㄣ€寋orgNodeMap[parentKey]?.title || "鈥?}銆嶄箣涓?/span>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label" htmlFor="d-mgr">閮ㄩ棬璐熻矗浜猴紙鍙€夛級</label>
            <Select
              id="d-mgr"
              value={form.managerId}
              onChange={(v) => setForm((f) => ({ ...f, managerId: v }))}
              options={managerOptions.map((o) => ({ text: o.label, value: o.value }))}
              enableClear
              defaultLabel="浠庣埗绾ч儴闂ㄦ垚鍛樹腑閫夋嫨"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </form>
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
