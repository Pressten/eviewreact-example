import { useState, useRef } from 'react';
import Steps from '@nce/eview-react/Steps';
import Button from '@nce/eview-react/Button';
import Empty from '@nce/eview-react/Empty';
import Icon from '../components/Icon.jsx';
import { stepItems } from '../data.js';
import BasicInfoForm from './steps/BasicInfoForm.jsx';
import NetworkForm from './steps/NetworkForm.jsx';
import ConfirmForm from './steps/ConfirmForm.jsx';
import './step-flow.css';

// 步骤定义：currentStep 对应 data[].value（不是下标）
const stepData = stepItems.map((s) => ({ text: s.title, value: s.key }));

// 步骤流编排：步骤条 + 当前步骤表单 + 底部操作按钮。
// antd 的 form.validateFields() Promise → eview-react 的 ref.submit() → onSuccess 回调链。
export default function StepFlow() {
    const [current, setCurrent] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [allValues, setAllValues] = useState({});
    const basicFormRef = useRef(null);
    const networkFormRef = useRef(null);

    const isLast = current === stepData.length - 1;

    // 每步校验通过后：存值 + 推进
    const handleBasicSuccess = (values) => {
        setAllValues((prev) => ({ ...prev, basic: values }));
        setCurrent((c) => c + 1);
    };
    const handleNetworkSuccess = (values) => {
        setAllValues((prev) => ({ ...prev, network: values }));
        setCurrent((c) => c + 1);
    };
    const handleFailed = () => {
        // 校验失败：停在本步
    };

    // 下一步：调用当前步 Form 的 submit（触发校验 → onSuccess 推进）
    const handleNext = () => {
        if (current === 0) basicFormRef.current?.submit();
        else if (current === 1) networkFormRef.current?.submit();
        else setSubmitted(true); // 确认页直接提交
    };

    const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));

    const restart = () => {
        setSubmitted(false);
        setCurrent(0);
        setAllValues({});
        basicFormRef.current?.resetFields();
        networkFormRef.current?.resetFields();
    };

    if (submitted) {
        return (
            <section className="panel step-panel">
                <Empty
                    type="success"
                    description={
                        <div style={{ textAlign: 'center' }}>
                            <div className="app-result-title">
                                设备接入任务已提交
                            </div>
                            <div className="app-result-subtitle">
                                {`设备「${allValues.basic?.deviceName || '未命名'}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
                            </div>
                            <Button
                                status="primary"
                                onClick={restart}
                                style={{ marginTop: '16px' }}
                            >
                                <Icon name="rotate-ccw" size={14} /> 再配置一台
                            </Button>
                        </div>
                    }
                />
            </section>
        );
    }

    return (
        <section className="panel step-panel">
            <Steps data={stepData} currentStep={stepData[current].value} />

            <div className="step-content">
                {current === 0 && (
                    <BasicInfoForm
                        formRef={basicFormRef}
                        initialValues={allValues.basic || {}}
                        onSuccess={handleBasicSuccess}
                        onFailed={handleFailed}
                    />
                )}
                {current === 1 && (
                    <NetworkForm
                        formRef={networkFormRef}
                        initialValues={allValues.network || {}}
                        onSuccess={handleNetworkSuccess}
                        onFailed={handleFailed}
                    />
                )}
                {current === 2 && (
                    <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />
                )}
            </div>

            <div className="step-footer">
                <div className="step-footer-actions">
                    <Button onClick={handlePrev} disabled={current === 0}>
                        <Icon name="arrow-left" size={14} /> 上一步
                    </Button>
                    <Button status="primary" onClick={handleNext}>
                        {isLast ? (
                            '提交配置'
                        ) : (
                            <>
                                下一步 <Icon name="arrow-right" size={14} />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
}
