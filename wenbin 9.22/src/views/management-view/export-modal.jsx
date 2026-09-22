import { useEffect, useRef, useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import Button from "@nce/eview-react/Button";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Spinner from "@nce/eview-react/Spinner";
import Dialog from "@nce/eview-react/Dialog";
import { Icon } from "../../shared/icon.jsx";
import SimpleProgress from "../../components/simple-progress.jsx";
import { message } from "../../shared/message.jsx";
import "./index.css";

const formats = [
  { v: "CSV", icon: "file-text", d: "通用表格格式" },
  { v: "JSON", icon: "file-code", d: "结构化嵌套数据" },
  { v: "Excel", icon: "file-spreadsheet", d: "含报表与样式" },
  { v: "Parquet", icon: "layers", d: "列存高性能格式" },
];

const contentOptions = [
  { text: "原始数据", value: "raw" },
  { text: "字段结构", value: "schema" },
  { text: "变更记录", value: "logs" },
  { text: "质量报告", value: "quality" },
];

const contentLabels = { raw: "原始数据", schema: "字段结构", logs: "变更记录", quality: "质量报告" };

const stageText = (p) =>
  p < 30 ? "正在校验访问权限与导出配额…" : p < 60 ? "正在打包数据文件…" : p < 90 ? "正在生成校验和清单…" : "即将完成…";

export default function ExportModal({ open, ctx, onClose }) {
  const [format, setFormat] = useState("CSV");
  const [content, setContent] = useState(["raw", "schema"]);
  const [scope, setScope] = useState("selection");
  const [splitGB, setSplitGB] = useState(2);
  const [phase, setPhase] = useState("config");
  const [percent, setPercent] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (open) {
      setPhase("config");
      setPercent(0);
      setFormat("CSV");
      setContent(["raw", "schema"]);
      setSplitGB(2);
      setScope(ctx?.scope === "filtered" ? "filtered" : "selection");
    } else {
      clearInterval(timer.current);
    }
  }, [open, ctx]);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    setPhase("running");
    setPercent(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setPercent((p) => {
        const next = Math.min(100, p + Math.round(4 + Math.random() * 9));
        if (next >= 100) {
          clearInterval(timer.current);
          setTimeout(() => {
            setPhase("done");
            message.success("导出任务已完成");
          }, 350);
        }
        return next;
      });
    }, 260);
  };

  const count = ctx?.count || 0;
  const fileName = `datahub-export-${format.toLowerCase()}-${count}-20260921.zip`;

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title={
        <span className="mg-modal-title">
          <Icon name="download" size={16} />
          数据导出
        </span>
      }
      size={[560, "auto"]}
      style={{ maxHeight: "80vh" }}
    >
      {phase === "config" && (
        <div className="ex-body">
          {ctx?.scope === "single" ? (
            <DivMessage display type="default" showIcon text={`将导出数据集「${ctx.recordName}」`} enableDisposeTimeOut={false} className="ex-alert" />
          ) : (
            <div className="ex-block">
              <label>导出范围</label>
              <div className="ex-scope">
                <button type="button" className={`ex-radio-card${scope === "selection" ? " active" : ""}`} onClick={() => setScope("selection")}>
                  仅选中项（{count} 条）
                </button>
                <button type="button" className={`ex-radio-card${scope === "filtered" ? " active" : ""}`} onClick={() => setScope("filtered")}>
                  当前筛选结果（{ctx?.filteredCount ?? count} 条）
                </button>
              </div>
            </div>
          )}
          <div className="ex-block">
            <label>导出格式</label>
            <div className="ex-fmt">
              {formats.map((f) => (
                <button
                  key={f.v}
                  type="button"
                  className={`ex-fmt-item${format === f.v ? " active" : ""}`}
                  onClick={() => setFormat(f.v)}
                >
                  <span className="ex-fmt-card">
                    <Icon name={f.icon} size={18} />
                    <b>{f.v}</b>
                    <i>{f.d}</i>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="ex-block">
            <label>包含内容</label>
            <CheckboxGroup data={contentOptions} value={content} onChange={(v) => setContent(v)} />
          </div>
          <div className="ex-block ex-row2">
            <div>
              <label>分卷大小</label>
              <span className="ex-split">
                <Spinner min={1} max={10} value={splitGB} onChange={(v) => setSplitGB(v || 1)} />
                <em>GB</em>
              </span>
            </div>
            <div>
              <label>预计体积</label>
              <span className="ex-est">
                {(count * 3.2).toFixed(1)} MB · {Math.max(1, Math.ceil((count * 3.2) / (splitGB * 1024)))} 个分卷
              </span>
            </div>
          </div>
          <div className="ex-footer">
            <Button text="取消" onClick={onClose} />
            <Button status="primary" leftIcon={<Icon name="download" size={14} />} text="开始导出" onClick={start} />
          </div>
        </div>
      )}
      {phase === "running" && (
        <div className="ex-body ex-running">
          <span className="ex-running-icon">
            <Icon name="timer" size={32} />
          </span>
          <SimpleProgress percent={percent} status="active" />
          <p>{stageText(percent)}</p>
          <div className="ex-footer">
            <Button status="risk" text="取消导出" onClick={onClose} />
          </div>
        </div>
      )}
      {phase === "done" && (
        <div className="ex-body">
          <DivMessage display type="success" showIcon title="导出完成" enableDisposeTimeOut={false} className="ex-alert">
            <div>文件已生成并通过完整性校验，可立即下载。</div>
          </DivMessage>
          <div className="ex-file">
            <Icon name="file-text" size={20} />
            <div>
              <b>{fileName}</b>
              <span>
                {(count * 3.2).toFixed(1)} MB · {format} 格式 · 包含{content.map((c) => contentLabels[c]).join("、") || "基础数据"}
              </span>
            </div>
          </div>
          <div className="ex-footer">
            <Button text="关闭" onClick={onClose} />
            <Button status="primary" leftIcon={<Icon name="download" size={14} />} text="下载文件" onClick={() => message.success("已开始下载，请留意浏览器下载栏")} />
          </div>
        </div>
      )}
    </Dialog>
  );
}
