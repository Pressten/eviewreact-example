// Layer 3 shared H5 primitives — replacements for skill-banned antd components,
// plus showcase layout helpers (Section / Demo). Keep names H-prefixed to avoid
// colliding with banned component tag names at build time.

import { useState, useRef, useEffect } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

/* ---------- showcase layout helpers ---------- */

export function Section({ id, title, desc, children }) {
  return (
    <section className="sc-section" id={id}>
      <header className="sc-section-head">
        <h2 className="sc-section-title">{title}</h2>
        {desc ? <p className="sc-section-desc">{desc}</p> : null}
      </header>
      <div className="sc-section-body">{children}</div>
    </section>
  );
}

// a sub-card (Card alternative) — surface + shadow + radius, no border
export function SubCard({ title, extra, children, className = "", style }) {
  return (
    <div className={"sc-subcard " + className} style={style}>
      {(title || extra) && (
        <div className="sc-subcard-head">
          {title ? <span className="sc-subcard-title">{title}</span> : <span />}
          {extra ? <span className="sc-subcard-extra">{extra}</span> : null}
        </div>
      )}
      <div className="sc-subcard-body">{children}</div>
    </div>
  );
}

// one variant row: caption (props used) + live control
export function Demo({ label, note, children, block }) {
  return (
    <div className={"sc-demo" + (block ? " sc-demo-block" : "")}>
      <div className="sc-demo-label">{label}</div>
      {note ? <div className="sc-demo-note">{note}</div> : null}
      <div className="sc-demo-control">{children}</div>
    </div>
  );
}

/* ---------- typography (Typography alternative) ---------- */

const TITLE_FONT = {
  1: "var(--font-display-s)",
  2: "var(--font-headline-l)",
  3: "var(--font-headline-m)",
  4: "var(--font-headline-s)",
  5: "var(--font-body-l)",
};

export function TTitle({ level = 3, children, style }) {
  const Tag = "h" + Math.min(Math.max(level, 1), 5);
  return <Tag className={"sc-title sc-title-l" + level} style={{ font: TITLE_FONT[level], ...style }}>{children}</Tag>;
}

const TEXT_COLOR = {
  default: "var(--on-surface)",
  secondary: "var(--on-surface-variant)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--error)",
  disabled: "var(--text-disabled)",
};

export function TText({ type = "default", strong, code, children, style }) {
  let el = (
    <span className="sc-text" style={{ color: TEXT_COLOR[type], fontWeight: strong ? "var(--font-weight-semibold)" : "inherit", ...style }}>
      {children}
    </span>
  );
  if (code) el = <code className="sc-text-code">{el}</code>;
  return el;
}

export function TLink({ children, href = "#", onClick, disabled }) {
  return (
    <a
      className={"sc-link" + (disabled ? " sc-link-disabled" : "")}
      href={disabled ? undefined : href}
      onClick={onClick}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </a>
  );
}

export function TParagraph({ children, rows = 2, expandable = true }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sc-para">
      <div className={"sc-para-text" + (open ? " sc-para-open" : "")} style={{ WebkitLineClamp: open ? "unset" : String(rows) }}>
        {children}
      </div>
      {expandable ? (
        <a className="sc-link" onClick={() => setOpen((v) => !v)} style={{ cursor: "pointer" }}>
          {open ? "收起" : "展开"}
        </a>
      ) : null}
    </div>
  );
}

/* ---------- flex helpers (Space / Flex alternative) ---------- */

export function HStack({ gap = "var(--spacing-inline)", align = "center", justify, wrap, split, children, style }) {
  return (
    <div className="sc-hstack" style={{ gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : "nowrap", ...style }}>
      {split ? interpose(children, split) : children}
    </div>
  );
}
export function VStack({ gap = "var(--spacing-stack)", align, children, style }) {
  return (
    <div className="sc-vstack" style={{ gap, alignItems: align, ...style }}>{children}</div>
  );
}
export function Wrap({ gap = "var(--spacing-inline)", children, style }) {
  return <div className="sc-wrap" style={{ gap, ...style }}>{children}</div>;
}
export function Cluster({ justify = "flex-start", align = "center", gap = "var(--spacing-inline)", children, style }) {
  return <div className="sc-cluster" style={{ justifyContent: justify, alignItems: align, gap, ...style }}>{children}</div>;
}

function interpose(children, sep) {
  const arr = Array.isArray(children) ? children : [children];
  const out = [];
  arr.forEach((c, i) => {
    if (i) out.push(<span key={"s" + i} className="sc-split">{sep}</span>);
    out.push(c);
  });
  return out;
}

/* ---------- Row / Col alternative (12-col grid) ---------- */

export function Grid12({ gutter = "var(--spacing-gutter)", children, style }) {
  return <div className="sc-grid" style={{ gap: gutter, ...style }}>{children}</div>;
}
export function GCol({ span = 12, xs, sm, md, lg, xl, xxl, offset = 0, order, children, style }) {
  const styleObj = {
    gridColumn: `span ${span} / span ${span}`,
    gridColumnStart: offset ? `${offset + 1}` : undefined,
    order,
    ...style,
  };
  return <div className="sc-col" style={styleObj}>{children}</div>;
}

/* ---------- Card alternative ---------- */

export function HCard({ title, extra, cover, actions, size = "default", bordered = true, children, style }) {
  return (
    <div className={"sc-hcard sc-hcard-" + size + (bordered ? " sc-hcard-bordered" : "")} style={style}>
      {cover ? <div className="sc-hcard-cover">{cover}</div> : null}
      {(title || extra) && (
        <div className="sc-hcard-head">
          {title ? <span className="sc-hcard-title">{title}</span> : <span />}
          {extra ? <span className="sc-hcard-extra">{extra}</span> : null}
        </div>
      )}
      <div className="sc-hcard-body">{children}</div>
      {actions ? <div className="sc-hcard-actions">{actions}</div> : null}
    </div>
  );
}

/* ---------- Alert alternative ---------- */

const ALERT_TONE = {
  success: { bg: "var(--success-container)", border: "var(--success)", icon: "circle-check-big", iconColor: "var(--success)" },
  info: { bg: "var(--info-container)", border: "var(--info)", icon: "info", iconColor: "var(--info)" },
  warning: { bg: "var(--warning-container)", border: "var(--warning)", icon: "triangle-alert", iconColor: "var(--warning)" },
  error: { bg: "var(--error-container)", border: "var(--error)", icon: "circle-x", iconColor: "var(--error)" },
};

export function HAlert({ type = "info", message, description, showIcon, action, closable, banner, onClose, style }) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  const t = ALERT_TONE[type] || ALERT_TONE.info;
  return (
    <div className={"sc-halert" + (banner ? " sc-halert-banner" : "")} style={{ background: t.bg, borderColor: t.border, ...style }}>
      {showIcon ? <Icon name={t.icon} size="1.25rem" style={{ color: t.iconColor }} className="sc-halert-icon" /> : null}
      <div className="sc-halert-content">
        <div className="sc-halert-msg">{message}</div>
        {description ? <div className="sc-halert-desc">{description}</div> : null}
      </div>
      {action ? <div className="sc-halert-action">{action}</div> : null}
      {closable ? (
        <Icon name="x" size="0.875rem" className="sc-halert-close" title="关闭" onClick={() => { setClosed(true); onClose && onClose(); }} />
      ) : null}
    </div>
  );
}

/* ---------- Result alternative ---------- */

const RESULT_TONE = {
  success: { icon: "circle-check-big", color: "var(--success)" },
  error: { icon: "circle-x", color: "var(--error)" },
  info: { icon: "info", color: "var(--info)" },
  warning: { icon: "triangle-alert", color: "var(--warning)" },
  404: { icon: "compass", color: "var(--on-surface-variant)" },
  403: { icon: "lock", color: "var(--on-surface-variant)" },
  500: { icon: "server-crash", color: "var(--on-surface-variant)" },
};

export function HResult({ status = "info", title, subTitle, extra, style }) {
  const t = RESULT_TONE[status] || RESULT_TONE.info;
  const big = ["404", "403", "500"].includes(String(status));
  return (
    <div className="sc-hresult" style={style}>
      <div className="sc-hresult-icon" style={{ color: t.color }}>
        {big ? <span className="sc-hresult-code">{status}</span> : <Icon name={t.icon} size="3.75rem" />}
      </div>
      <div className="sc-hresult-title">{title}</div>
      {subTitle ? <div className="sc-hresult-sub">{subTitle}</div> : null}
      {extra ? <div className="sc-hresult-extra">{extra}</div> : null}
    </div>
  );
}

/* ---------- Skeleton alternative ---------- */

export function HSkeleton({ active, avatar, paragraph = true, rows = 3, type, width, style }) {
  const bars = Array.from({ length: paragraph ? rows : 0 });
  return (
    <div className={"sc-hskel" + (active ? " sc-hskel-active" : "")} style={style}>
      {avatar ? <div className="sc-hskel-avatar" /> : null}
      <div className="sc-hskel-lines">
        {type === "button" ? <div className="sc-hskel-btn" /> : null}
        {type === "input" ? <div className="sc-hskel-input" /> : null}
        {bars.map((_, i) => (
          <div key={i} className="sc-hskel-line" style={{ width: width || (i === bars.length - 1 ? "40%" : "100%") }} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Avatar alternative ---------- */

export function HAvatar({ size = "default", shape = "circle", src, icon, children, style }) {
  const sz = { large: "3rem", default: "2rem", small: "1.5rem" }[size] || size;
  return (
    <div className={"sc-havatar shape-" + shape} style={{ width: sz, height: sz, ...style }}>
      {src ? <img src={src} alt="" /> : icon ? <Icon name={icon} size="1.25rem" /> : <span>{children}</span>}
    </div>
  );
}
export function HAvatarGroup({ max = 4, children, style }) {
  const arr = Array.isArray(children) ? children : [children];
  const show = arr.slice(0, max);
  const rest = arr.length - show.length;
  return (
    <div className="sc-havatar-group" style={style}>
      {show}
      {rest > 0 ? <div className="sc-havatar sc-havatar-more">+{rest}</div> : null}
    </div>
  );
}

/* ---------- Statistic alternative ---------- */

export function HStatistic({ title, value, precision, leading, trailing, valueStyle, style }) {
  const num = precision != null ? Number(value).toFixed(precision) : value;
  return (
    <div className="sc-hstat" style={style}>
      {title ? <div className="sc-hstat-title">{title}</div> : null}
      <div className="sc-hstat-value" style={valueStyle}>
        {leading ? <span className="sc-hstat-affix">{leading}</span> : null}
        <span className="sc-hstat-num">{num}</span>
        {trailing ? <span className="sc-hstat-affix">{trailing}</span> : null}
      </div>
    </div>
  );
}

/* ---------- Descriptions alternative ---------- */

export function HDescriptions({ title, extra, items, bordered = true, column = 2, style }) {
  return (
    <div className={"sc-hdesc" + (bordered ? " sc-hdesc-bordered" : "")} style={{ gridTemplateColumns: `repeat(${column}, max-content 1fr)`, ...style }}>
      {title || extra ? (
        <div className="sc-hdesc-head" style={{ gridColumn: `span ${column * 2}` }}>
          {title ? <span className="sc-hdesc-title">{title}</span> : <span />}
          {extra ? <span>{extra}</span> : null}
        </div>
      ) : null}
      {items.map((it, i) => (
        <div key={i} className="sc-hdesc-row">
          <div className="sc-hdesc-label">{it.label}</div>
          <div className="sc-hdesc-value">{it.children}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- List alternative ---------- */

export function HList({ dataSource = [], renderItem, split = true, size = "default", loading, grid, style }) {
  if (loading) return <HSkeleton active paragraph rows={dataSource.length || 3} />;
  return (
    <div className={"sc-hlist sc-hlist-" + size + (split ? " sc-hlist-split" : "") + (grid ? " sc-hlist-grid" : "")} style={{ gridTemplateColumns: grid ? `repeat(${grid}, 1fr)` : undefined, ...style }}>
      {dataSource.map((item, i) => (
        <div className="sc-hlist-item" key={item.id || i}>{renderItem(item, i)}</div>
      ))}
    </div>
  );
}

/* ---------- Image alternative ---------- */

export function HImage({ src, width = "6rem", height = "6rem", preview, fallback, placeholder, style }) {
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <div className="sc-himage" style={{ width, height, ...style }}>
        {(!loaded && placeholder) ? <div className="sc-himage-ph">{placeholder}</div> : null}
        <img
          src={err && fallback ? fallback : src}
          alt=""
          onError={() => setErr(true)}
          onLoad={() => setLoaded(true)}
          onClick={() => preview && setOpen(true)}
          style={{ cursor: preview ? "pointer" : "default" }}
        />
      </div>
      {open ? (
        <div className="sc-himage-mask" onClick={() => setOpen(false)}>
          <img src={err && fallback ? fallback : src} alt="" />
        </div>
      ) : null}
    </>
  );
}

/* ---------- Upload alternative (no real network) ---------- */

export function HUpload({ listType = "text", multiple, children, style }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const accept = (list) => {
    const all = Array.from(list || []);
    const kept = multiple ? all : all.slice(0, 1);
    setFiles(kept.map((f, idx) => ({ uid: Date.now() + "-" + idx, name: f.name, url: URL.createObjectURL(f) })));
  };
  return (
    <div className="sc-hupload">
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => accept(e.target.files)}
      />
      {children ? (
        <div
          className={"sc-hupload-trigger" + (dragOver ? " sc-hupload-over" : "")}
          onClick={() => inputRef.current && inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); accept(e.dataTransfer.files); }}
        >
          {children}
        </div>
      ) : null}
      {files.length ? (
        <ul className={"sc-hupload-list sc-hupload-" + listType}>
          {files.map((f, i) => (
            <li key={i} className="sc-hupload-item">
              {listType !== "text" ? <img src={f.url} alt="" /> : <Icon name="file" size="0.875rem" />}
              <span className="sc-hupload-name">{f.name}</span>
              <Icon name="x" size="0.75rem" title="移除" onClick={() => setFiles(files.filter((_, j) => j !== i))} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ---------- Comment alternative ---------- */

export function HComment({ author, avatar, content, datetime, actions, children, style }) {
  return (
    <div className="sc-hcomment" style={style}>
      {avatar ? <div className="sc-hcomment-avatar">{avatar}</div> : null}
      <div className="sc-hcomment-body">
        <div className="sc-hcomment-head">
          <span className="sc-hcomment-author">{author}</span>
          {datetime ? <span className="sc-hcomment-time">{datetime}</span> : null}
        </div>
        <div className="sc-hcomment-content">{content}</div>
        {actions ? <div className="sc-hcomment-actions">{actions}</div> : null}
        {children ? <div className="sc-hcomment-children">{children}</div> : null}
      </div>
    </div>
  );
}

/* ---------- BackTop (FloatButton.BackTop alternative) ---------- */

export function BackTop({ target, visibilityHeight = 200, children }) {
  const [show, setShow] = useState(false);
  const elRef = useRef(null);
  useEffect(() => {
    const node = target && target.current ? target.current : document.documentElement;
    const handler = () => setShow((node.scrollTop || window.scrollY || 0) > visibilityHeight);
    handler();
    const root = target && target.current ? target.current : window;
    root.addEventListener("scroll", handler, { passive: true });
    return () => root.removeEventListener("scroll", handler);
  }, [target, visibilityHeight]);
  if (!show) return null;
  return (
    <button
      ref={elRef}
      className="sc-backtop"
      title="回到顶部"
      onClick={() => {
        const node = target && target.current ? target.current : document.documentElement;
        node.scrollTo ? node.scrollTo({ top: 0, behavior: "smooth" }) : (node.scrollTop = 0);
      }}
    >
      {children || <Icon name="arrow-up" size="1.25rem" />}
    </button>
  );
}

/* ---------- Affix alternative (position: sticky) ---------- */

export function Sticky({ offsetTop = 0, children, style }) {
  return (
    <div className="sc-sticky" style={{ top: offsetTop, ...style }}>
      {children}
    </div>
  );
}
