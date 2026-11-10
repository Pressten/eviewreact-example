// Layer 4: 中栏文档容器 — 面包屑 + 版本切换 + 章节组装 + 滚动联动（scroll spy）+ 回到顶部
import { useEffect, useRef, useState } from "react";
import { Breadcrumb, Segmented } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { VERSION_META, VERSION_ORDER } from "../../mock/api-registry.js";
import SectionOverview from "../section-overview/index.jsx";
import SectionAuth from "../section-auth/index.jsx";
import SectionQuickstart from "../section-quickstart/index.jsx";
import SectionErrors from "../section-errors/index.jsx";
import SectionApiList from "../section-api-list/index.jsx";
import SectionChangelog from "../section-changelog/index.jsx";
import "./index.css";

const SECTION_IDS = ["overview", "auth", "quickstart", "errors", "apis", "changelog"];

export default function DocBody() {
  const { version, changeVersion, setActiveSection } = useApp();
  const scrollRef = useRef(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const meta = VERSION_META[version];

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 滚动联动：当前章节同步左侧菜单高亮 + 回到顶部按钮显隐
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const handleScroll = () => {
      let current = SECTION_IDS[0];
      SECTION_IDS.forEach((id) => {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= 160) current = id;
      });
      setActiveSection(current);
      setShowBackTop(el.scrollTop > 480);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  return (
    <main className="doc-main" ref={scrollRef}>
      <div className="doc-crumb-bar">
        <Breadcrumb
          items={[
            {
              title: (
                <a
                  className="crumb-link"
                  onClick={() => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  文档中心
                </a>
              ),
            },
            {
              title: (
                <a className="crumb-link" onClick={() => scrollToSection("overview")}>
                  API 参考
                </a>
              ),
            },
            {
              title: (
                <a className="crumb-link" onClick={() => scrollToSection("apis")}>
                  接口列表
                </a>
              ),
            },
          ]}
        />
      </div>

      <div className="doc-main-inner">
        {/* 版本切换：正文标题 / 适用性说明 / 接口状态联动 */}
        <div className="doc-version-row">
          <div className="version-switch">
            <span className="version-label">文档版本</span>
            <Segmented
              value={version}
              onChange={(value) => changeVersion(value)}
              options={VERSION_ORDER.map((key) => ({
                value: key,
                label: VERSION_META[key].label,
              }))}
            />
          </div>
          <span className="version-note">{meta.releaseNote}</span>
        </div>

        <SectionOverview />
        <SectionAuth />
        <SectionQuickstart />
        <SectionErrors />
        <SectionApiList />
        <SectionChangelog />

        <footer className="doc-footer">
          最后更新于 2026-10-28 · 以上内容适用于 {meta.docTag}
          <a className="footer-link">联系技术支持</a>
        </footer>
      </div>

      {/* 回到顶部 */}
      {showBackTop && (
        <button
          type="button"
          className="back-top"
          title="回到顶部"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Icon name="arrow-up" size="1.25rem" />
        </button>
      )}
    </main>
  );
}
