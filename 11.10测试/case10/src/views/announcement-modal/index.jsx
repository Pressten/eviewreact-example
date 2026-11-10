// Layer 4: 版本更新公告 Modal — 首访自动弹出，顶栏公告入口可再次打开
import { Modal, Button } from "antd";
import { useApp } from "../../context.jsx";
import { ANNOUNCEMENT } from "../../mock/changelog.js";
import "./index.css";

export default function AnnouncementModal() {
  const { announcementOpen, setAnnouncementOpen } = useApp();

  const close = () => setAnnouncementOpen(false);

  // 查看更新日志：关闭弹窗并滚动定位到更新日志章节
  const goChangelog = () => {
    close();
    setTimeout(() => {
      const target = document.getElementById("changelog");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <Modal
      open={announcementOpen}
      onCancel={close}
      title={
        <span className="ann-title">
          版本更新公告 · <span className="ann-title-ver">{ANNOUNCEMENT.version}</span>
        </span>
      }
      footer={[
        <Button key="changelog" onClick={goChangelog}>
          查看更新日志
        </Button>,
        <Button key="ok" type="primary" onClick={close}>
          知道了
        </Button>,
      ]}
      width={560}
    >
      <div className="ann-body">
        <div className="ann-date">发布于 {ANNOUNCEMENT.date} · 当前文档已默认展示 v2 稳定版</div>
        <ul className="ann-list">
          {ANNOUNCEMENT.entries.map((entry) => (
            <li className="ann-item" key={entry.text}>
              <span className={`ann-tag at-${entry.type}`}>{entry.tag}</span>
              <span className="ann-text">{entry.text}</span>
            </li>
          ))}
        </ul>
        <div className="ann-foot">
          可通过顶栏「版本切换」对比 v1 / v2 / v3 的接口差异，或阅读
          <a className="ann-link" onClick={goChangelog}>
            完整更新日志
          </a>
          。
        </div>
      </div>
    </Modal>
  );
}
