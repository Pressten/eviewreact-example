import { useRef, useState } from 'react';
import Steps from '@nce/eview-react/Steps';
import Button from '@nce/eview-react/Button';
import Empty from '@nce/eview-react/Empty';
import { Icon } from '../icons/Icon';
import { stepItems } from '../data';
import BasicInfoForm from './steps/BasicInfoForm';
import NetworkForm from './steps/NetworkForm';
import ConfirmForm from './steps/ConfirmForm';

// 步骤流编排 — Steps + 当前步骤表单 + 底部操作按钮
// 关键模式转换：antd useForm() + validateFields() Promise
//   → eview-react useRef(null) + submit() → onSuccess(values) 回调
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepItems.length - 1;

  // 每步校验通过回调：存值 + 推进（替代 antd 的 await validateFields 后同步推进）
  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };
  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };
  const handleFailed = () => {
    /* 校验失败：停在本步，不推进 */
  };

  // 下一步：调用当前步 Form 的 submit（触发校验 → onSuccess 推进）
  const handleNext = () => {
    if (current === 0) basicFormRef.current?.submit();
    else if (current === 1) networkFormRef.current?.submit();
    else setSubmitted(true); // 确认页直接提交
  };

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  const restart = () => {
    setSubmitted(false);
    setCurrent(0);
    setAllValues({});
    basicFormRef.current?.resetFields();
    networkFormRef.current?.resetFields();
  };

  if (submitted) {
    // Result → Empty type="success" + 手写内容（handwrite-templates §6）
    return (
      <section className="panel step-panel">
        <Empty
          type="success"
          description={
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--on-surface)',
              }}>
                设备接入任务已提交
              </div>
              <div style={{
                color: 'var(--on-surface-variant)',
                marginTop: '8px',
              }}>
                {`设备「${allValues.basic?.deviceName || '未命名'}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
              </div>
              <Button
                status="primary"
                text="再配置一台"
                leftIcon={<Icon name="rotate-ccw" size={14} />}
                onClick={restart}
                style={{ marginTop: '16px' }}
              />
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section className="panel step-panel">
      {/* current → currentStep（对应 data[].value，不是下标） */}
      <Steps data={stepItems} currentStep={stepItems[current].value} />

      <div className="step-content">
        {current === 0 && (
          <BasicInfoForm
            formRef={basicFormRef}
            initialValues={allValues.basic}
            onSuccess={handleBasicSuccess}
            onFailed={handleFailed}
          />
        )}
        {current === 1 && (
          <NetworkForm
            formRef={networkFormRef}
            initialValues={allValues.network}
            onSuccess={handleNetworkSuccess}
            onFailed={handleFailed}
          />
        )}
        {current === 2 && (
          <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />
        )}
      </div>

      {/* Space → flex div + gap */}
      <div className="step-footer">
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            text="上一步"
            leftIcon={<Icon name="arrow-left" size={14} />}
            onClick={goPrev}
            disabled={current === 0}
          />
          <Button
            status="primary"
            text={isLast ? '提交配置' : '下一步'}
            onClick={handleNext}
            rightIcon={isLast ? undefined : <Icon name="arrow-right" size={14} />}
          />
        </div>
      </div>
    </section>
  );
}
