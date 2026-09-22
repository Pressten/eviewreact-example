import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Chart from "../../shared/chart.jsx";
import { Icon } from "../../shared/icon.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { dailySync, seedTasks, sourceOptions, syncLogs } from "../../mock/dataset.js";
import "./index.css";

const sourceIcons = { MySQL: "database", Kafka: "wifi", "REST API": "cloud", 文件上传: "upload", "OCR 采集": "scan-line" };

// 手写进度条（antd Progress 无对应）
function SimpleProgress({ percent, status }) {
  const p = Math.min(100, Math.max(0, percent));
  const color = status === "exception" ? "var(--error)" : status === "success" ? "var(--success)" : "var(--primary)";
  return (
    <div className="sy-progress">
      <div className="sy-progress-track">
        <div className="sy-progress-fill" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

// 行内"更多"下拉（antd Dropdown 无对应）
function TaskMoreMenu({ task, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items = [
    { key: "log", icon: "file-text", label: "查看运行日志" },
    { key: "edit", icon: "pencil", label: "编辑调度计划" },
    { key: "del", icon: "trash-2", label: "删除任务", danger: true },
  ];

  return (
    <span className="sy-more-wrap" ref={ref}>
      <Button size="small" status="text" leftIcon={<Icon name="ellipsis" size={14} />} onClick={() => setOpen((v) => !v)} />
      {open ? (
        <span className="sy-more-menu" role="menu">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              className={`hb-menu-item${it.danger ? " danger" : ""}`}
              onClick={() => {
                setOpen(false);
                onAction(it.key, task);
              }}
            >
              <Icon name={it.icon} size={14} />
              <span>{it.label}</span>
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}

export default function SyncView() {
  const { notify } = useNotice();
  const [tasks, setTasks] = useState(() => seedTasks.map((t) => ({ ...t })));
  const [kw, setKw] = useState("");
  const [src, setSrc] = useState("all");
  const [seg, setSeg] = useState("all");
  const [confirm, setConfirm] = useState(null);
  const notified = useRef(new Set());
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.status !== "running") return t;
          const next = Math.min(100, t.progress + Math.round(1 + Math.random() * 3));
          if (next >= 100) {
            if (!notified.current.has(t.id)) {
              notified.current.add(t.id);
              notify("success", `「${t.name}」本轮同步完成`);
            }
            return { ...t, progress: 100, status: "done" };
          }
          return { ...t, progress: next };
        })
      );
    }, 900);
    return () => clearInterval(timer.current);
  }, [notify]);

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const k = kw.trim().toLowerCase();
        if (k && !t.name.toLowerCase().includes(k)) return false;
        if (src !== "all" && t.source !== src) return false;
        if (seg !== "all" && t.status !== seg) return false;
        return true;
      }),
    [tasks, kw, src, seg]
  );

  const setStatus = (id, status, reset) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, progress: reset ? 0 : t.progress } : t)));
  };

  const removeTask = (t) => {
    setConfirm({
      type: "risk",
      content: `任务「${t.name}」删除后不可恢复，确定删除吗？`,
      okText: "删除任务",
      danger: true,
      onOk: () => {
        setTasks((prev) => prev.filter((x) => x.id !== t.id));
        notify("warn", `任务「${t.name}」已删除`);
      },
    });
  };

  const onMoreAction = (key, t) => {
    if (key === "log") notify("info", `「${t.name}」运行日志：近 3 次执行全部留痕，可联系管理员导出`);
    else if (key === "edit") notify("info", "演示操作：调度计划编辑器即将上线");
    else removeTask(t);
  };

  const runConfirm = () => {
    if (confirm && confirm.onOk) confirm.onOk();
    setConfirm(null);
  };

  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  return (
    <div className="sy-page">
      <div className="page-head">
        <div>
          <h2>数据同步</h2>
          <p>
            共 {tasks.length} 个同步任务 · 运行中 {running} 个{failed > 0 ? ` · 失败 ${failed} 个待处理` : ""}
          </p>
        </div>
        <div className="page-head-actions">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            onClick={() => {
              setTasks((prev) => prev.map((t) => (t.status === "queued" ? { ...t, status: "running" } : t)));
              notify("success", "已启动全部排队任务");
            }}
          >
            同步全部
          </Button>
          <Button status="primary" leftIcon={<Icon name="plus" size={14} />} onClick={() => notify("info", "演示：任务编排器即将上线")}>
            新建同步任务
          </Button>
        </div>
      </div>

      <div className="sy-layout">
        <SectionCard icon="refresh-cw" title="任务列表" subtitle="运行中的任务将实时推进进度">
          <div className="sy-toolbar">
            <SearchInput
              style={{ width: 240 }}
              placeholder="搜索任务名称"
              value={kw}
              onChange={(v) => setKw(v)}
              onClear={() => setKw("")}
            />
            <Select
              selectStyle={{ width: 150 }}
              value={src}
              onChange={(v) => setSrc(v)}
              options={[{ value: "all", text: "全部来源" }, ...sourceOptions.map((v) => ({ value: v, text: v }))]}
            />
            <SelectCard
              type="small"
              data={[
                { value: "all", text: "全部" },
                { value: "running", text: "运行中" },
                { value: "failed", text: "失败" },
              ]}
              value={seg}
              onChange={(v) => setSeg(v)}
            />
          </div>
          <div className="sy-tasks">
            {filtered.map((t) => (
              <div className="sy-task" key={t.id}>
                <div className="sy-task-head">
                  <span className="sy-task-icon">
                    <Icon name={sourceIcons[t.source] || "server"} size={18} />
                  </span>
                  <div className="sy-task-info">
                    <b>{t.name}</b>
                    <span>
                      {t.source} · {t.schedule} · 上次执行 {t.lastRun}
                    </span>
                  </div>
                  <StatusTag status={t.status} />
                </div>
                <SimpleProgress
                  percent={t.progress}
                  status={t.status === "failed" ? "exception" : t.status === "done" ? "success" : "active"}
                />
                <div className="sy-task-foot">
                  <span>同步量 {t.records}</span>
                  <span>耗时/延迟 {t.latency}</span>
                  <div className="sy-task-actions">
                    {t.status === "running" ? (
                      <Button
                        size="small"
                        leftIcon={<Icon name="pause" size={13} />}
                        onClick={() => {
                          setStatus(t.id, "queued");
                          notify("info", `「${t.name}」已暂停`);
                        }}
                      >
                        暂停
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        status="primary"
                        leftIcon={<Icon name="play" size={13} />}
                        onClick={() => {
                          setStatus(t.id, "running", t.status === "done");
                          notify("success", `「${t.name}」已启动`);
                        }}
                      >
                        {t.status === "failed" ? "重试" : t.status === "done" ? "重新运行" : "启动"}
                      </Button>
                    )}
                    <TaskMoreMenu task={t} onAction={onMoreAction} />
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="sy-empty">
                <Icon name="inbox" size={28} />
                <p>没有符合条件的任务</p>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="sy-side">
          <SectionCard icon="chart-column" title="近 7 日同步量" subtitle="万条 / 日">
            <Chart name="BarChart" option={{ data: dailySync, xAxis: { data: "日期" }, yAxisTitle: "同步量 (万条)" }} style={{ height: 240 }} />
          </SectionCard>
          <SectionCard icon="file-text" title="运行日志">
            <div className="sy-logs">
              {syncLogs.map((l, i) => (
                <div className="sy-log" key={i}>
                  <span className={`sy-log-dot tone-${l.tone}`} />
                  <div>
                    <p>{l.title}</p>
                    <span>{l.desc}</span>
                    <i>{l.time}</i>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <MessageDialog
        type={confirm?.type || "confirm"}
        isOpen={!!confirm}
        iconLocation="title"
        content={confirm?.content}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { onClick: () => setConfirm(null) },
          ok: { text: confirm?.okText || "确定", status: confirm?.danger ? "risk" : "primary", focused: true, onClick: runConfirm },
        }}
      />
    </div>
  );
}
