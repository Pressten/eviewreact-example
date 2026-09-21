import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import { deviceTypeOptions, stationOptions, protocolOptions } from "../../data.js";

// Layer 4: 步骤一 — 基础信息表单
// Form 模式：useForm→useRef；validateFields→ref.submit()+onSuccess；rules 无 message
// 多列用 Form 级 itemCol（不能用 div/Row/Col 做栅格）
export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues || {}}
      itemCol={12}
      className="step-form"
      validateErrorType="tip"
      onSuccess={onSuccess}
      onFailed={() => { /* 校验失败，停在本步 */ }}
    >
      <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }, { max: true, args: [32] }]}>
        <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
      </Form.Item>
      <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}>
        <Select options={deviceTypeOptions} defaultLabel="请选择设备类型" enableClear />
      </Form.Item>
      <Form.Item name="station" label="所属站点" rules={[{ required: true }]}>
        <Select options={stationOptions} defaultLabel="请选择所属站点" enableClear />
      </Form.Item>
      <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}>
        <SelectCard data={protocolOptions} />
      </Form.Item>
      <Form.Item name="remark" label="备注">
        <TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200} />
      </Form.Item>
    </Form>
  );
}
