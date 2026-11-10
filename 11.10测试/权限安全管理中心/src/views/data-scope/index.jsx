import { useState } from "react";
import dayjs from "dayjs";
import { Radio, Tag, Select, Checkbox, Modal, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { DEPTS } from "../../mock/org.js";
import { SCOPE_OPTIONS } from "../../mock/policy.js";
import "./index.css";

const DATA_TYPE_OPTIONS = ["订单数据", "会员数据", "财务报表", "库存数据", "日志数据"].map((t) => ({
  label: t,
  value: t,
}));

const VALIDITY_OPTIONS = [
  { value: 30, label: "30 天" },
  { value: 90, label: "90 天" },
  { value: 180, label: "180 天" },
];

export default function DataScope() {
  const { dataScope, setDataScope, exceptions, removeException, addException } = useApp();
  const disabled = dataScope === "all";

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
    message.success(`已新增「${dept.deptName}」的跨部门授权，保存后生效`);
  };

  return (
    <section className="pc-card scope-card">
      <div className="section-head">
        <span className="section-icon"><Icon name="database" size="1.125rem" /></span>
        <div>
          <div className="section-title">数据权限范围</div>
          <div className="section-sub">控制角色可见的业务数据边界，例外授权可跨部门临时开放</div>
        </div>
      </div>
      <Radio.Group
        className="scope-group"
        value={dataScope}
        onChange={(e) => setDataScope(e.target.value)}
      >
        {SCOPE_OPTIONS.map((s) => (
          <Radio key={s.scopeId} value={s.scopeId} className="scope-radio">
            <span className="scope-name">{s.scopeName}</span>
            <span className="scope-desc">{s.scopeDesc}</span>
          </Radio>
        ))}
      </Radio.Group>
      <div className="exception-section">
        <div className="exception-head">
          <span className="exception-title">跨部门授权例外</span>
          <Tag color={disabled ? "default" : "blue"}>{exceptions.length} 条生效中</Tag>
          {disabled && <Tag color="warning">已选「全部数据」，例外配置自动失效</Tag>}
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
          {exceptions.map((ex) => (
            <div className="exc-row" key={ex.exceptionId}>
              <span className="exc-dept">{ex.deptName}</span>
              <span className="exc-types">
                {ex.dataTypes.map((t) => (
                  <Tag key={t}>{t}</Tag>
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
                  message.info(`已移除「${ex.deptName}」的跨部门授权，保存后生效`);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 新增例外授权 */}
      <Modal
        open={addOpen}
        title="新增跨部门授权例外"
        okText="确认新增"
        cancelText="取消"
        width={460}
        onOk={confirmAdd}
        onCancel={() => setAddOpen(false)}
      >
        <div className="ex-form">
          <div className="rm-field">
            <label className="form-label required" htmlFor="ex-dept">授权部门</label>
            <Select
              id="ex-dept"
              value={exDept}
              placeholder="选择要跨部门授权的部门"
              style={{ width: "100%" }}
              status={exErrors.dept ? "error" : undefined}
              options={DEPTS.filter((d) => !exceptions.some((e) => e.deptName === d.deptName)).map((d) => ({
                value: d.deptId,
                label: d.deptName,
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
              <Checkbox.Group
                options={DATA_TYPE_OPTIONS}
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
              <Select id="ex-days" value={exDays} options={VALIDITY_OPTIONS} style={{ width: "8rem" }} onChange={setExDays} />
              <span className="ex-validity-hint">
                即 {dayjs().add(exDays, "day").format("YYYY-MM-DD")} 到期
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
