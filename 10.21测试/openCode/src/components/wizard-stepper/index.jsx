import Steps from "@/shared/Steps";
import { wizardSteps } from "../../mock/network.js";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function WizardStepper() {
  const { currentStep, setCurrentStep } = useApp();
  return (
    <Steps
      className="wizard-steps ev_wizard_container_sm"
      data={wizardSteps}
      currentStep={currentStep}
      labelPlacement="horizontal"
      onClick={(index) => {
        if (index < currentStep - 1) {
          setCurrentStep(index + 1);
        }
      }}
    />
  );
}
