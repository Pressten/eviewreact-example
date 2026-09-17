// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
// Form 校验从 antd 的 validateFields() Promise 改为 ref.submit() → onSuccess 回调推进
import { useRef, useState } from "react";
import Steps from "@nce/eview-react/Steps";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import { stepData } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepData.length - 1;

  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };

  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };

  function goNext() {
    if (current === 0) {
      basicFormRef.current?.submit();
    } else if (current === 1) {
      networkFormRef.current?.submit();
    } else {
      setSubmitted(true);
    }
  }

  function goPrev() {
    setCurrent((c) => Math.max(0, c - 1));
  }

  function restart() {
    setSubmitted(false);
    setCurrent(0);
    setAllValues({});
    basicFormRef.current?.resetFields();
    networkFormRef.current?.resetFields();
  }

  if (submitted) {
    return (
      <section className="panel step-panel">
        {/* TODO(eview-react): Result 无对应,用 Empty type="success" + 手写内容替代 */}
        <Empty
          type="success"
          description={
            <div className="step-result">
              <div className="step-result-title">设备接入任务已提交</div>
              <div className="step-result-subtitle">
                设备「{allValues.basic?.deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集
              </div>
              <Button status="primary" text="再配置一台" onClick={restart} />
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
          <BasicInfoForm formRef={basicFormRef} initialValues={allValues.basic} onSuccess={handleBasicSuccess} />
        )}
        {current === 1 && (
          <NetworkForm formRef={networkFormRef} initialValues={allValues.network} onSuccess={handleNetworkSuccess} />
        )}
        {current === 2 && <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />}
      </div>

      <div className="step-footer">
        {/* TODO(eview-react): Space 无对应,flex div + gap 替代 */}
        <div className="step-footer-actions">
          <Button text="上一步" disabled={current === 0} onClick={goPrev} />
          <Button status="primary" text={isLast ? "提交配置" : "下一步"} onClick={goNext} />
        </div>
      </div>
    </section>
  );
}
