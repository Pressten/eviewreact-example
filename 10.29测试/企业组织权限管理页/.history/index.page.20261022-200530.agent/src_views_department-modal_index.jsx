import { useState } from "react";
import { Modal, Input, Select, Cascader, Tag, message } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { parentLevelOptions, orgNodeMap } from "../../mock/organization.js";
import { memberList } from "../../mock/members.js";
import "./index.css";

// 新建部门 — 名称 + 父级层级选择（Cascader）+ 部门负责人
const EMPTY = { name: "", parentPath: ["org-root", "org-tech", "org-tech-rd"], managerId: undefined };

export default function DepartmentModal() {
  const { modal, setModal, selectedDeptKey } = useApp();
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

  const managerOptions = memberList
    .filter((m) => m.deptKey === parentKey || m.deptKey === selectedDeptKey)
    .slice(0, 8)
    .map((m) => ({ value: m.id, label: `${m.name} · ${m.title}` }));

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
    message.success(`已在「${parentName}」下创建 ${levelLabel} 部门「${form.name}」`);
    close();
  };

  return (
    <Modal
      title={
        <span className="modal-title">
          <Icon name="folder-plus" size="1rem" /> 新建部门
        </span>
      }
      open={modal === "department"}
      onCancel={close}
      onOk={onSubmit}
      okText="创建"
      cancelText="取消"
      width={520}
      destroyOnClose
    >
      <p className="modal-sub">选择父级层级并命名新部门，可指定部门负责人。</p>
      <form className="invite-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-row form-row--full">
          <div className="form-cell">
            <label className="form-label required" htmlFor="d-name">部门名称</label>
            <div className="form-field">
              <Input
                id="d-name"
                value={form.name}
                status={errors.name ? "error" : undefined}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
          <Icon name="git-branch" size="0.875rem" color="var(--primary)" />
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
              allowClear
              showSearch
              placeholder="从父级部门成员中选择"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
