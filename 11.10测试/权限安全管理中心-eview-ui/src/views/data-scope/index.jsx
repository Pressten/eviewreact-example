import { useRef, useState } from "react";
import dayjs from "dayjs";
import Radio from "@cloudsop/eview-ui/Radio";
import Tag from "@cloudsop/eview-ui/Tag";
import SelectPro from "@cloudsop/eview-ui/SelectPro";
import CheckboxGroup from "@cloudsop/eview-ui/CheckboxGroup";
import DialogPro from "@cloudsop/eview-ui/DialogPro";
import Button from "@cloudsop/eview-ui/Button";
import Icon from "@/shared/Icon";
import Notify from "@/shared/Notify";
import { useApp } from "../../context.jsx";
import { DEPTS } from "../../mock/org.js";
import { SCOPE_OPTIONS } from "../../mock/policy.js";
import "./index.css";

// antd Select options {label,value} → eview-ui {text,value}（eview-ui 全家 text）
const DATA_TYPE_OPTIONS = ["订单数据", "会员数据", "财务报表", "库存数据", "日志数据"].map((t) => ({
  text: t,
  value: t,
}));

const VALIDITY_OPTIONS = [
  { value: 30, text: "30 天" },
  { value: 90, text: "90 天" },
  { value: 180, text: "180 天" },
];

export default function DataScope() {
  const { dataScope, setDataScope, exceptions, removeException, addException } = useApp();
  const disabled = dataScope === "all";
  const notifyRef = useRef(null);

  // 新增例外授权表单
  const [addOpen, setAddOpen] = useState(false);
  const [exDept, setExDept] = useState(undefined);
  const [exTypes, setExTypes] = useState([]);
  const [exDays, setExDays] = useState(90);
  const [exErrors, setExErrors] = useState({ dept: "", types: "" });

  const openAdd = () => {
    setExDept(undefined);
    setExTypes([]);
    setExDays(90);
    setExErrors({ dept: "", types: "" });
    setAddOpen(true);
  };

  const confirmAdd = () => {
    const errors = { dept: exDept ? "" : "请选择要授权的部门", types: exTypes.length ? "" : "至少勾选一种可看数据类型" };
    setExErrors(errors);
    if (errors.dept || errors.types) return;
    const dept = DEPTS.find((d) => d.deptId === exDept);
    addException({
      deptName: dept.deptName,
      dataTypes: [...exTypes],
      validUntil: dayjs().add(exDays, "day").format("YYYY-MM-DD"),
    });
    setAddOpen(false);
    notifyRef.current && notifyRef.current.show("success", `已新增「${dept.deptName}」的跨部门授权，保存后生效`);
  };

  return (
    <section className="pc-card scope-card">
      <Notify ref={notifyRef} />
      <div className="section-head">
        <span className="section-icon"><Icon name="database" size="1.125rem" /></span>
        <div>
          <div className="section-title">数据权限范围</div>
          <div className="section-sub">控制角色可见的业务数据边界，例外授权可跨部门临时开放</div>
        </div>
      </div>
      {/* Radio.Group → 单个 Radio：label prop（= antd children）；onChange(value, event) 首参是值。
          eview-ui Radio label 是 string 不支持 children JSX，scopeDesc 改为 Radio 之后的同级 span（保留 .scope-name/.scope-desc 视觉）。 */}
      <div className="scope-group">
        {SCOPE_OPTIONS.map((s) => (
          <div className="scope-radio" key={s.scopeId}>
            <Radio
              value={s.scopeId}
              checked={dataScope === s.scopeId}
              onChange={(value) => setDataScope(value)}
              label={s.scopeName}
            />
            <span className="scope-desc">{s.scopeDesc}</span>
          </div>
        ))}
      </div>
      <div className="exception-section">
        <div className="exception-head">
          <span className="exception-title">跨部门授权例外</span>
          <Tag type="status" color={disabled ? "default" : "primary"}>{exceptions.length} 条生效中</Tag>
          {disabled && <Tag type="status" color="warning">已选「全部数据」，例外配置自动失效</Tag>}
          {!disabled && (
            <a className="add-exception-link" onClick={openAdd}>
              <Icon name="plus" size="0.875rem" />
              新增例外授权
            </a>
          )}
        </div>
        <div className={"exception-list" + (disabled ? " is-disabled" : "")}>
          <div className="exc-row exc-head-row">
            <span>部门</span>
            <span>可看数据类型</span>
            <span>有效期至</span>
            <span>操作</span>
          </div>
          {(exceptions || []).map((ex) => (
            <div className="exc-row" key={ex.exceptionId}>
              <span className="exc-dept">{ex.deptName}</span>
              <span className="exc-types">
                {ex.dataTypes.map((t) => (
                  <Tag key={t} type="message">{t}</Tag>
                ))}
              </span>
              <span className="mono-text">{ex.validUntil}</span>
              <Icon
                name="trash-2"
                size="0.875rem"
                className="tbl-op"
                title="移除例外授权"
                onClick={() => {
                  removeException(ex.exceptionId);
                  notifyRef.current && notifyRef.current.show("info", `已移除「${ex.deptName}」的跨部门授权，保存后生效`);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 新增例外授权 Modal → DialogPro：footer 自写 */}
      <DialogPro
        isOpen={addOpen}
        customHeader="新增跨部门授权例外"
        size={[460, "auto"]}
        onClose={() => setAddOpen(false)}
      >
        <div className="ex-form">
          <div className="rm-field">
            <label className="form-label required" htmlFor="ex-dept">授权部门</label>
            {/* Select→SelectPro：options 项 label→text；onChange(value, options)；无 status（API 表无，不写） */}
            <SelectPro
              id="ex-dept"
              value={exDept}
              placeholder="选择要跨部门授权的部门"
              style={{ width: "100%" }}
              options={DEPTS.filter((d) => !exceptions.some((e) => e.deptName === d.deptName)).map((d) => ({
                value: d.deptId,
                text: d.deptName,
              }))}
              onChange={(v) => {
                setExDept(v);
                setExErrors((p) => ({ ...p, dept: "" }));
              }}
            />
            {exErrors.dept && <div className="form-error">{exErrors.dept}</div>}
          </div>
          <div className="rm-field">
            <span className="form-label required">可看数据类型</span>
            <div className="ex-field">
              {/* Checkbox.Group → CheckboxGroup：options→data（项 label→text）；value[]；onChange(newValue[], oldValue[], event) */}
              <CheckboxGroup
                data={DATA_TYPE_OPTIONS}
                value={exTypes}
                onChange={(vals) => {
                  setExTypes(vals);
                  setExErrors((p) => ({ ...p, types: "" }));
                }}
              />
              {exErrors.types && <div className="form-error">{exErrors.types}</div>}
            </div>
          </div>
          <div className="rm-field">
            <label className="form-label" htmlFor="ex-days">有效期</label>
            <div className="ex-validity">
              <SelectPro id="ex-days" value={exDays} options={VALIDITY_OPTIONS} style={{ width: "8rem" }} onChange={(v) => setExDays(v)} />
              <span className="ex-validity-hint">
                即 {dayjs().add(exDays, "day").format("YYYY-MM-DD")} 到期
              </span>
            </div>
          </div>
        </div>
        {/* footer 自写 */}
        <div className="rm-footer">
          <Button text="取消" onClick={() => setAddOpen(false)} />
          <Button text="确认新增" status="primary" onClick={confirmAdd} />
        </div>
      </DialogPro>
    </section>
  );
}
