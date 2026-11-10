// Layer 4: 快速开始章节 — 4 步折叠面板，支持逐步展开 + 多语言 SDK 示例切换（Tabs）
import { useState } from "react";
import { Collapse, Tabs } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { QUICKSTART_STEPS, SDK_SAMPLES } from "../../mock/docs.js";
import CodeBlock from "../../components/code-block/index.jsx";
import "./index.css";

export default function SectionQuickstart() {
  const { version } = useApp();
  // 默认仅展开第一步；「下一步」引导逐步展开
  const [openSteps, setOpenSteps] = useState(["step1"]);

  const openStep = (key) => {
    setOpenSteps((prev) => Array.from(new Set([...prev, key])));
  };

  const items = QUICKSTART_STEPS.map((step, index) => {
    const stepKey = `step${index + 1}`;
    return {
      key: stepKey,
      label: (
        <div className="qs-label">
          <span className="qs-no">{String(index + 1).padStart(2, "0")}</span>
          <span className="qs-title">{step.title}</span>
          <span className="qs-dur">{step.duration}</span>
        </div>
      ),
      children: (
        <div className="qs-body">
          <p className="qs-intro">{step.intro}</p>
          <CodeBlock lang={step.lang} code={step.code.replaceAll("{V}", version)} />
          {/* 步骤 3：多语言 SDK 示例切换 */}
          {index === 2 && (
            <div className="qs-sdk">
              <div className="qs-sdk-label">SDK / 多语言示例</div>
              <Tabs
                items={SDK_SAMPLES.map((sample) => ({
                  key: sample.key,
                  label: sample.label,
                  children: (
                    <div className="sdk-panel">
                      <CodeBlock lang={sample.lang} code={sample.code.replaceAll("{V}", version)} />
                    </div>
                  ),
                }))}
              />
            </div>
          )}
          {step.note && (
            <div className="qs-note">
              <Icon name="info" size="0.875rem" className="qs-note-icon" />
              <span>{step.note}</span>
            </div>
          )}
          {index < QUICKSTART_STEPS.length - 1 && (
            <a
              className="qs-next"
              onClick={() => openStep(`step${index + 2}`)}
            >
              下一步 · {QUICKSTART_STEPS[index + 1].title}
              <Icon name="arrow-right" size="0.875rem" />
            </a>
          )}
        </div>
      ),
    };
  });

  return (
    <section id="quickstart" className="doc-section">
      <div className="section-head">
        <span className="section-no">02</span>
        <h2 className="section-title">快速开始</h2>
      </div>
      <p className="section-lead">
        按以下四步完成首次接入，全程约 15 分钟。每一步都可以独立展开查看，
        点击步骤底部的「下一步」会自动展开后续步骤。
      </p>
      <Collapse
        activeKey={openSteps}
        onChange={(keys) => setOpenSteps(keys)}
        items={items}
        className="qs-collapse"
      />
    </section>
  );
}
