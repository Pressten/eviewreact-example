import { useState } from "react";
import { Modal, Input, Select, Checkbox, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { PERM_MODULES, PERM_ACTIONS, emptyPermMap } from "../../mock/perm.js";
import "./index.css";

// 新建 / 编辑角色 Modal（H5 表单骨架，规则见 Form.md）
export default function RoleModal({ mode, role, onClose }) {
  const { roles, perms, upsertRole } = useApp();
  const isEdit = mode === "edit";

  const [roleName, setRoleName] = useState(isEdit ? role.roleName : "");
  const [description, setDescription] = useState(isEdit ? role.description : "");
  const [copyFrom, setCopyFrom] = useState(undefined);
  const [permPreview, setPermPreview] = useState(() =>
    isEdit ? JSON.parse(JSON.stringify(perms[role.roleId] || emptyPermMap())) : emptyPermMap()
  );
  const [errors, setErrors] = useState({ roleName: "", description: "" });

  const setCell = (moduleId, actionId, checked) => {
    setPermPreview((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [actionId]: checked },
    }));
  };

  const setRowAll = (moduleId, checked) => {
    setPermPreview((prev) => ({
      ...prev,
      [moduleId]: { view: checked, edit: checked, delete: checked },
    }));
  };

  const handleCopyFrom = (value) => {
    setCopyFrom(value);
    if (value) {
      setPermPreview(JSON.parse(JSON.stringify(perms[value] || emptyPermMap())));
    } else {
      setPermPreview(emptyPermMap());
    }
  };

  const handleSubmit = () => {
    const nextErrors = { roleName: "", description: "" };
    const name = roleName.trim();
    if (!name) {
      nextErrors.roleName = "请输入角色名称";
    } else if (roles.some((r) => r.roleName === name && r.roleId !== (isEdit ? role.roleId : ""))) {
      nextErrors.roleName = "角色名称已存在，请更换";
    }
    if (!description.trim()) {
      nextErrors.description = "请输入角色描述";
    }
    setErrors(nextErrors);
    if (nextErrors.roleName || nextErrors.description) return;

    const roleId = isEdit ? role.roleId : `role-${Date.now()}`;
    upsertRole({ roleId, roleName: name, description: description.trim() }, permPreview);
    message.success(isEdit ? `角色「${name}」已更新，保存后生效` : `角色「${name}」已创建并切入该页签，保存后生效`);
    onClose();
  };

  return (
    <Modal
      open
      title={isEdit ? "编辑角色" : "新建角色"}
      width={680}
      okText={isEdit ? "保存修改" : "创建角色"}
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <div className="rm-form">
        <div className="rm-row">
          <div className="rm-field">
            <label className="form-label required" htmlFor="rm-name">角色名称</label>
            <div className="form-field">
              <Input
                id="rm-name"
                value={roleName}
                maxLength={16}
                placeholder="如：内容运营"
                status={errors.roleName ? "error" : undefined}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  setErrors((p) => ({ ...p, roleName: "" }));
                }}
              />
              {errors.roleName && <div className="form-error">{errors.roleName}</div>}
            </div>
          </div>
          <div className="rm-field">
            <label className="form-label" htmlFor="rm-copy">权限复制自</label>
            <Select
              id="rm-copy"
              value={copyFrom}
              allowClear
              placeholder="选择要复制权限的既有角色"
              style={{ width: "100%" }}
              disabled={isEdit}
              options={roles
                .filter((r) => !(isEdit && r.roleId === role.roleId))
                .map((r) => ({ value: r.roleId, label: r.roleName }))}
              onChange={handleCopyFrom}
            />
            <div className="field-hint">切换后将以该角色的权限覆盖下方勾选</div>
          </div>
        </div>
        <div className="rm-field">
          <label className="form-label required" htmlFor="rm-desc">角色描述</label>
          <div className="form-field">
            <Input.TextArea
              id="rm-desc"
              rows={2}
              maxLength={60}
              value={description}
              placeholder="一句话说明该角色的职责与权限边界"
              status={errors.description ? "error" : undefined}
              style={{ width: "100%" }}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((p) => ({ ...p, description: "" }));
              }}
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
        </div>
        <div className="rm-field">
          <label className="form-label">权限预览勾选</label>
          <div className="perm-preview">
            <div className="pp-row pp-head">
              <span>功能模块</span>
              <span>全选</span>
              {PERM_ACTIONS.map((a) => (
                <span key={a.actionId}>{a.actionName}</span>
              ))}
            </div>
            {PERM_MODULES.map((m) => {
              const cell = permPreview[m.moduleId] || { view: false, edit: false, delete: false };
              const checkedCount = PERM_ACTIONS.filter((a) => cell[a.actionId]).length;
              return (
                <div className="pp-row" key={m.moduleId}>
                  <span className="pp-module" title={m.description}>{m.moduleName}</span>
                  <Checkbox
                    checked={checkedCount === 3}
                    indeterminate={checkedCount > 0 && checkedCount < 3}
                    onChange={(e) => setRowAll(m.moduleId, e.target.checked)}
                  />
                  {PERM_ACTIONS.map((a) => (
                    <Checkbox
                      key={a.actionId}
                      checked={!!cell[a.actionId]}
                      onChange={(e) => setCell(m.moduleId, a.actionId, e.target.checked)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
