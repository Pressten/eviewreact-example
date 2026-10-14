import { AppProvider } from "./context.jsx";
import Welcome from "./views/welcome/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <Welcome />
      </div>
    </AppProvider>
  );
}
