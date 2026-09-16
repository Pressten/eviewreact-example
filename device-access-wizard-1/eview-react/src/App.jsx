import { AppProvider } from './context';
import AppShell from './views/AppShell';

export default function App() {
  return (
    <AppProvider>
      <div className="app-root aui3_1">
        <AppShell />
      </div>
    </AppProvider>
  );
}
