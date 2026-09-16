import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";

// Layer 4: 步骤二 — 网络配置表单
// antd Form form={form} → eview-react Form ref={formRef}。
// InputNumber → Spinner(min/max 在控件上);Switch → Toggle(checked→toggled, valuePropName+updateTrigger)。
// Form.Item rules 的 pattern → 移到 TextField 的 validator(返回 {result, message});Form.Item extra → 下方辅助文案。
const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

export default function NetworkForm({ formRef, initialValues, onSuccess }) {
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
      <div className="step-form-row">
        <Form.Item
          name="host"
          label="通信地址"
          rules={[{ required: true }]}
        >
          <TextField
            placeholder="如:192.168.10.21"
            validator={(v) => ({
              result: !v || HOST_PATTERN.test(v),
              message: "仅支持域名或 IP 格式",
            })}
          />
        </Form.Item>
        <Form.Item name="port" label="端口" rules={[{ required: true }]}>
          <div className="full-width">
            <Spinner min={1} max={65535} />
          </div>
        </Form.Item>
      </div>

      <Form.Item name="collectInterval" label="采集周期(秒)" rules={[{ required: true }]}>
        <div className="full-width">
          <Spinner min={5} max={3600} />
        </div>
      </Form.Item>
      <p className="step-form-hint">数据点位的轮询间隔,范围 5 ~ 3600 秒</p>

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
