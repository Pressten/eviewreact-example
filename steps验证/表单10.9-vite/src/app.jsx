import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import OrderWizard from "./views/order-wizard/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <div className="app-body">
          <SideNav />
          <main className="app-main">
            <OrderWizard />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
