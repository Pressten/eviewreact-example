// Layer 4: 更新日志章节 — Timeline 展示版本变更（新增 / 优化 / 修复 / 安全 / 下线公告）
import { Timeline } from "antd";
import { CHANGELOG } from "../../mock/changelog.js";
import "./index.css";

export default function SectionChangelog() {
  const items = CHANGELOG.map((release) => ({
    // 当前活跃通道（预览 / 生产推荐）用绿色节点，历史节点弱化为灰
    color: release.highlight ? "green" : "gray",
    children: (
      <div className="cl-item">
        <div className="cl-head">
          <span className="cl-version">{release.version}</span>
          {release.highlight && <span className="cl-channel">{release.highlight}</span>}
          <span className="cl-date">{release.date}</span>
        </div>
        <ul className="cl-entries">
          {release.entries.map((entry) => (
            <li className="cl-entry" key={entry.text}>
              <span className={`ann-tag at-${entry.type}`}>{entry.tag}</span>
              <span className="cl-text">{entry.text}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <section id="changelog" className="doc-section">
      <div className="section-head">
        <span className="section-no">05</span>
        <h2 className="section-title">更新日志</h2>
      </div>
      <p className="section-lead">
        版本变更按时间倒序排列。破坏性变更将提前 90 天在此公告；预览通道（v3）的变更不保证向后兼容。
      </p>
      <Timeline className="cl-timeline" items={items} />
    </section>
  );
}
