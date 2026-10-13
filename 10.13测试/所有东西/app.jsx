// App entry — ICT React page (antd component showcase)
// Layer 5 layout: H5 shell (header + sider nav + scrollable content + back-to-top).

import { useState, useRef, useEffect, Component } from "react";
import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { Icon } from "./assets/shared/icon.jsx";
import { AppProvider, useApp } from "./src/context.jsx";
import { BackTop } from "./src/components/showcase/index.jsx";
import GeneralView from "./src/views/general/index.jsx";
import FormsView from "./src/views/forms/index.jsx";
import DataDisplayView from "./src/views/data-display/index.jsx";
import FeedbackView from "./src/views/feedback/index.jsx";
import LayoutNavView from "./src/views/layout-nav/index.jsx";
import "./app.css";

const NAV = [
  { key: "general", label: "通用", icon: "component" },
  { key: "forms", label: "表单与输入", icon: "text-cursor-input" },
  { key: "data", label: "数据展示", icon: "table" },
  { key: "feedback", label: "反馈", icon: "bell" },
  { key: "layout", label: "布局与导航", icon: "layout-panel-left" },
];

// safety net: if any subtree throws at render, show a clear message instead of a blank page
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("页面渲染出错:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "#191919", background: "#FEE7E8", minHeight: "100vh" }}>
          <h2 style={{ margin: "0 0 1rem" }}>页面渲染出错</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "13px", lineHeight: 1.6 }}>
{String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}
{"\n\n(查看浏览器控制台获取完整堆栈;若此前能打开,可能是某组件渲染异常)"}
          </pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: "1rem", padding: "0.25rem 1rem" }}>重试</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SiderNav({ active, onSelect }) {
  return (
    <aside className="app-sider">
      <nav className="app-sider-nav">
        <div className="app-sider-group">组件分类</div>
        {NAV.map((n) => (
          <button
            key={n.key}
            className={"app-sider-item" + (active === n.key ? " active" : "")}
            onClick={() => onSelect(n.key)}
          >
            <span className="app-sider-bar" />
            <Icon name={n.icon} size="0.875rem" />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function HeaderBar({ onBackTop }) {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-logo"><Icon name="layers" size="1rem" /></span>
        <span className="app-header-title">Ant Design 组件能力总览</span>
      </div>
      <div className="app-header-right">
        <button className="app-sider-item" style={{ padding: "0.25rem 0.5rem" }} onClick={onBackTop} title="回到顶部">
          <Icon name="arrow-up" size="0.875rem" />
          <span>回到顶部</span>
        </button>
        <button className="app-sider-item" style={{ padding: "0.25rem 0.5rem" }} onClick={toggleDark} title="切换主题">
          <Icon name={isDark ? "sun" : "moon"} size="0.875rem" />
          <span>{isDark ? "亮色" : "暗色"}</span>
        </button>
      </div>
    </header>
  );
}

function PageBody() {
  const [active, setActive] = useState("general");
  const contentRef = useRef(null);

  const scrollTo = (key) => {
    setActive(key);
    const node = document.getElementById(key);
    if (node && contentRef.current) {
      contentRef.current.scrollTo({ top: node.offsetTop - 8, behavior: "smooth" });
    }
  };

  // track active section on scroll
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const tops = NAV.map((n) => {
        const node = document.getElementById(n.key);
        return node ? node.offsetTop : Infinity;
      });
      const y = el.scrollTop + 80;
      let cur = NAV[0].key;
      for (let i = 0; i < NAV.length; i++) {
        if (y >= tops[i]) cur = NAV[i].key;
      }
      setActive(cur);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-body">
      <SiderNav active={active} onSelect={scrollTo} />
      <main className="app-content" ref={contentRef}>
        <div className="app-content-inner">
          <GeneralView />
          <FormsView />
          <DataDisplayView />
          <FeedbackView />
          <LayoutNavView />
        </div>
      </main>
      <BackTop target={contentRef} visibilityHeight={240} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <ErrorBoundary>
          <div className="app-shell">
            <HeaderBar onBackTop={() => { document.querySelector(".app-content")?.scrollTo({ top: 0, behavior: "smooth" }); }} />
            <PageBody />
          </div>
        </ErrorBoundary>
      </ConfigProvider>
    </AppProvider>
  );
}
