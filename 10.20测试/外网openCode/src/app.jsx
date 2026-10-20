import Button from "@nce/eview-react/Button";
import { AppProvider, useApp } from "./context.jsx";
import TopNav from "./components/top-nav/index.jsx";
import SecondaryNav from "./components/secondary-nav/index.jsx";
import FooterBar from "./components/footer-bar/index.jsx";
import NetworkPlanning from "./views/network-planning/index.jsx";
import RegionConfig from "./views/region-config/index.jsx";
import DeviceSelection from "./views/device-selection/index.jsx";
import "./app.css";

function PageContent() {
  const { currentStep, goNext, goPrev } = useApp();

  if (currentStep >= 3) {
    return (
      <>
        <SecondaryNav />
        <DeviceSelection deployMode={currentStep === 4} />
      </>
    );
  }

  return (
    <>
      <SecondaryNav />
      <main className="app-main">
        <div className="app-card">
          {currentStep === 1 && <NetworkPlanning />}
          {currentStep === 2 && <RegionConfig />}
        </div>
      </main>
      <FooterBar>
        {currentStep === 1 && <Button>取消</Button>}
        {currentStep === 2 && (
          <Button>取消</Button>
        )}
        {currentStep > 1 && (
          <Button onClick={goPrev}>
            上一步
          </Button>
        )}
        <Button status="primary" onClick={goNext}>
          下一步
        </Button>
      </FooterBar>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <TopNav />
        <PageContent />
      </div>
    </AppProvider>
  );
}
