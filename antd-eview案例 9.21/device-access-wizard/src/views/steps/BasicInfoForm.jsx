import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import { deviceTypeOptions, stationOptions, protocolOptions } from "../../data.js";

// Layer 4: 步骤一 — 基础信息表单
// 原库: hook 实例 + Promise 校验 → eview-react ref.submit() + onSuccess 回调
export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      itemCol={12}
      initialValues={initialValues || {}}
      validateErrorType="tip"
      onSuccess={onSuccess}
      onFailed={() => {
        /* 校验失败停留本步 */
      }}
      className="step-form"
    >
      <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]} col={24}>
        <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
      </Form.Item>

      <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}>
        <Select
          defaultLabel="请选择设备类型"
          options={deviceTypeOptions.map((o) => ({ text: o.label, value: o.value }))}
          enableClear
        />
      </Form.Item>
      <Form.Item name="station" label="所属站点" rules={[{ required: true }]}>
        <Select
          defaultLabel="请选择所属站点"
          options={stationOptions.map((o) => ({ text: o.label, value: o.value }))}
          enableClear
        />
      </Form.Item>

      <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]} col={24}>
        <SelectCard data={protocolOptions.map((o) => ({ text: o.label, value: o.value }))} />
      </Form.Item>

      <Form.Item name="remark" label="备注" col={24}>
        <TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200} />
      </Form.Item>
    </Form>
  );
}
