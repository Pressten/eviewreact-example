import Steps from "@/shared/Steps";
import { wizardSteps } from "../../mock/network.js";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function WizardStepper() {
  const { currentStep, setCurrentStep } = useApp();
  const stepData = wizardSteps.map((s, i) => ({
    text: s.title,
    value: String(i + 1),
  }));
  return (
    <Steps
      className="wizard-steps ev_wizard_container_xs"
      labelPlacement="horizontal"
      data={stepData}
      currentStep={String(currentStep)}
      onClick={(index) => {
        // 仅允许点击返回到已完成的步骤；向前推进走底部"下一步"按钮
        if (index < currentStep - 1) {
          setCurrentStep(index + 1);
        }
      }}
    />
  );
}
