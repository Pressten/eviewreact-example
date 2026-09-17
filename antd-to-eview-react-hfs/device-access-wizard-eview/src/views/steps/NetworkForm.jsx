import Form from "@nce/eview-react/Form";
import Spinner from "@nce/eview-react/Spinner";
import TextField from "@nce/eview-react/TextField";
import Toggle from "@nce/eview-react/Toggle";

const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

// Layer 4: 步骤二 — 网络配置表单
export default function NetworkForm({ formRef, initialValues, onSuccess }) {
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
        name="host"
        label="通信地址"
        rules={[{ required: true }]}
      >
        <TextField
          placeholder="如:192.168.10.21"
          validator={(value) => ({
            result: !value || HOST_PATTERN.test(value),
            message: "仅支持域名或 IP 格式",
          })}
        />
      </Form.Item>
      <Form.Item
        name="port"
        label="端口"
        rules={[{ required: true }]}
      >
        <Spinner min={1} max={65535} className="full-width" />
      </Form.Item>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true }]}
      >
        <Spinner min={5} max={3600} className="full-width" />
      </Form.Item>
      <p className="step-form-hint">数据点位的轮询间隔,范围 5 ~ 3600 秒</p>

      <Form.Item name="encrypted" label="链路加密" valuePropName="toggled" updateTrigger="onToggle">
        <Toggle data={[false, true]} />
      </Form.Item>
    </Form>
  );
}
