import { useEffect, useRef, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Button from "@nce/eview-react/Button";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Spinner from "@nce/eview-react/Spinner";
import RadioGroup from "@nce/eview-react/RadioGroup";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
import Progress from "../../components/progress/index.jsx";

const formats = [
  { v: "CSV", icon: "file-text", d: "通用表格格式" },
  { v: "JSON", icon: "file-code", d: "结构化嵌套数据" },
  { v: "Excel", icon: "file-spreadsheet", d: "含报表与样式" },
  { v: "Parquet", icon: "layers", d: "列存高性能格式" },
];

const contentOptions = [
  { label: "原始数据", value: "raw" },
  { label: "字段结构", value: "schema" },
  { label: "变更记录", value: "logs" },
  { label: "质量报告", value: "quality" },
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
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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
            notify("success", "导出任务已完成");
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
      title={
        <span className="mg-modal-title">
          <Icon name="download" size={16} />
          数据导出
        </span>
      }
      size={[560, "auto"]}
      style={{ maxHeight: "80vh" }}
      onClose={onClose}
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      {phase === "config" && (
        <div className="ex-body">
          {ctx?.scope === "single" ? (
            <DivMessage
              display
              type="default"
              text={`将导出数据集「${ctx.recordName}」`}
              enableDisposeTimeOut={false}
              className="ex-alert"
            />
          ) : (
            <div className="ex-block">
              <label>导出范围</label>
              <RadioGroup
                isControlled
                type="vertical"
                data={[
                  { value: "selection", text: `仅选中项（${count} 条）` },
                  { value: "filtered", text: `当前筛选结果（${ctx?.filteredCount ?? count} 条）` },
                ]}
                value={scope}
                onChange={(a, b) => {
                  const next = a === scope ? b : a;
                  setScope(next);
                }}
              />
            </div>
          )}
          <div className="ex-block">
            <label>导出格式</label>
            <div className="ex-fmt">
              {formats.map((f) => (
                <div
                  key={f.v}
                  className={`ex-fmt-item${format === f.v ? " active" : ""}`}
                  role="radio"
                  aria-checked={format === f.v}
                  tabIndex={0}
                  onClick={() => setFormat(f.v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFormat(f.v);
                    }
                  }}
                >
                  <span className="ex-fmt-card">
                    <Icon name={f.icon} size={18} />
                    <b>{f.v}</b>
                    <i>{f.d}</i>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="ex-block">
            <label>包含内容</label>
            <CheckboxGroup
              data={contentOptions.map((c) => ({ text: c.label, value: c.value }))}
              value={content}
              onChange={(value) => setContent(value)}
            />
          </div>
          <div className="ex-block ex-row2">
            <div>
              <label>分卷大小</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Spinner min={1} max={10} value={splitGB} doNotFocusWhenValueUpdate onChange={(v) => setSplitGB(v || 1)} />
                <span>GB</span>
              </div>
            </div>
            <div>
              <label>预计体积</label>
              <span className="ex-est">
                {(count * 3.2).toFixed(1)} MB · {Math.max(1, Math.ceil((count * 3.2) / (splitGB * 1024)))} 个分卷
              </span>
            </div>
          </div>
          <div className="ex-footer">
            <Button onClick={onClose}>取消</Button>
            <Button status="primary" leftIcon={<Icon name="download" size={14} />} onClick={start}>
              开始导出
            </Button>
          </div>
        </div>
      )}
      {phase === "running" && (
        <div className="ex-body ex-running">
          <span className="ex-running-icon">
            <Icon name="timer" size={32} />
          </span>
          <Progress percent={percent} status="normal" />
          <p>{stageText(percent)}</p>
          <div className="ex-footer">
            <Button status="risk" onClick={onClose}>
              取消导出
            </Button>
          </div>
        </div>
      )}
      {phase === "done" && (
        <div className="ex-body">
          <DivMessage
            display
            type="success"
            title="导出完成"
            text="文件已生成并通过完整性校验，可立即下载。"
            enableDisposeTimeOut={false}
            className="ex-alert"
          />
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
            <Button onClick={onClose}>关闭</Button>
            <Button
              status="primary"
              leftIcon={<Icon name="download" size={14} />}
              onClick={() => notify("success", "已开始下载，请留意浏览器下载栏")}
            >
              下载文件
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
