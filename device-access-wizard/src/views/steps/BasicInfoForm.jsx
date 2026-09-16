import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import TextArea from "@nce/eview-react/TextArea";
import { deviceTypeOptions, stationOptions, protocolOptions } from "../../data.js";

// Layer 4: 步骤一 — 基础信息表单
// antd Form form={form} → eview-react Form ref={formRef};校验由父级 ref.submit() 触发 → onSuccess 回调。
// Select options 的 label → text;placeholder → defaultLabel。Radio.Group + Radio.Button → SelectCard(data)。
export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
  const toOptions = (list) => list.map((o) => ({ value: o.value, text: o.label }));

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      validateErrorType="tip"
      onSuccess={onSuccess}
      onFailed={() => {}}
      className="step-form"
    >
      <Form.Item
        name="deviceName"
        label="设备名称"
        rules={[{ required: true }]}
      >
        <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
      </Form.Item>

      <div className="step-form-row">
        <Form.Item
          name="deviceType"
          label="设备类型"
          rules={[{ required: true }]}
        >
          <Select options={toOptions(deviceTypeOptions)} defaultLabel="请选择设备类型" enableClear />
        </Form.Item>
        <Form.Item
          name="station"
          label="所属站点"
          rules={[{ required: true }]}
        >
          <Select options={toOptions(stationOptions)} defaultLabel="请选择所属站点" enableClear />
        </Form.Item>
      </div>

      <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}>
        <SelectCard data={toOptions(protocolOptions)} />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <TextArea
          placeholder="补充设备用途、投运时间等信息(选填)"
          maxLength={200}
        />
      </Form.Item>
    </Form>
  );
}
