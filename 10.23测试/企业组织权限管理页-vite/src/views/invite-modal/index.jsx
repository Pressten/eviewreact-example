import { useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Cascader from "@/shared/Cascader";
import Checkbox from "@nce/eview-react/Checkbox";
import Tag from "@/shared/Tag";
import DatePicker from "@/shared/DatePicker";
import { IconPlusIcPublicAddMember } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { parentLevelOptions } from "../../mock/organization.js";
import "./index.css";

// 邀请成员表单 — H5 骨架（不使用 antd Form/Form.Item）
// 字段：邮箱、姓名、部门级联选择、角色、有效期日期范围、电话（可选）、发送邀请邮件
const EMPTY = {
  email: "",
  name: "",
  deptPath: ["org-root", "org-tech", "org-tech-rd"],
  deptLabel: "星辰科技 / 技术研发事业部 / 技术研发部",
  role: "member",
  validity: null,
  phone: "",
  sendInvite: true,
};

// Cascader 选项（仅 0/1/2 层，3 层为叶子）
const cascaderOptions = parentLevelOptions.map((root) => ({
  value: root.value,
  label: root.label,
  children: root.children.map((b) => ({
    value: b.value,
    label: b.label,
    children: b.children ? b.children.map((d) => ({ value: d.value, label: d.label })) : undefined,
  })),
}));

export default function InviteModal() {
  const { modal, setModal, roleConfig, notify } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

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
    if (!form.name.trim()) errs.name = "请输入成员姓名";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "请输入有效邮箱地址";
    if (!form.deptPath || form.deptPath.length === 0) errs.deptPath = "请选择所属部门";
    if (!form.role) errs.role = "请选择角色";
    if (!form.validity || form.validity.length !== 2) errs.validity = "请选择有效期范围";
    const ok = Object.keys(errs).length === 0;
    setErrors(errs);
    return ok;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const range = form.validity;
    const fmt = (d) => {
      if (!d) return "";
      const dt = d instanceof Date ? d : new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    };
    notify({ type: "success", title: `邀请已发送至 ${form.email}（有效期 ${fmt(range[0])} 至 ${fmt(range[1])}）` });
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcPublicAddMember iconSize="1rem" iconColor={['currentcolor']} /> 邀请成员
        </span>
      }
      isOpen={modal === "invite"}
      onClose={close}
      size={[560, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: close },
        { text: "发送邀请", status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">填写成员基本信息与有效期，系统将向其邮箱发送加入邀请。</p>
      <form className="invite-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-row">
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-email">邮箱</label>
            <div className="form-field">
              <TextField
                id="f-email"
                value={form.email}
                status={errors.email ? "error" : undefined}
                onChange={(value) => set("email", value)}
                placeholder="name@xingchen.com"
                style={{ width: "100%" }}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-name">姓名</label>
            <div className="form-field">
              <TextField
                id="f-name"
                value={form.name}
                status={errors.name ? "error" : undefined}
                onChange={(value) => set("name", value)}
                placeholder="请输入成员姓名"
                style={{ width: "100%" }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-cell">
            <label className="form-label required">部门级联选择</label>
            <div className="form-field">
              <Cascader
                options={cascaderOptions}
                changeOnSelect
                value={form.deptPath}
                status={errors.deptPath ? "error" : undefined}
                onChange={(value, labels) => {
                  set("deptPath", value || []);
                  set("deptLabel", (labels || []).join(" / "));
                }}
                style={{ width: "100%" }}
                placeholder="请选择所属部门"
              />
              {errors.deptPath && <div className="form-error">{errors.deptPath}</div>}
            </div>
          </div>
          <div className="form-cell">
            <label className="form-label required" htmlFor="f-role">角色</label>
            <div className="form-field">
              <Select
                id="f-role"
                value={form.role}
                status={errors.role ? "error" : undefined}
                onChange={(v) => set("role", v)}
                style={{ width: "100%" }}
                options={Object.entries(roleConfig).map(([k, v]) => ({
                  value: k,
                  text: (
                    <span className="form-option">
                      <Tag bordered={false} color={v.color}>{v.label}</Tag>
                      <span className="form-option-desc">{v.desc.slice(0, 18)}…</span>
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
            <label className="form-label required" htmlFor="f-validity">有效期日期范围</label>
            <div className="form-field">
              <DatePicker
                id="f-validity"
                type="date"
                format="yyyy-MM-dd"
                range={form.validity ? form.validity : []}
                status={errors.validity ? "error" : undefined}
                onChange={(dateString, date, target) => {
                  if (!date) return;
                  if (target === "from") {
                    set("validity", [date, form.validity?.[1] || null]);
                  } else if (target === "to") {
                    set("validity", [form.validity?.[0] || null, date]);
                  }
                }}
                style={{ width: "100%" }}
              />
              {errors.validity && <div className="form-error">{errors.validity}</div>}
            </div>
          </div>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label" htmlFor="f-phone">联系电话（可选）</label>
            <TextField
              id="f-phone"
              value={form.phone}
              onChange={(value) => set("phone", value)}
              placeholder="如 138-0010-0099"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="form-row form-row--full">
          <Checkbox
            label="同时向成员邮箱发送邀请邮件"
            checked={form.sendInvite}
            onChange={(value, checked) => set("sendInvite", checked)}
          />
        </div>
      </form>
    </Dialog>
  );
}
