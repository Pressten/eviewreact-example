import { IconPlusIcPublicLeftArrow } from '@hui/icon-plus';
import WizardStepper from "../wizard-stepper/index.jsx";
import "./index.css";

export default function SecondaryNav() {
  return (
    <div className="subnav-bar">
      <div className="subnav-inner">
        <button className="subnav-back" title="返回">
          <IconPlusIcPublicLeftArrow iconSize="1rem" iconColor={['var(--on-surface)']} />
          <span>新极简开局任务</span>
        </button>
        <div className="subnav-stepper">
          <WizardStepper />
        </div>
      </div>
    </div>
  );
}
