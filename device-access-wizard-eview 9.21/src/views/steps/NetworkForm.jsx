import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";

// Layer 4: 步骤二 — 网络配置表单
// Form 模式：useForm→useRef；validateFields→ref.submit()+onSuccess；rules 无 message
// Switch→Toggle：valuePropName="toggled" updateTrigger="onToggle"
// pattern 校验迁移到控件 validator（Form rules 无 pattern）
const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

export default function NetworkForm({ formRef, initialValues, onSuccess }) {
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
      <Form.Item name="host" label="通信地址" rules={[{ required: true }]}>
        <TextField
          placeholder="如:192.168.10.21"
          validator={(value) => {
            if (!value) return { result: true, message: "" };
            return { result: HOST_PATTERN.test(value), message: "仅支持域名或 IP 格式" };
          }}
        />
      </Form.Item>
      <Form.Item name="port" label="端口" rules={[{ required: true }, { range: true, args: [1, 65535] }]}>
        <Spinner min={1} max={65535} placeholder="502" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true }, { range: true, args: [5, 3600] }]}
      >
        <Spinner min={5} max={3600} placeholder="15" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="encrypted" label="链路加密" valuePropName="toggled" updateTrigger="onToggle">
        <Toggle data={[false, true]} />
      </Form.Item>
    </Form>
  );
}
