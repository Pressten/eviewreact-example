import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import MessageDialog from "@nce/eview-react/MessageDialog";
import SelectCard from "@nce/eview-react/SelectCard";
import Select from "@nce/eview-react/Select";
import DivMessage from "@nce/eview-react/DivMessage";
import TipBox from "@nce/eview-react/TipBox";
import Chart from "@nce/eview-react/Chart";
import { Icon } from "../../shared/icon.jsx";
import Progress from "../../components/progress/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { dailySync, seedTasks, sourceOptions, syncLogs } from "../../mock/dataset.js";
import "./index.css";

const sourceIcons = { MySQL: "database", Kafka: "wifi", "REST API": "cloud", 文件上传: "upload", "OCR 采集": "scan-line" };

const moreItems = [
  { key: "log", icon: <Icon name="file-text" size={14} />, label: "查看运行日志" },
  { key: "edit", icon: <Icon name="pencil" size={14} />, label: "编辑调度计划" },
  { type: "divider" },
  { key: "del", icon: <Icon name="trash-2" size={14} />, label: "删除任务", danger: true },
];

export default function SyncView() {
  const [tasks, setTasks] = useState(() => seedTasks.map((t) => ({ ...t })));
  const [kw, setKw] = useState("");
  const [src, setSrc] = useState("all");
  const [seg, setSeg] = useState("all");
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState(null);
  const notified = useRef(new Set());
  const timer = useRef(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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
    setConfirm({
      content: `任务「${t.name}」删除后不可恢复，确定删除吗？`,
      okText: "删除任务",
      danger: true,
      onOk: () => {
        setTasks((prev) => prev.filter((x) => x.id !== t.id));
        notify("warn", `任务「${t.name}」已删除`);
      },
    });
  };

  const handleMoreClick = (t, key) => {
    if (key === "log") notify("default", `「${t.name}」运行日志：近 3 次执行全部留痕，可联系管理员导出`);
    else if (key === "edit") notify("default", "演示操作：调度计划编辑器即将上线");
    else if (key === "del") removeTask(t);
  };

  const moreMenuContent = (t) => (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 168, padding: 4 }}>
      {moreItems.map((it, idx) =>
        it.type === "divider" ? (
          <div key={`d${idx}`} style={{ height: 1, background: "var(--divider)", margin: "4px 0" }} />
        ) : (
          <button
            key={it.key}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 8px",
              border: "none",
              background: "transparent",
              borderRadius: "var(--radius-base)",
              cursor: "pointer",
              textAlign: "left",
              color: it.danger ? "var(--error)" : "var(--on-surface)",
              font: "var(--font-body-s)",
            }}
            onClick={() => handleMoreClick(t, it.key)}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        )
      )}
    </div>
  );

  const running = tasks.filter((t) => t.status === "running").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  return (
    <div className="sy-page">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ position: "fixed", top: 56, right: 16, zIndex: 200, maxWidth: 360 }}
        />
      ) : null}
      <div className="page-head">
        <div>
          <h2>数据同步</h2>
          <p>
            共 {tasks.length} 个同步任务 · 运行中 {running} 个{failed > 0 ? ` · 失败 ${failed} 个待处理` : ""}
          </p>
        </div>
        <div className="page-head-actions">
          <Button
            text="同步全部"
            leftIcon={<Icon name="play" size={14} />}
            onClick={() => {
              setTasks((prev) => prev.map((t) => (t.status === "queued" ? { ...t, status: "running" } : t)));
              notify("success", "已启动全部排队任务");
            }}
          />
          <Button status="primary" text="新建同步任务" leftIcon={<Icon name="plus" size={14} />} onClick={() => notify("default", "演示：任务编排器即将上线")} />
        </div>
      </div>

      <div className="sy-layout">
        <SectionCard icon="refresh-cw" title="任务列表" subtitle="运行中的任务将实时推进进度">
          <div className="sy-toolbar">
            <TextField
              value={kw}
              onChange={(value) => setKw(value)}
              leftIcon={<Icon name="search" size={14} />}
              placeholder="搜索任务名称"
              style={{ width: 240 }}
            />
            <Select
              style={{ width: 150 }}
              value={src}
              onChange={(value) => setSrc(value)}
              options={[{ value: "all", text: "全部来源" }, ...sourceOptions.map((v) => ({ value: v, text: v }))]}
            />
            <SelectCard
              value={seg}
              onChange={(v) => setSeg(v)}
              data={[
                { text: "全部", value: "all" },
                { text: "运行中", value: "running" },
                { text: "失败", value: "failed" },
              ]}
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
                <Progress percent={t.progress} size="small" status={t.status === "failed" ? "error" : t.status === "done" ? "success" : "normal"} />
                <div className="sy-task-foot">
                  <span>同步量 {t.records}</span>
                  <span>耗时/延迟 {t.latency}</span>
                  <div className="sy-task-actions">
                    {t.status === "running" ? (
                      <Button
                        size="small"
                        text="暂停"
                        leftIcon={<Icon name="pause" size={13} />}
                        onClick={() => {
                          setStatus(t.id, "queued");
                          notify("default", `「${t.name}」已暂停`);
                        }}
                      />
                    ) : (
                      <Button
                        size="small"
                        text={t.status === "failed" ? "重试" : t.status === "done" ? "重新运行" : "启动"}
                        leftIcon={<Icon name="play" size={13} />}
                        onClick={() => {
                          setStatus(t.id, "running", t.status === "done");
                          notify("success", `「${t.name}」已启动`);
                        }}
                      />
                    )}
                    <TipBox content={moreMenuContent(t)} trigger="click" direction="bottomRight" isMouseLeaveClose={false}>
                      <Button size="small" leftIcon={<Icon name="ellipsis" size={14} />} />
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

      <MessageDialog
        type={confirm?.danger ? "risk" : "confirm"}
        isOpen={!!confirm}
        iconLocation="title"
        content={confirm?.content}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setConfirm(null) },
          ok: {
            text: confirm?.okText || "确定",
            focused: true,
            onClick: () => {
              confirm?.onOk?.();
              setConfirm(null);
            },
          },
        }}
      />
    </div>
  );
}
