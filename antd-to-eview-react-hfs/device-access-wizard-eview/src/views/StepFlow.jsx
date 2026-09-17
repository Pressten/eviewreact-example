import { useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import Steps from "@nce/eview-react/Steps";
import { Icon } from "../../assets/shared/icons.js";
import { stepItems } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepItems.length - 1;
  const stepInitialValues = [allValues.basic, allValues.network, undefined];

  function saveStepAndContinue(values) {
    setAllValues((prev) => ({
      ...prev,
      [stepItems[current].key]: values,
    }));
    setCurrent((c) => c + 1);
  }

  function goNext() {
    if (current === 0) {
      basicFormRef.current?.submit();
      return;
    }
    if (current === 1) {
      networkFormRef.current?.submit();
      return;
    }
    if (isLast) {
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
        <div className="step-result">
          <Empty type="success" />
          <h2>设备接入任务已提交</h2>
          <p>设备「{allValues.basic?.deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集</p>
          <Button status="primary" text="再配置一台" leftIcon={<Icon name="rotate-ccw" size={14} />} onClick={restart} />
        </div>
      </section>
    );
  }

  return (
    <section className="panel step-panel">
      <Steps currentStep={stepItems[current].value} data={stepItems} />

      <div className="step-content">
        {current === 0 && (
          <BasicInfoForm formRef={basicFormRef} initialValues={stepInitialValues[0]} onSuccess={saveStepAndContinue} />
        )}
        {current === 1 && (
          <NetworkForm formRef={networkFormRef} initialValues={stepInitialValues[1]} onSuccess={saveStepAndContinue} />
        )}
        {current === 2 && <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />}
      </div>

      <div className="step-footer">
        <div className="step-actions">
          <Button onClick={goPrev} disabled={current === 0}>
            上一步
          </Button>
          <Button
            status="primary"
            text={isLast ? "提交配置" : "下一步"}
            rightIcon={isLast ? null : <Icon name="arrow-right" size={14} />}
            onClick={goNext}
          />
        </div>
      </div>
    </section>
  );
}
