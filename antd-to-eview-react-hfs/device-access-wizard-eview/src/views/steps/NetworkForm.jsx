// Layer 4: 步骤二 — 网络配置表单
// InputNumber→Spinner(min/max + range 规则),Switch→Toggle(valuePropName="toggled"),
// 正则 pattern 规则迁移到 TextField 的 validator(返回 {result,message})
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";

const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

function validateHost(value) {
  return {
    result: !value || HOST_PATTERN.test(value),
    message: "仅支持域名或 IP 格式",
  };
}

export default function NetworkForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      className="step-form"
      validateErrorType="tip"
      onSuccess={onSuccess}
    >
      <Form.Item name="host" label="通信地址" rules={[{ required: true }]}>
        <TextField placeholder="如:192.168.10.21" validator={validateHost} />
      </Form.Item>

      <Form.Item name="port" label="端口" rules={[{ required: true }, { range: true, args: [1, 65535] }]}>
        <Spinner min={1} max={65535} doNotFocusWhenValueUpdate />
      </Form.Item>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true }, { range: true, args: [5, 3600] }]}
      >
        <Spinner min={5} max={3600} doNotFocusWhenValueUpdate />
      </Form.Item>

      <Form.Item name="encrypted" label="链路加密" valuePropName="toggled" updateTrigger="onToggle">
        <Toggle data={[false, true]} />
      </Form.Item>
    </Form>
  );
}
