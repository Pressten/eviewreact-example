import { useState, useRef } from "react";
import Steps from "@nce/eview-react/Steps";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import { Icon } from "../../assets/shared/icons.js";
import { stepItems } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
// 原库: hook 实例 + Promise 校验;eview-react: useRef + ref.submit() → onSuccess 回调
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  // Steps: data=[{text,value}],currentStep 对应 data[].value(非下标)
  const stepData = stepItems.map((s) => ({ text: s.title, value: s.key }));
  const isLast = current === stepItems.length - 1;

  // 每步 onSuccess 回调:存值 + 推进(校验通过才走到这里;onFailed 停本步)
  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };
  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };

  // 下一步:调用当前步 Form 的 submit(触发校验 → onSuccess 推进)
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
    // TODO(eview-react): 结果页组件未覆盖,用 Empty type="success" + 手写内容替代
    return (
      <section className="panel step-panel">
        <Empty
          type="success"
          description={
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--on-surface)",
                }}
              >
                设备接入任务已提交
              </div>
              <div style={{ color: "var(--on-surface-variant)", marginTop: "8px" }}>
                {`设备「${allValues.basic?.deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
              </div>
              <Button
                status="primary"
                text="再配置一台"
                leftIcon={<Icon name="rotate-ccw" size={14} />}
                onClick={restart}
                style={{ marginTop: "16px" }}
              />
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
          />
        )}
        {current === 1 && (
          <NetworkForm
            formRef={networkFormRef}
            initialValues={allValues.network || {}}
            onSuccess={handleNetworkSuccess}
          />
        )}
        {current === 2 && (
          <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />
        )}
      </div>

      <div className="step-footer">
        <Button
          onClick={goPrev}
          disabled={current === 0}
          leftIcon={<Icon name="arrow-left" size={14} />}
          text="上一步"
        />
        <Button
          status="primary"
          onClick={goNext}
          text={isLast ? "提交配置" : "下一步"}
          rightIcon={isLast ? undefined : <Icon name="arrow-right" size={14} />}
        />
      </div>
    </section>
  );
}
