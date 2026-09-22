import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";

// Layer 4: 步骤二 — 网络配置表单
// host 的 pattern 校验迁移到 TextField validator;需 Form 开 validateAllChildComponent 才在 submit() 时跑
const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

export default function NetworkForm({ formRef, initialValues, onSuccess }) {
  return (
    <Form
      ref={formRef}
      layout="vertical"
      itemCol={12}
      initialValues={initialValues || {}}
      validateErrorType="tip"
      validateAllChildComponent={true}
      onSuccess={onSuccess}
      onFailed={() => {
        /* 校验失败停留本步 */
      }}
      className="step-form"
    >
      <Form.Item name="host" label="通信地址" rules={[{ required: true }]}>
        <TextField
          placeholder="如:192.168.10.21"
          validator={(value) => ({
            result: !value || HOST_PATTERN.test(value),
            message: "仅支持域名或 IP 格式",
          })}
        />
      </Form.Item>
      <Form.Item name="port" label="端口" rules={[{ required: true }]}>
        <Spinner min={1} max={65535} placeholder="502" />
      </Form.Item>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true }]}
        col={24}
      >
        <Spinner min={5} max={3600} placeholder="15" />
      </Form.Item>
      <div className="form-extra">数据点位的轮询间隔,范围 5 ~ 3600 秒</div>

      <Form.Item
        name="encrypted"
        label="链路加密"
        valuePropName="toggled"
        updateTrigger="onToggle"
        col={24}
      >
        <Toggle data={[false, true]} />
      </Form.Item>
    </Form>
  );
}
