// Layer 4: 步骤一 — 基础信息表单
// eview-react Form:ref 托管,校验由父级 ref.submit() 触发,通过后回调 onSuccess(values)
// 多列布局约束:Form 内不允许 div 栅格,统一全宽(默认 itemCol=24)
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import { deviceTypeOptions, stationOptions, protocolData } from "../../data.js";

export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      className="step-form"
      validateErrorType="tip"
      onSuccess={onSuccess}
    >
      <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]}>
        <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
      </Form.Item>

      <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}>
        <Select options={deviceTypeOptions} defaultLabel="请选择设备类型" />
      </Form.Item>

      <Form.Item name="station" label="所属站点" rules={[{ required: true }]}>
        <Select options={stationOptions} defaultLabel="请选择所属站点" />
      </Form.Item>

      <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}>
        <SelectCard data={protocolData} />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200} />
      </Form.Item>
    </Form>
  );
}
