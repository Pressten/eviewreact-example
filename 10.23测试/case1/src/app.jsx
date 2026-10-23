import { AppProvider } from "./context.jsx";
import OrderConsole from "./views/order-console/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <OrderConsole />
      </div>
    </AppProvider>
  );
}
