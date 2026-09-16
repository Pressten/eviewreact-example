import { useRef, useState } from "react";
import Steps from "@nce/eview-react/Steps";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import { Icon } from "../icons.jsx";
import { stepItems } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
// antd Form.useForm() + validateFields() Promise → eview-react useRef + submit() → onSuccess(values) 回调。
// 推进逻辑从 goNext 的 .then 移到各步 onSuccess 回调内(校验失败走 onFailed,停在本步)。
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepItems.length - 1;
  const stepInitialValues = [allValues.basic, allValues.network, undefined];

  // 各步校验通过回调:存值 + 推进到下一步。
  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };
  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };

  // 下一步:触发当前步 Form 的 submit(走校验 → onSuccess 推进);确认页直接提交。
  const handleNext = () => {
    if (current === 0) {
      basicFormRef.current && basicFormRef.current.submit();
    } else if (current === 1) {
      networkFormRef.current && networkFormRef.current.submit();
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));

  const restart = () => {
    setSubmitted(false);
    setCurrent(0);
    setAllValues({});
    // 各步 Form 在步骤切换时重新挂载(initialValues 为空),无需显式 resetFields。
  };

  if (submitted) {
    const deviceName = allValues.basic && allValues.basic.deviceName;
    // antd Result → Empty type="success" + 手写标题/副标题/操作按钮。
    return (
      <section className="panel step-panel">
        <Empty
          type="success"
          description={
            <div className="result-box">
              <div className="result-title">设备接入任务已提交</div>
              <div className="result-subtitle">
                {`设备「${deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
              </div>
              <div className="result-actions">
                <Button
                  status="primary"
                  text="再配置一台"
                  leftIcon={<Icon name="rotate-ccw" size={14} />}
                  onClick={restart}
                />
              </div>
            </div>
          }
        />
      </section>
    );
  }

  // Steps:current 对应 data[].value(此处 value 用 stepItems[].key);items → data, title → text。
  const stepsData = stepItems.map((s) => ({ text: s.title, value: s.key }));

  return (
    <section className="panel step-panel">
      <Steps data={stepsData} currentStep={stepItems[current].key} />

      <div className="step-content">
        {current === 0 && (
          <BasicInfoForm
            formRef={basicFormRef}
            initialValues={stepInitialValues[0]}
            onSuccess={handleBasicSuccess}
          />
        )}
        {current === 1 && (
          <NetworkForm
            formRef={networkFormRef}
            initialValues={stepInitialValues[1]}
            onSuccess={handleNetworkSuccess}
          />
        )}
        {current === 2 && (
          <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />
        )}
      </div>

      <div className="step-footer">
        <Button
          text="上一步"
          leftIcon={<Icon name="arrow-left" size={14} />}
          disabled={current === 0}
          onClick={handlePrev}
        />
        <Button
          status="primary"
          text={isLast ? "提交配置" : "下一步"}
          rightIcon={isLast ? null : <Icon name="arrow-right" size={14} />}
          onClick={handleNext}
        />
      </div>
    </section>
  );
}
