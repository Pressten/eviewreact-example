import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";

// Layer 4: 步骤二 — 网络配置表单
// 模式转换：antd form prop → eview-react ref；Switch → Toggle(valuePropName="toggled" updateTrigger="onToggle")
// host 的 pattern 校验：eview-react Form rules 无 pattern，改用 TextField 的 validator
const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

export default function NetworkForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      itemCol={24}
      validateErrorType="tip"
      validateAllChildComponent
      onSuccess={onSuccess}
      onFailed={() => {}}
      className="step-form"
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
        rules={[{ required: true }, { range: true, args: [1, 65535] }]}
      >
        <Spinner min={1} max={65535} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒) 范围 5~3600"
        rules={[{ required: true }, { range: true, args: [5, 3600] }]}
      >
        <Spinner min={5} max={3600} style={{ width: "100%" }} />
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
