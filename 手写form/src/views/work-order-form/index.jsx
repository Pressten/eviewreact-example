// Layer 4 — 工单填写表单主体
// 布局与校验：H5（div/label/form）+ src/use-form.js
// 输入控件：仍使用 antd 的 Input / Select / DatePicker / Radio / Checkbox / InputNumber

import { Input, Select, DatePicker, Radio, Checkbox, InputNumber, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import FormSection from "../../components/form-section/index.jsx";
import FormField from "../../components/form-field/index.jsx";
import UploadDropzone from "../../components/upload-dropzone/index.jsx";
import {
  workOrderTypes,
  priorities,
  idcList,
  devices,
  issueCategories,
  impactScopes,
  teams,
  assignees,
} from "../../mock/workOrder.js";
import "./index.css";

const { TextArea } = Input;

const deptOptions = [
  { value: "ops", label: "运维部" },
  { value: "dev", label: "研发中心" },
  { value: "sec", label: "安全合规部" },
  { value: "biz", label: "业务运营部" },
];

export default function WorkOrderForm({ form, onCancel, onSaveDraft, onSubmit }) {
  const values = form.values;
  const errors = form.errors;

  const device = devices.find(function (d) { return d.code === values.device; });
  const assigneeOptions = assignees.filter(function (a) { return !values.team || a.team === values.team; });

  // antd 的 Select / DatePicker / InputNumber 没有默认宽度，它们原本靠 Form.Item
  // 注入的 `-in-form-item` 类拿到 width:100%；脱离 Form.Item 后必须显式补齐，
  // 否则会退回内容宽度。（Input / TextArea 自带 width:100%，不受影响）
  const FULL_WIDTH = { width: "100%" };

  // 控件通用绑定：值 + 撑满字段宽度 + 错误态（antd 控件自带 status="error" 视觉）
  function bind(name) {
    return {
      id: name,
      style: FULL_WIDTH,
      value: values[name],
      status: errors[name] ? "error" : undefined,
    };
  }

  // 文本类控件：失焦才校验，避免边输入边报错
  function textBind(name) {
    return Object.assign(bind(name), {
      onChange: function (e) { form.setValue(name, e.target.value); },
      onBlur: function () { form.touch(name); },
    });
  }

  // 选择类控件：无稳定失焦事件，变更后立即复校
  function selectBind(name) {
    return Object.assign(bind(name), {
      onChange: function (value) { form.setValue(name, value); form.touch(name); },
    });
  }

  function submitForm(e) {
    e.preventDefault();
    onSubmit(false);
  }

  return (
    <form className="work-order-form" onSubmit={submitForm} noValidate>
      <FormSection index="1" icon="clipboard-list" title="基本信息" desc="工单的整体标识、类型与时限要求">
        <div className="field-grid">
          <FormField
            full
            name="title"
            label="工单标题"
            required={form.required("title")}
            error={errors.title}
          >
            <Input
              {...textBind("title")}
              placeholder="例如：A 机房核心交换机 SW-HD1-CORE-01 端口持续抖动告警"
              maxLength={80}
              allowClear
            />
          </FormField>

          <FormField name="type" label="工单类型" required={form.required("type")} error={errors.type}>
            <Select {...selectBind("type")} placeholder="请选择工单类型" options={workOrderTypes} />
          </FormField>

          <FormField name="dueTime" label="期望完成时间" required={form.required("dueTime")} error={errors.dueTime}>
            <DatePicker
              {...selectBind("dueTime")}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder="选择日期与时间"
            />
          </FormField>

          <FormField
            full
            name="priority"
            label="优先级"
            required={form.required("priority")}
            error={errors.priority}
            hint="紧急 P0 会立即触发值班电话与短信通知，请谨慎选择。"
          >
            <Radio.Group
              {...selectBind("priority")}
              options={priorities.map(function (p) {
                return { value: p.value, label: p.label };
              })}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        index="2"
        icon="server"
        title="设备与位置"
        desc="关联设备后自动带出型号与机柜位置，无需手工填写"
        extra={
          device ? (
            <span className="form-section__badge">
              <Icon name="circle-check" size="0.875rem" />
              已定位设备
            </span>
          ) : null
        }
      >
        <div className="field-grid">
          <FormField full name="device" label="关联设备" required={form.required("device")} error={errors.device}>
            <Select
              {...selectBind("device")}
              showSearch
              allowClear
              placeholder="输入设备编号或名称搜索"
              options={devices}
              optionFilterProp="label"
              suffixIcon={<Icon name="search" size="0.875rem" />}
            />
          </FormField>

          <FormField name="deviceType" label="设备类型">
            <Input value={device ? device.name : ""} placeholder="选择设备后自动带出" disabled />
          </FormField>

          <FormField name="deviceModel" label="设备型号">
            <Input value={device ? device.model : ""} placeholder="选择设备后自动带出" disabled />
          </FormField>

          <FormField name="deviceIdc" label="所在机房">
            <Input
              value={device ? device.idcName + " · " + device.room : ""}
              placeholder="选择设备后自动带出"
              disabled
            />
          </FormField>

          <FormField name="deviceRack" label="机柜位置 / U 位">
            <Input value={device ? device.rack : ""} placeholder="选择设备后自动带出" disabled />
          </FormField>
        </div>
      </FormSection>

      <FormSection index="3" icon="file-text" title="问题描述" desc="描述越具体，分派与定位越准确">
        <div className="field-grid">
          <FormField
            full
            name="issueCategory"
            label="问题分类"
            required={form.required("issueCategory")}
            error={errors.issueCategory}
          >
            <Select
              {...selectBind("issueCategory")}
              mode="multiple"
              allowClear
              maxTagCount="responsive"
              placeholder="可多选，例如：网络异常、硬件告警"
              options={issueCategories}
            />
          </FormField>

          <FormField full name="impactScopes" label="影响范围" hint="可多选，用于判定停机和审批级别。">
            <Checkbox.Group
              value={values.impactScopes}
              onChange={function (checked) { form.setValue("impactScopes", checked); }}
              options={impactScopes}
            />
          </FormField>

          <FormField
            full
            name="description"
            label="详细描述"
            required={form.required("description")}
            error={errors.description}
          >
            <TextArea
              {...textBind("description")}
              rows={5}
              maxLength={500}
              showCount
              placeholder="请说明故障现象、发生时间、已观察到的告警信息与业务影响"
            />
          </FormField>

          <FormField
            full
            name="tempMeasure"
            label="是否已采取临时措施"
            required={form.required("tempMeasure")}
            error={errors.tempMeasure}
          >
            <Radio.Group
              {...selectBind("tempMeasure")}
              options={[
                { value: "yes", label: "已采取" },
                { value: "no", label: "尚未采取" },
              ]}
            />
          </FormField>

          {values.tempMeasure === "yes" ? (
            <FormField
              full
              name="tempMeasureDesc"
              label="临时措施说明"
              required={form.required("tempMeasureDesc")}
              error={errors.tempMeasureDesc}
            >
              <TextArea
                {...textBind("tempMeasureDesc")}
                rows={3}
                maxLength={200}
                showCount
                placeholder="例如：已将流量切换至备用链路，并保留现场日志"
              />
            </FormField>
          ) : null}
        </div>
      </FormSection>

      <FormSection index="4" icon="users" title="处理与指派" desc="分派团队与处理人，评估处理工时">
        <div className="field-grid">
          <FormField name="team" label="指派团队" required={form.required("team")} error={errors.team}>
            <Select
              {...selectBind("team")}
              placeholder="请选择团队"
              options={teams}
              onChange={function (value) {
                form.setValues({ team: value, assignee: undefined });
                form.touch("team");
              }}
            />
          </FormField>

          <FormField
            name="assignee"
            label="处理人"
            required={form.required("assignee")}
            error={errors.assignee}
            hint={values.team ? "仅显示所选团队的成员" : "请先选择指派团队"}
          >
            <Select {...selectBind("assignee")} placeholder="请选择处理人" options={assigneeOptions} disabled={!values.team} />
          </FormField>

          <FormField
            name="planHours"
            label="计划工时"
            required={form.required("planHours")}
            error={errors.planHours}
            hint="单位：小时，超过 8 小时需主管审批"
          >
            <InputNumber
              {...selectBind("planHours")}
              mode="spinner"
              variant="outlined"
              min={0.5}
              max={72}
              step={0.5}
            />
          </FormField>

          <FormField name="onsiteSupport" label="是否需要现场支持" hint="需要现场支持时会通知机房值班人员。">
            <Radio.Group
              {...selectBind("onsiteSupport")}
              options={[
                { value: "yes", label: "需要" },
                { value: "no", label: "不需要" },
              ]}
            />
          </FormField>

          <FormField full name="ccUsers" label="抄送" hint="抄送人会收到工单进展通知">
            <Select
              {...selectBind("ccUsers")}
              mode="multiple"
              allowClear
              maxTagCount="responsive"
              placeholder="选择需要抄送的同事"
              options={assignees}
            />
          </FormField>

          <FormField full name="remark" label="备注" hint="补充说明，例如备件申领、变更窗口要求等。">
            <TextArea {...textBind("remark")} rows={3} maxLength={200} showCount placeholder="选填" />
          </FormField>
        </div>
      </FormSection>

      <FormSection index="5" icon="paperclip" title="附件材料" desc="告警截图、日志文件或拓扑图，有助于快速定位问题">
        <UploadDropzone maxSize={20} />
      </FormSection>

      <FormSection index="6" icon="phone" title="联系与确认" desc="用于处理过程中的沟通与回访">
        <div className="field-grid">
          <FormField
            name="contactName"
            label="联系人"
            required={form.required("contactName")}
            error={errors.contactName}
          >
            <Input {...textBind("contactName")} placeholder="请填写联系人姓名" maxLength={20} />
          </FormField>

          <FormField name="contactDept" label="所属部门">
            <Select {...selectBind("contactDept")} allowClear placeholder="请选择所属部门" options={deptOptions} />
          </FormField>

          <FormField
            name="contactPhone"
            label="联系电话"
            required={form.required("contactPhone")}
            error={errors.contactPhone}
          >
            <Input {...textBind("contactPhone")} placeholder="用于紧急联系，11 位手机号" maxLength={11} />
          </FormField>

          <FormField
            name="contactEmail"
            label="邮箱"
            required={form.required("contactEmail")}
            error={errors.contactEmail}
          >
            <Input {...textBind("contactEmail")} placeholder="用于工单结果通知" />
          </FormField>

          <FormField name="employeeNo" label="工号">
            <Input {...textBind("employeeNo")} placeholder="选填，例如 E100238" maxLength={12} />
          </FormField>

          <FormField name="relatedIdc" label="关联机房">
            <Select {...selectBind("relatedIdc")} allowClear placeholder="选填，选择关联机房" options={idcList} />
          </FormField>

          <FormField
            full
            name="agreement"
            label="服务协议确认"
            required={form.required("agreement")}
            error={errors.agreement}
          >
            <Checkbox
              id="agreement"
              checked={!!values.agreement}
              onChange={function (e) { form.setValue("agreement", e.target.checked); form.touch("agreement"); }}
            >
              我已确认所填信息真实有效，并同意按照《ICT 运维服务协议》承担相应责任，
              <a className="form-link" href="#" onClick={function (e) { e.preventDefault(); }}>
                查看协议详情
              </a>
            </Checkbox>
          </FormField>
        </div>
      </FormSection>

      <footer className="work-order-form__footer">
        <span className="work-order-form__footer-tip">
          <Icon name="circle-alert" size="0.875rem" />
          带 <span className="form-required-mark">*</span> 的为必填项，提交后将自动进入审批流
        </span>
        <div className="work-order-form__footer-actions">
          <Button onClick={onCancel}>取消</Button>
          <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSaveDraft}>暂存草稿</Button>
          <Button type="primary" htmlType="submit" icon={<Icon name="send" size="0.875rem" />}>
            提交工单
          </Button>
        </div>
      </footer>
    </form>
  );
}
