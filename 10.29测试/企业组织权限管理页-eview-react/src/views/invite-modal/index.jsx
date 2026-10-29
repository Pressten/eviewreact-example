import { useState, useRef } from "react";
import dayjs from "dayjs";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Cascader from "@/shared/Cascader";
import Checkbox from "@nce/eview-react/Checkbox";
import Tag from "@/shared/Tag";
import DatePicker from "@/shared/DatePicker";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";
import { IconPlusIcPublicAddMember } from '@hui/icon-plus';
import { parentLevelOptions } from "../../mock/organization.js";
import "./index.css";


// 閭€璇锋垚鍛樿〃鍗?鈥?H5 楠ㄦ灦锛堜笉浣跨敤 antd Form/Form.Item锛?// 瀛楁锛氶偖绠便€佸鍚嶃€侀儴闂ㄧ骇鑱旈€夋嫨銆佽鑹层€佹湁鏁堟湡鏃ユ湡鑼冨洿銆佺數璇濓紙鍙€夛級銆佸彂閫侀個璇烽偖浠?const EMPTY = {
  email: "",
  name: "",
  deptPath: ["org-root", "org-tech", "org-tech-rd"],
  deptLabel: "鏄熻景绉戞妧 / 鎶€鏈爺鍙戜簨涓氶儴 / 鎶€鏈爺鍙戦儴",
  role: "member",
  validity: null,
  phone: "",
  sendInvite: true,
};

// Cascader 閫夐」锛堜粎 0/1/2 灞傦紝3 灞備负鍙跺瓙锛?const cascaderOptions = parentLevelOptions.map((root) => ({
  value: root.value,
  label: root.label,
  children: root.children.map((b) => ({
    value: b.value,
    label: b.label,
    children: b.children ? b.children.map((d) => ({ value: d.value, label: d.label })) : undefined,
  })),
}));

export default function InviteModal() {
  const { modal, setModal, roleConfig } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const dateRef = useRef(null);

  const close = () => {
    setForm(EMPTY);
    setErrors({});
    setModal(null);
  };

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "璇疯緭鍏ユ垚鍛樺鍚?;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "璇疯緭鍏ユ湁鏁堥偖绠卞湴鍧€";
    if (!form.deptPath || form.deptPath.length === 0) errs.deptPath = "璇烽€夋嫨鎵€灞為儴闂?;
    if (!form.role) errs.role = "璇烽€夋嫨瑙掕壊";
    if (!form.validity || form.validity.length !== 2) errs.validity = "璇烽€夋嫨鏈夋晥鏈熻寖鍥?;
    const ok = Object.keys(errs).length === 0;
    setErrors(errs);
    return ok;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const range = form.validity;
    const fmt = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "");
    setNotice({ key: `N${Date.now()}`, text: `閭€璇峰凡鍙戦€佽嚦 ${form.email}锛堟湁鏁堟湡 ${fmt(range[0])} 鑷?${fmt(range[1])}锛塦 });
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcPublicAddMember iconSize="1rem" iconColor={['currentcolor']} /> 閭€璇锋垚鍛?        </span>
      }
      isOpen={modal === "invite"}
      onClose={close}
      size={[560, "auto"]}
      destroyOnClose
      buttons={[
        { text: "鍙栨秷", onClick: close },
        { text: "鍙戦€侀個璇?, status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">濉啓鎴愬憳鍩烘湰淇℃伅涓庢湁鏁堟湡锛岀郴缁熷皢鍚戝叾閭鍙戦€佸姞鍏ラ個璇枫€?/p>
      <form className="invite-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-row">
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-email">閭</label>
            <div className="form-field">
              <TextField
                id="f-email"
                value={form.email}
                onChange={(value) => set("email", value)}
                placeholder="name@xingchen.com"
                style={{ width: "100%" }}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-name">濮撳悕</label>
            <div className="form-field">
              <TextField
                id="f-name"
                value={form.name}
                onChange={(value) => set("name", value)}
                placeholder="璇疯緭鍏ユ垚鍛樺鍚?
                style={{ width: "100%" }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-cell">
            <label className="form-label required">閮ㄩ棬绾ц仈閫夋嫨</label>
            <div className="form-field">
              {/* Cascader 鍖呰９褰㈡€侊細children 浣滀负瑙﹀彂鍣紙鎸夎鑼冭姹傦級 */}
              <Cascader
                options={cascaderOptions}
                changeOnSelect
                value={form.deptPath}
                onChange={(value, labels) => {
                  set("deptPath", value || []);
                  set("deptLabel", (labels || []).join(" / "));
                }}
                placeholder="璇烽€夋嫨鎵€灞為儴闂?
                style={{ width: "100%" }}
              />
              {errors.deptPath && <div className="form-error">{errors.deptPath}</div>}
            </div>
          </div>
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-role">瑙掕壊</label>
            <div className="form-field">
              <Select
                id="f-role"
                value={form.role}
                onChange={(v) => set("role", v)}
                defaultLabel="璇烽€夋嫨瑙掕壊"
                style={{ width: "100%" }}
                options={Object.entries(roleConfig).map(([k, v]) => ({
                  value: k,
                  text: (
                    <span className="form-option">
                      <Tag bordered={false} color={v.color}>{v.label}</Tag>
                      <span className="form-option-desc">{v.desc.slice(0, 18)}鈥?/span>
                    </span>
                  ),
                }))}
              />
              {errors.role && <div className="form-error">{errors.role}</div>}
            </div>
          </div>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-validity">鏈夋晥鏈熸棩鏈熻寖鍥?/label>
            <div className="form-field">
              <DatePicker
                id="f-validity"
                type="date"
                format="yyyy-MM-dd"
                range={form.validity ? form.validity : []}
                onChange={(dateString, date, target) => {
                  if (!date) return;
                  const from = target === "from" ? date : (form.validity ? form.validity[0] : null);
                  const to = target === "to" ? date : (form.validity ? form.validity[1] : null);
                  set("validity", [from, to]);
                }}
                placeholder="璇烽€夋嫨鏈夋晥鏈熻寖鍥?
                style={{ width: "100%" }}
              />
              {errors.validity && <div className="form-error">{errors.validity}</div>}
            </div>
          </div>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label" htmlFor="f-phone">鑱旂郴鐢佃瘽锛堝彲閫夛級</label>
            <TextField
              id="f-phone"
              value={form.phone}
              onChange={(value) => set("phone", value)}
              placeholder="濡?138-0010-0099"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="form-row form-row--full">
          <Checkbox label="鍚屾椂鍚戞垚鍛橀偖绠卞彂閫侀個璇烽偖浠?" value="sendInvite" checked={form.sendInvite} onChange={(value, checked) => set("sendInvite", checked)} />
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
