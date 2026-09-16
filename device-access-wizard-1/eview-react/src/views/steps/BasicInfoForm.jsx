import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import TextArea from '@nce/eview-react/TextArea';
import SelectCard from '@nce/eview-react/SelectCard';
import { deviceTypeOptions, stationOptions, protocolOptions } from '../../data';

// 步骤一 — 基础信息表单
// 转换要点：
//   - Form form={form} → ref={formRef}，校验走 onSuccess 回调
//   - Input → TextField；Select options label→text、placeholder→defaultLabel、allowClear→enableClear
//   - Radio.Group + Radio.Button → SelectCard（data=[{text,value}]）
//   - Input.TextArea → TextArea（maxLength 自带计数，替代 showCount）
//   - rules 删 message；{max:32} → 控件 maxLength
//   - 多列布局：Form 内不能用 div/Row/Col 做栅格，改用 Form 级 itemCol（所有项统一半宽）
export default function BasicInfoForm({ formRef, initialValues, onSuccess, onFailed }) {
  return (
    <Form
      ref={formRef}
      initialValues={initialValues}
      layout="vertical"
      itemCol={12}
      validateErrorType="tip"
      onSuccess={onSuccess}
      onFailed={onFailed}
      className="step-form"
    >
      <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]}>
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
        <TextArea placeholder="补充设备用途、投运时间等信息(选填)" maxLength={200} />
      </Form.Item>
    </Form>
  );
}
