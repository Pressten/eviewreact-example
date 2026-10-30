import { IconPlusIcPublicClock, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import { recentAccess } from "../../mock/drive.jsx";
import FileTypeIcon from "../../components/file-type-icon/index.jsx";
import "./index.css";

export default function RecentAccess({ onSelectFile }) {
  return (
    <section className="recent-access">
      <div className="recent-head">
        <span className="recent-title">
          <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />
          最近访问
        </span>
        <a className="recent-more" onClick={(e) => e.preventDefault()} href="#">查看全部</a>
      </div>
      <div className="recent-list">
        {recentAccess.map((r) => (
          <a
            key={r.id}
            className="recent-item"
            onClick={(e) => { e.preventDefault(); onSelectFile(r.id); }}
            href="#"
          >
            <span className="recent-icon">
              <FileTypeIcon type={extType(r.ext)} size="1.25rem" />
            </span>
            <span className="recent-body">
              <span className="recent-name" title={r.name}>{r.name}</span>
              <span className="recent-meta">{r.time} · {r.space}</span>
            </span>
            <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['#AEAEAE']} />
          </a>
        ))}
      </div>
    </section>
  );
}

function extType(ext) {
  if (ext === "docx" || ext === "doc") return "doc";
  if (ext === "xlsx" || ext === "xls") return "sheet";
  if (ext === "pptx" || ext === "ppt") return "slide";
  if (ext === "pdf") return "pdf";
  if (ext === "png" || ext === "jpg" || ext === "fig") return "image";
  if (ext === "zip" || ext === "rar") return "archive";
  return "doc";
}
