import Form from "@nce/eview-react/Form";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import TextArea from "@nce/eview-react/TextArea";
import TextField from "@nce/eview-react/TextField";
import { deviceTypeOptions, stationOptions, protocolOptions } from "../../data.js";

const toTextOptions = (options) => options.map(({ label, ...item }) => ({ ...item, text: label }));

// Layer 4: 步骤一 — 基础信息表单
export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      className="step-form"
      validateErrorType="tip"
      onSuccess={onSuccess}
      onFailed={() => {}}
      itemCol={12}
    >
      <Form.Item
        name="deviceName"
        label="设备名称"
        rules={[{ required: true }]}
      >
        <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
      </Form.Item>

      <Form.Item
        name="deviceType"
        label="设备类型"
        rules={[{ required: true }]}
      >
        <Select defaultLabel="请选择设备类型" options={toTextOptions(deviceTypeOptions)} />
      </Form.Item>
      <Form.Item
        name="station"
        label="所属站点"
        rules={[{ required: true }]}
      >
        <Select defaultLabel="请选择所属站点" options={toTextOptions(stationOptions)} />
      </Form.Item>

      <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}> 
        <SelectCard data={toTextOptions(protocolOptions)} />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <TextArea placeholder="补充设备用途、投运时间等信息(选填)" maxLength={200} />
      </Form.Item>
    </Form>
  );
}
