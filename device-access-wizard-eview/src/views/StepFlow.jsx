import { useState, useRef } from "react";
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
// Form 模式转换：useForm()→useRef；validateFields() Promise→ref.submit()+onSuccess 回调
// Steps: current→currentStep（对应 data[].value）；items→data
// Space→flex div+gap；Result→Empty type="success"+手写
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepItems.length - 1;

  // 每步的 onSuccess 回调：存值 + 推进（替代 antd 的 await validateFields + setCurrent）
  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };
  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };

  // 下一步：调用当前步 Form 的 submit（触发校验 → onSuccess 推进）
  const handleNext = () => {
    if (current === 0) {
      basicFormRef.current?.submit();
    } else if (current === 1) {
      networkFormRef.current?.submit();
    } else {
      setSubmitted(true);
    }
  };

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
              <Button status="primary" onClick={restart} style={{ marginTop: "16px" }}>
                <Icon name="rotate-ccw" size={14} style={{ marginRight: "4px" }} />
                再配置一台
              </Button>
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section className="panel step-panel">
      <Steps
        data={stepItems.map((s) => ({ text: s.title, value: s.key }))}
        currentStep={stepItems[current].key}
      />

      <div className="step-content">
        {current === 0 && (
          <BasicInfoForm
            formRef={basicFormRef}
            initialValues={allValues.basic}
            onSuccess={handleBasicSuccess}
          />
        )}
        {current === 1 && (
          <NetworkForm
            formRef={networkFormRef}
            initialValues={allValues.network}
            onSuccess={handleNetworkSuccess}
          />
        )}
        {current === 2 && <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />}
      </div>

      <div className="step-footer">
        <div style={{ display: "flex", gap: "var(--spacing-stack)" }}>
          <Button onClick={goPrev} disabled={current === 0}>
            <Icon name="arrow-left" size={14} style={{ marginRight: "4px" }} />
            上一步
          </Button>
          <Button status="primary" onClick={handleNext}>
            {isLast ? (
              "提交配置"
            ) : (
              <>
                下一步
                <Icon name="arrow-right" size={14} style={{ marginLeft: "4px" }} />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
