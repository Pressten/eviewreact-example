import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import Select from "@nce/eview-react/Select";
import SearchInput from "@nce/eview-react/SearchInput";
import Chart from "@nce/eview-react/Chart";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { useToast, useConfirmDialog } from "../../shared/feedback.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { dailySync, seedTasks, sourceOptions, syncLogs } from "../../mock/dataset.js";
import "./index.css";

const sourceIcons = { MySQL: "database", Kafka: "wifi", "REST API": "cloud", 文件上传: "upload", "OCR 采集": "scan-line" };

// TODO(eview-react): Progress 未覆盖，当前手写最小可用版（handwrite-templates §9）
function SimpleProgress({ percent, status = "normal" }) {
  const color =
    status === "error"
      ? "var(--error, #E02128)"
      : status === "success"
        ? "var(--success, #62B42E)"
        : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
      </div>
      <span style={{ color: "var(--on-surface-variant, #777)", minWidth: "40px", textAlign: "right" }}>{p}%</span>
    </div>
  );
}

const segOptions = [
  { label: "全部", value: "all" },
  { label: "运行中", value: "running" },
  { label: "失败", value: "failed" },
];

export default function SyncView() {
  const [tasks, setTasks] = useState(() => seedTasks.map((t) => ({ ...t })));
  const [kw, setKw] = useState("");
  const [src, setSrc] = useState("all");
  const [seg, setSeg] = useState("all");
  const [toastNode, notify] = useToast();
  const [confirmNode, confirm] = useConfirmDialog();
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
              notify.success(`「${t.name}」本轮同步完成`);
            }
            return { ...t, progress: 100, status: "done" };
          }
          return { ...t, progress: next };
        })
      );
    }, 900);
    return () => clearInterval(timer.current);
  }, []);

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
    confirm({
      title: "删除同步任务",
      content: `任务「${t.name}」删除后不可恢复，确定删除吗？`,
      okText: "删除任务",
      danger: true,
      onOk: () => {
        setTasks((prev) => prev.filter((x) => x.id !== t.id));
        notify.warn(`任务「${t.name}」已删除`);
      },
    });
  };

  const renderMoreMenu = (t) => (
    <div className="sy-more-menu">
      <button
        type="button"
        className="sy-more-item"
        onClick={() => notify.info(`「${t.name}」运行日志：近 3 次执行全部留痕，可联系管理员导出`)}
      >
        <Icon name="file-text" size={14} />
        <span>查看运行日志</span>
      </button>
      <button
        type="button"
        className="sy-more-item"
        onClick={() => notify.info("演示操作：调度计划编辑器即将上线")}
      >
        <Icon name="pencil" size={14} />
        <span>编辑调度计划</span>
      </button>
      <hr className="sy-more-divider" />
      <button type="button" className="sy-more-item danger" onClick={() => removeTask(t)}>
        <Icon name="trash-2" size={14} />
        <span>删除任务</span>
      </button>
    </div>
  );

  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  return (
    <div className="sy-page">
      {toastNode}
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
              notify.success("已启动全部排队任务");
            }}
          >
            同步全部
          </Button>
          <Button
            status="primary"
            leftIcon={<Icon name="plus" size={14} />}
            onClick={() => notify.info("演示：任务编排器即将上线")}
          >
            新建同步任务
          </Button>
        </div>
      </div>

      <div className="sy-layout">
        <SectionCard icon="refresh-cw" title="任务列表" subtitle="运行中的任务将实时推进进度">
          <div className="sy-toolbar">
            <SearchInput
              value={kw}
              onChange={(value) => setKw(value)}
              onClear={() => setKw("")}
              placeholder="搜索任务名称"
              style={{ width: 240 }}
            />
            <Select
              style={{ width: 150 }}
              value={src}
              onChange={(value) => setSrc(value)}
              options={[{ value: "all", text: "全部来源" }, ...sourceOptions.map((v) => ({ value: v, text: v }))]}
            />
            <div className="sy-seg">
              {segOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`sy-seg-item${seg === o.value ? " active" : ""}`}
                  onClick={() => setSeg(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
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
                  status={t.status === "failed" ? "error" : t.status === "done" ? "success" : "normal"}
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
                          notify.info(`「${t.name}」已暂停`);
                        }}
                      >
                        暂停
                      </Button>
                    ) : (
                      // TODO(eview-react): 原 antd type="primary" ghost，eview Button 无 ghost；
                      // 为遵循“单页一个 primary”约定，行内启动按钮降级为 default 次按钮。
                      <Button
                        size="small"
                        leftIcon={<Icon name="play" size={13} />}
                        onClick={() => {
                          setStatus(t.id, "running", t.status === "done");
                          notify.success(`「${t.name}」已启动`);
                        }}
                      >
                        {t.status === "failed" ? "重试" : t.status === "done" ? "重新运行" : "启动"}
                      </Button>
                    )}
                    <TipBox
                      content={renderMoreMenu(t)}
                      trigger="click"
                      direction="bottomRight"
                      isMouseLeaveClose={false}
                    >
                      <IconButton iconName={<Icon name="ellipsis" size={14} />} size="small" />
                    </TipBox>
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
      {confirmNode}
    </div>
  );
}
