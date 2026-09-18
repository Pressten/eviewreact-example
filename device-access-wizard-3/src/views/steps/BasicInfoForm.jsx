import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import TextArea from '@nce/eview-react/TextArea';
import SelectCard from '@nce/eview-react/SelectCard';
import { deviceTypeOptions, stationOptions, protocolOptions } from '../../data.js';

// 步骤一 — 基础信息表单。
// antd 的 Form.useForm() + form prop → eview-react 的 ref；校验由父组件调 formRef.submit() 触发，
// 通过 onSuccess(values) 回调推进（非 Promise）。
export default function BasicInfoForm({ formRef, initialValues, onSuccess, onFailed }) {
    const deviceTypeOpts = deviceTypeOptions.map((o) => ({ text: o.label, value: o.value }));
    const stationOpts = stationOptions.map((o) => ({ text: o.label, value: o.value }));
    const protocolData = protocolOptions.map((p) => ({ text: p.label, value: p.value }));

    return (
        <Form
            ref={formRef}
            layout="vertical"
            className="step-form"
            initialValues={initialValues || {}}
            validateErrorType="tip"
            onSuccess={onSuccess}
            onFailed={onFailed}
        >
            <Form.Item label="设备名称" name="deviceName" rules={[{ required: true }]}>
                <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} />
            </Form.Item>

            <Form.Item label="设备类型" name="deviceType" rules={[{ required: true }]}>
                <Select options={deviceTypeOpts} defaultLabel="请选择设备类型" enableClear />
            </Form.Item>

            <Form.Item label="所属站点" name="station" rules={[{ required: true }]}>
                <Select options={stationOpts} defaultLabel="请选择所属站点" enableClear />
            </Form.Item>

            <Form.Item label="接入协议" name="protocol" rules={[{ required: true }]}>
                <SelectCard data={protocolData} />
            </Form.Item>

            <Form.Item label="备注" name="remark">
                <TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200} />
            </Form.Item>
        </Form>
    );
}
