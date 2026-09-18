import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Spinner from '@nce/eview-react/Spinner';
import Toggle from '@nce/eview-react/Toggle';

const HOST_PATTERN = /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/;

// 步骤二 — 网络配置表单。
// host 的 pattern 校验迁移到 TextField 的 validator（Form rules 无 pattern）；
// 控件 validator 默认不在 submit() 时跑，需 Form 上加 validateAllChildComponent={true}。
function hostValidator(value) {
    if (!value) return { result: true }; // 空值交给 required 规则
    return HOST_PATTERN.test(value)
        ? { result: true }
        : { result: false, message: '仅支持域名或 IP 格式' };
}

export default function NetworkForm({ formRef, initialValues, onSuccess, onFailed }) {
    return (
        <Form
            ref={formRef}
            layout="vertical"
            className="step-form"
            initialValues={initialValues || {}}
            validateErrorType="tip"
            validateAllChildComponent={true}
            onSuccess={onSuccess}
            onFailed={onFailed}
        >
            <Form.Item label="通信地址" name="host" rules={[{ required: true }]}>
                <TextField placeholder="如:192.168.10.21" validator={hostValidator} />
            </Form.Item>

            <Form.Item
                label="端口"
                name="port"
                labelTip="如 502"
                rules={[{ required: true }, { range: true, args: [1, 65535] }]}
            >
                <Spinner min={1} max={65535} />
            </Form.Item>

            <Form.Item
                label="采集周期(秒)"
                name="collectInterval"
                labelTip="如 15；数据点位的轮询间隔,范围 5 ~ 3600 秒"
                rules={[{ required: true }, { range: true, args: [5, 3600] }]}
            >
                <Spinner min={5} max={3600} />
            </Form.Item>

            <Form.Item label="链路加密" name="encrypted" valuePropName="toggled" updateTrigger="onToggle">
                <Toggle data={[false, true]} />
            </Form.Item>
        </Form>
    );
}
