import { useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Cascader from "@/shared/Cascader";
import Tag from "@/shared/Tag";
import { IconPlusIcIctNewFolder, IconPlusIcDevBranch } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import { parentLevelOptions, orgNodeMap } from "../../mock/organization.js";
import { memberList } from "../../mock/members.js";
import "./index.css";

// 新建部门 — 名称 + 父级层级选择（Cascader）+ 部门负责人
const EMPTY = { name: "", parentPath: ["org-root", "org-tech", "org-tech-rd"], managerId: "" };

export default function DepartmentModal() {
  const { modal, setModal, selectedDeptKey, notify } = useApp();
  const [form, setForm] = useState({ ...EMPTY, parentPath: pathFromKey(selectedDeptKey) });
  const [errors, setErrors] = useState({});

  const close = () => {
    setForm({ ...EMPTY, parentPath: pathFromKey(selectedDeptKey) });
    setErrors({});
    setModal(null);
  };

  // 把选中的 dept key 转换成到根的路径数组
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
  const levelLabel = ["一级（事业部）", "二级（部门）", "三级（小组）", "四级（小队）"][newLevel] || "子级";

  const managerOptions = [
    { value: "", text: "不指定负责人" },
    ...memberList
      .filter((m) => m.deptKey === parentKey || m.deptKey === selectedDeptKey)
      .slice(0, 8)
      .map((m) => ({ value: m.id, text: `${m.name} · ${m.title}` })),
  ];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "请输入部门名称";
    if (!form.parentPath || form.parentPath.length === 0) errs.parentPath = "请选择父级";
    const ok = Object.keys(errs).length === 0;
    setErrors(errs);
    return ok;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const parentName = orgNodeMap[parentKey]?.title || "—";
    notify({ type: "success", title: `已在「${parentName}」下创建 ${levelLabel} 部门「${form.name}」` });
    close();
  };

  return (
    <Dialog
      title={
        <span className="modal-title">
          <IconPlusIcIctNewFolder iconSize="1rem" iconColor={['currentcolor']} /> 新建部门
        </span>
      }
      isOpen={modal === "department"}
      onClose={close}
      size={[520, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: close },
        { text: "创建", status: "primary", onClick: onSubmit },
      ]}
    >
      <p className="modal-sub">选择父级层级并命名新部门，可指定部门负责人。</p>
      <form className="invite-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="d-name">部门名称</label>
            <div className="form-field">
              <TextField
                id="d-name"
                value={form.name}
                status={errors.name ? "error" : undefined}
                onChange={(value) => setForm((f) => ({ ...f, name: value }))}
                placeholder="如 数据中台组"
                style={{ width: "100%" }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="d-parent">父级层级</label>
            <div className="form-field">
              <Cascader
                id="d-parent"
                value={form.parentPath}
                status={errors.parentPath ? "error" : undefined}
                onChange={(v) => setForm((f) => ({ ...f, parentPath: v }))}
                options={cascaderOptions}
                changeOnSelect
                style={{ width: "100%" }}
                placeholder="请选择父级部门"
              />
              {errors.parentPath && <div className="form-error">{errors.parentPath}</div>}
            </div>
          </div>
        </div>

        <div className="dept-modal__level">
          <IconPlusIcDevBranch iconSize="0.875rem" iconColor={['var(--primary)']} />
          <span>新节点将创建为 <Tag bordered={false} color="blue">{levelLabel}</Tag>，挂在「{orgNodeMap[parentKey]?.title || "—"}」之下</span>
        </div>

        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label" htmlFor="d-mgr">部门负责人（可选）</label>
            <Select
              id="d-mgr"
              value={form.managerId}
              onChange={(v) => setForm((f) => ({ ...f, managerId: v }))}
              options={managerOptions}
              enableClear
              defaultLabel="从父级部门成员中选择"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
