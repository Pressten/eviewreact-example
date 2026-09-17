import { useRef, useState } from "react";
import Steps from "@nce/eview-react/Steps";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import { Icon } from "../components/Icon.jsx";
import { stepItems } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
// 模式转换(antd → eview-react):
//   useForm()          → useRef(null)
//   validateFields() Promise → ref.submit() + onSuccess 回调
//   推进逻辑从 .then() 移到每步 onSuccess 内
//   Steps current       → currentStep(对应 data[].value)
//   Result              → Empty type="success" + 手写内容
//   Space               → flex div(step-footer 已是 flex,加 gap)
//   Button type="primary" → status="primary"
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const basicFormRef = useRef(null);
  const networkFormRef = useRef(null);

  const isLast = current === stepItems.length - 1;

  // 每步校验通过回调:存值 + 推进(确认页无表单,直接提交)
  const handleBasicSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, basic: values }));
    setCurrent((c) => c + 1);
  };
  const handleNetworkSuccess = (values) => {
    setAllValues((prev) => ({ ...prev, network: values }));
    setCurrent((c) => c + 1);
  };

  // 下一步:触发当前步 Form 的 submit(→ 校验 → onSuccess 推进)
  const handleNext = () => {
    if (current === 0) basicFormRef.current?.submit();
    else if (current === 1) networkFormRef.current?.submit();
    else setSubmitted(true);
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
              <div style={{ color: "var(--on-surface-variant)", marginTop: 8 }}>
                {`设备「${allValues.basic?.deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
              </div>
              <Button
                status="primary"
                text="再配置一台"
                leftIcon={<Icon name="rotate-ccw" size={14} />}
                onClick={restart}
                style={{ marginTop: 16 }}
              />
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section className="panel step-panel">
      <Steps data={stepItems} currentStep={stepItems[current].value} />

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
        {current === 2 && (
          <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />
        )}
      </div>

      <div className="step-footer">
        <Button
          disabled={current === 0}
          leftIcon={<Icon name="arrow-left" size={14} />}
          text="上一步"
          onClick={goPrev}
        />
        <Button
          status="primary"
          text={isLast ? "提交配置" : "下一步"}
          rightIcon={!isLast ? <Icon name="arrow-right" size={14} /> : null}
          onClick={handleNext}
        />
      </div>
    </section>
  );
}
