import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Table, Tabs, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import DelayMinutes from "../../components/delay-minutes/index.jsx";
import HoverCard from "./hover-card.jsx";
import { CITY_NAMES, fmt, getTimePair, plusDays } from "../../mock/flight.js";
import { OPS_MOMENT_MIN, useApp, useOpsTick } from "../../context.jsx";
import "./index.css";

// 关舱门倒计时 —— 出港未起飞航班显示距关舱门的剩余时间, <15 分钟橙色强调
function DoorCountdown({ record, tick }) {
  if (record.dir !== "dep" || record.status === "cancelled" || record.status === "delayed") {
    return <span className="cd cd-na">—</span>;
  }
  const doorClose = record.schedDep - 15; // 关舱门 = 计划起飞前 15 分钟
  const awayMin = doorClose - OPS_MOMENT_MIN;
  if (awayMin > 60) return <span className="cd cd-na">—</span>;
  const secondsLeft = awayMin * 60 - tick;
  if (secondsLeft <= 0) return <span className="cd cd-closed">已关闭</span>;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  return <span className={`cd${secondsLeft < 900 ? " cd-soon" : ""}`}>{mm}:{ss}</span>;
}

// 区块② 航班动态主表格 —— 页签/搜索联动 · 计数同步 · 行选中联动波及链
export default function FlightTable() {
  const { dataset, selectedFlightId, setSelectedFlightId, locateRequest } = useApp();
  const [tab, setTab] = useState("all");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hover, setHover] = useState(null); // { flight, x, y } —— 延迟 220ms 弹出, 减少遮挡
  const hoverTimer = useRef(null);
  const tick = useOpsTick();

  // 搜索: 航班号 / 机场代码 / 航段城市名
  const searched = useMemo(() => {
    const kw = search.trim();
    if (!kw) return dataset;
    const up = kw.toUpperCase();
    return dataset.filter((r) =>
      `${r.flightNo} ${r.from} ${r.to} ${CITY_NAMES[r.from] || ""} ${CITY_NAMES[r.to] || ""}`.toUpperCase().includes(up)
    );
  }, [dataset, search]);

  // 页签计数与搜索联动同步
  const counts = useMemo(
    () => ({
      all: searched.length,
      dep: searched.filter((r) => r.dir === "dep").length,
      arr: searched.filter((r) => r.dir === "arr").length,
      delayed: searched.filter((r) => r.status === "delayed").length,
      cancelled: searched.filter((r) => r.status === "cancelled").length,
    }),
    [searched]
  );

  const rows = useMemo(() => {
    switch (tab) {
      case "dep": return searched.filter((r) => r.dir === "dep");
      case "arr": return searched.filter((r) => r.dir === "arr");
      case "delayed": return searched.filter((r) => r.status === "delayed");
      case "cancelled": return searched.filter((r) => r.status === "cancelled");
      default: return searched;
    }
  }, [searched, tab]);

  // 波及链节点 → 主表行定位: 目标不在当前页签/搜索视图时自动复位筛选, 翻页 + 滚动 + 闪烁高亮
  useEffect(() => {
    if (!locateRequest) return;
    const target = dataset.find((r) => r.id === locateRequest.id);
    if (!target) return;
    let list = rows;
    if (!list.some((r) => r.id === target.id)) {
      setTab("all");
      setInput("");
      setSearch("");
      setPage(1);
      list = dataset;
    }
    const idx = list.findIndex((r) => r.id === target.id);
    if (idx < 0) return;
    const targetPage = Math.floor(idx / pageSize) + 1;
    if (targetPage !== page) setPage(targetPage);
    const timer = setTimeout(() => {
      const el = document.querySelector(`.flight-table .ant-table-row[data-row-key="${target.id}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.classList.add("row-flash");
        setTimeout(() => el.classList.remove("row-flash"), 2500);
      }
    }, 80);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateRequest]);

  const lateTimeClass = (d) => (d > 60 ? " tp-high" : d > 30 ? " tp-mid" : "");

  const columns = [
    {
      title: "航班号", dataIndex: "flightNo", key: "flightNo", width: 104, fixed: "left",
      render: (v, r) => (
        <a className="flight-link" onClick={(e) => { e.stopPropagation(); setSelectedFlightId(r.id); }} title="点击查看延误波及链">{v}</a>
      ),
    },
    {
      title: "注册号", dataIndex: "tailNo", width: 88,
      render: (v) => <span className="cell-mono">{v}</span>,
    },
    {
      title: "航段", key: "route", width: 140,
      render: (v, r) => (
        <span className="cell-mono route-cell" title={`${CITY_NAMES[r.from] || r.from} → ${CITY_NAMES[r.to] || r.to}`}>
          {r.from}
          <Icon name="arrow-right" size="0.75rem" />
          {r.to}
        </span>
      ),
    },
    { title: "机型", dataIndex: "acType", width: 92 },
    {
      title: "计划起降", key: "sched", width: 146,
      render: (v, r) => (
        <span className="cell-mono time-cell">
          {fmt(r.schedDep)}{plusDays(r.schedDep) > 0 ? <sup>+1</sup> : null}
          <Icon name="arrow-right" size="0.75rem" />
          {fmt(r.schedArr)}{plusDays(r.schedArr) > 0 ? <sup>+1</sup> : null}
        </span>
      ),
    },
    {
      title: "预计 / 实际起降", key: "est", width: 178,
      render: (v, r) => {
        const pair = getTimePair(r);
        if (!pair) return <span className="cell-dim">已取消</span>;
        return (
          <span className="cell-mono time-cell">
            <span className={`tp-flag${pair.dep.act ? " tp-act" : ""}`}>{pair.dep.act ? "实" : "预"}</span>
            <span className={`tp-time${pair.dep.late ? lateTimeClass(pair.dep.late) : ""}`}>
              {fmt(pair.dep.t)}{plusDays(pair.dep.t) > 0 ? <sup>+1</sup> : null}
            </span>
            <Icon name="arrow-right" size="0.75rem" />
            {pair.arr.alt ? (
              <span className="tp-alt">{pair.arr.alt} {fmt(pair.arr.t)}</span>
            ) : (
              <>
                <span className={`tp-flag${pair.arr.act ? " tp-act" : ""}`}>{pair.arr.act ? "实" : "预"}</span>
                <span className={`tp-time${pair.arr.late ? lateTimeClass(pair.arr.late) : ""}`}>
                  {fmt(pair.arr.t)}{plusDays(pair.arr.t) > 0 ? <sup>+1</sup> : null}
                </span>
              </>
            )}
          </span>
        );
      },
    },
    {
      title: "登机口", dataIndex: "gate", width: 72,
      render: (v, r) => (r.status === "cancelled" ? <span className="cell-dim">—</span> : <span className="cell-mono">{v}</span>),
    },
    {
      title: "状态", dataIndex: "status", width: 104,
      render: (v) => <StatusTag status={v} />,
    },
    {
      title: "延误(分)", dataIndex: "delayMinutes", width: 84, align: "right",
      render: (v) => <DelayMinutes value={v} />,
    },
    {
      title: "旅客", dataIndex: "paxCount", width: 68, align: "right",
      render: (v) => <span className="cell-mono">{v}</span>,
    },
    {
      title: "关舱门", key: "door", width: 92, align: "right",
      render: (v, r) => <DoorCountdown record={r} tick={tick} />,
    },
  ];

  const tabLabel = (text, count, cls) => (
    <span className="tab-label">
      {text}
      <b className={`tab-count${cls ? ` ${cls}` : ""}`}>{count}</b>
    </span>
  );

  const handleRefresh = () => {
    message.success(`已刷新 ${dataset.length} 班航班动态`);
  };

  return (
    <section className="flight-table">
      <div className="ft-toolbar">
        <Tabs
          activeKey={tab}
          onChange={(key) => { setTab(key); setPage(1); }}
          items={[
            { key: "all", label: tabLabel("全部", counts.all) },
            { key: "dep", label: tabLabel("出港", counts.dep) },
            { key: "arr", label: tabLabel("进港", counts.arr) },
            { key: "delayed", label: tabLabel("延误", counts.delayed, "tab-warn") },
            { key: "cancelled", label: tabLabel("取消", counts.cancelled, "tab-err") },
          ]}
        />
        <div className="ft-toolbar-right">
          <Input
            size="small"
            className="ft-search"
            allowClear
            value={input}
            placeholder="搜索航班号 / 航段，如 HY1521 或 上海"
            onChange={(e) => { setInput(e.target.value); setSearch(e.target.value); setPage(1); }}
            onPressEnter={() => { setSearch(input); setPage(1); }}
            suffix={<Icon name="search" size="0.875rem" />}
          />
          <Button size="small" icon={<Icon name="rotate-cw" size="0.875rem" />} onClick={handleRefresh}>
            刷新
          </Button>
        </div>
      </div>

      <Table
        className="ft-table"
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={rows}
        rowClassName={(r) => `flight-row st-${r.status}${r.id === selectedFlightId ? " row-selected" : ""}`}
        onRow={(record) => ({
          onClick: () => setSelectedFlightId(record.id),
          onMouseEnter: (e) => {
            const x = e.clientX;
            const y = e.clientY;
            clearTimeout(hoverTimer.current);
            hoverTimer.current = setTimeout(() => setHover({ flight: record, x, y }), 220);
          },
          onMouseLeave: () => {
            clearTimeout(hoverTimer.current);
            setHover(null);
          },
        })}
        scroll={{ x: 1168, y: "31rem" }}
        pagination={{
          current: page,
          pageSize,
          total: rows.length,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          showTotal: (total, range) => `总记录数：${total}`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
      />

      {hover ? <HoverCard flight={hover.flight} x={hover.x} y={hover.y} /> : null}
    </section>
  );
}
