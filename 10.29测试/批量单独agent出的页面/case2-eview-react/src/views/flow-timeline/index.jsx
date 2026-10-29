import { useState } from "react";
import SelectCard from "@nce/eview-react/SelectCard";
import TipBox from "@nce/eview-react/TipBox";
import Dialog from "@nce/eview-react/Dialog";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import TextArea from "@/shared/TextArea";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

const TYPE_META = {
  pass: { text: "通过", tag: "success", dot: "var(--success)" },
  reject: { text: "驳回", tag: "error", dot: "var(--error)" },
  supplement: { text: "补充", tag: "info", dot: "var(--info-primary)" },
  info: { text: "流转", tag: "neutral", dot: "var(--gray-40)" },
  current: { text: "进行中", tag: "brand", dot: "var(--brand-50)" },
};

// ④ 右侧流转 Timeline：动作类型三色区分 + 类型筛选
// 紧凑两行节点（标题 + 时间·操作人），hover 查看完整备注，不出现横/纵向滚动条
export default function FlowTimeline({ nodes, notes, onAddNote }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const filteredNodes =
    typeFilter === "all" ? nodes : nodes.filter((n) => n.actionType === typeFilter);

  const submitNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    onAddNote(text);
    setNoteDraft("");
    notify("success", "备注已添加");
  };

  const filterData = [
    { text: "全部", value: "all" },
    { text: "通过", value: "pass" },
    { text: "驳回", value: "reject" },
    { text: "补充", value: "supplement" },
  ];

  return (
    <aside className="section-card flow-timeline">
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
      <div className="card-head">
        <h3 className="card-title">流转记录</h3>
        <div className="card-head-action">
          <a className="notes-toggle" onClick={() => setNotesOpen(true)}>
            备注 {notes.length}
          </a>
        </div>
      </div>

      <div className="tl-controls">
        <SelectCard
          value={typeFilter}
          onChange={(v) => setTypeFilter(v)}
          data={filterData}
        />
      </div>

      <div className="card-scroll tl-scroll">
        <div className="tl">
          {filteredNodes.map((node, idx) => {
            const meta = TYPE_META[node.actionType] || TYPE_META.info;
            const isCurrent = node.actionType === "current";
            return (
              <div className={isCurrent ? "tl-node tl-node--current" : "tl-node"} key={idx}>
                <span className="tl-dot" style={{ background: meta.dot }} />
                <div className="tl-node-body">
                  <TipBox type="simple" content={node.remark} direction="left">
                    <div className="tl-title-row">
                      <span className="tl-title">{node.title}</span>
                      <StatusTag type={meta.tag} text={meta.text} small dot={false} />
                    </div>
                    <div className="tl-meta">
                      {node.time} · {node.operator}
                    </div>
                  </TipBox>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tl-hover-tip">悬停节点可查看完整备注</div>

      <Dialog
        title="案件备注"
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        size={[520, "auto"]}
        buttons={[
          { text: "关闭", onClick: () => setNotesOpen(false) },
        ]}
      >
        <div className="notes-body">
          {notes.length === 0 && <div className="notes-empty">暂无备注，添加一条给协办同事的提示吧。</div>}
          <div className="notes-list">
            {notes.map((n, idx) => (
              <div className="note-item" key={idx}>
                <div className="note-meta">
                  {n.author} · {n.time}
                </div>
                <div className="note-content">{n.content}</div>
              </div>
            ))}
          </div>
          <div className="note-add">
            <TextArea
              rows={2}
              maxLength={100}
              value={noteDraft}
              onChange={(targetValue) => setNoteDraft(targetValue)}
              placeholder="添加备注（协办同事在流转记录中可见）"
            />
            <Button status="primary" text="添加备注" disabled={!noteDraft.trim()} onClick={submitNote} />
          </div>
        </div>
      </Dialog>
    </aside>
  );
}
