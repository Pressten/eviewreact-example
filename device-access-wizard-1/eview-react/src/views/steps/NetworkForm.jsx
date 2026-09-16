import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Spinner from '@nce/eview-react/Spinner';
import Toggle from '@nce/eview-react/Toggle';

// 步骤二 — 网络配置表单
// 转换要点：
//   - InputNumber → Spinner（min/max 保留；rules 用 range:true, args:[min,max]）
//   - Input 带 pattern rule → TextField validator 返回 {result, message}
//   - Switch → Toggle，Form.Item 加 valuePropName="toggled" updateTrigger="onToggle"
const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;
const hostValidator = (value) => ({
  result: !value || HOST_PATTERN.test(value),
  message: '仅支持域名或 IP 格式',
});

export default function NetworkForm({ formRef, initialValues, onSuccess, onFailed }) {
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
      <Form.Item name="host" label="通信地址" rules={[{ required: true }]}>
        <TextField placeholder="如:192.168.10.21" validator={hostValidator} />
      </Form.Item>

      <Form.Item name="port" label="端口" rules={[{ required: true }, { range: true, args: [1, 65535] }]}>
        <Spinner min={1} max={65535} />
      </Form.Item>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true }, { range: true, args: [5, 3600] }]}
      >
        <Spinner min={5} max={3600} />
      </Form.Item>

      <Form.Item
        name="encrypted"
        label="链路加密"
        valuePropName="toggled"
        updateTrigger="onToggle"
      >
        <Toggle data={[false, true]} />
      </Form.Item>
    </Form>
  );
}
