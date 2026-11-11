import { useRef, useState } from "react";
import DialogPro from "@cloudsop/eview-ui/DialogPro";
import TextField from "@cloudsop/eview-ui/TextField";
import TextArea from "@cloudsop/eview-ui/TextArea";
import SelectPro from "@cloudsop/eview-ui/SelectPro";
import Checkbox from "@cloudsop/eview-ui/Checkbox";
import Button from "@cloudsop/eview-ui/Button";
import Icon from "@/shared/Icon";
import Notify from "@/shared/Notify";
import { useApp } from "../../context.jsx";
import { PERM_MODULES, PERM_ACTIONS, emptyPermMap } from "../../mock/perm.js";
import "./index.css";

// 新建 / 编辑角色 DialogPro（footer 自写——DialogPro 无 buttons prop）
export default function RoleModal({ mode, role, onClose }) {
  const { roles, perms, upsertRole } = useApp();
  const isEdit = mode === "edit";
  const notifyRef = useRef(null);

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
    notifyRef.current && notifyRef.current.show(
      "success",
      isEdit ? `角色「${name}」已更新，保存后生效` : `角色「${name}」已创建并切入该页签，保存后生效`
    );
    onClose();
  };

  return (
    // Modal→DialogPro：open→isOpen；title→customHeader；无 buttons prop——footer 自写；onClose 不自动关
    <DialogPro
      isOpen
      customHeader={isEdit ? "编辑角色" : "新建角色"}
      size={[680, "auto"]}
      onClose={onClose}
    >
      <Notify ref={notifyRef} />
      <div className="rm-form">
        <div className="rm-row">
          <div className="rm-field">
            <label className="form-label required" htmlFor="rm-name">角色名称</label>
            <div className="form-field">
              {/* Input→TextField：onChange(value1, value2, event)；maxLength→maxLength；无 status（API 表无，不写） */}
              <TextField
                id="rm-name"
                value={roleName}
                maxLength={16}
                placeholder="如：内容运营"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setRoleName(value);
                  setErrors((p) => ({ ...p, roleName: "" }));
                }}
              />
              {errors.roleName && <div className="form-error">{errors.roleName}</div>}
            </div>
          </div>
          <div className="rm-field">
            <label className="form-label" htmlFor="rm-copy">权限复制自</label>
            {/* Select→SelectPro：options 项 label→text；onChange(value, options)；disabled 同名；无 allowClear（API 表无，不写） */}
            <SelectPro
              id="rm-copy"
              value={copyFrom}
              placeholder="选择要复制权限的既有角色"
              style={{ width: "100%" }}
              disabled={isEdit}
              options={roles
                .filter((r) => !(isEdit && r.roleId === role.roleId))
                .map((r) => ({ value: r.roleId, text: r.roleName }))}
              onChange={(v) => handleCopyFrom(v)}
            />
            <div className="field-hint">切换后将以该角色的权限覆盖下方勾选</div>
          </div>
        </div>
        <div className="rm-field">
          <label className="form-label required" htmlFor="rm-desc">角色描述</label>
          <div className="form-field">
            {/* Input.TextArea→TextArea：onChange(value1, value2, event)；maxLength 自带计数；rows/cols 同名 */}
            <TextArea
              id="rm-desc"
              rows={2}
              maxLength={60}
              value={description}
              placeholder="一句话说明该角色的职责与权限边界"
              style={{ width: "100%" }}
              onChange={(value) => {
                setDescription(value);
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
                  {/* Checkbox：checked；indeterminate→halfChecked；onChange(value, checked, event, additionalData) 四参 */}
                  <Checkbox
                    checked={checkedCount === 3}
                    halfChecked={checkedCount > 0 && checkedCount < 3}
                    onChange={(_value, checked) => setRowAll(m.moduleId, checked)}
                  />
                  {PERM_ACTIONS.map((a) => (
                    <Checkbox
                      key={a.actionId}
                      checked={!!cell[a.actionId]}
                      onChange={(_value, checked) => setCell(m.moduleId, a.actionId, checked)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* footer 自写：children 末尾排按钮行 + setIsOpen(false) 关闭逻辑 */}
      <div className="rm-footer">
        <Button text="取消" onClick={onClose} />
        <Button status="primary" onClick={handleSubmit}>{isEdit ? "保存修改" : "创建角色"}</Button>
      </div>
    </DialogPro>
  );
}
