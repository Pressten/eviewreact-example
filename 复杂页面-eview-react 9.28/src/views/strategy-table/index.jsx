import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import IconButton from "@nce/eview-react/IconButton";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  deviceTypeOptions,
  levelOptions,
  levelTone,
  notifyOptions,
  statusMeta,
  strategyRows,
  displayName,
  displayOwner,
  labelOf,
} from "../../mock/strategy.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 策略清单表格 — Segmented 视图筛选（手写）+ 搜索 + 行勾选批量操作
// Table 迁移：dataSource→dataset；dataIndex→key；rowSelection→enableCheckBox+onRowCheck；
//   pagination→enablePagination+enableAutoPaging+pagingProps；expandable→enableRowExpand+onRowExpend；
//   locale.emptyText→emptyTableMsg；render 第 4 参 row.rawData 才是行数据
// Segmented 无对应，手写 app-segmented（div + button + CSS 变量）
// message.success → DivMessage
// Tooltip + 纯图标 Button → IconButton tipText
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [notice, setNotice] = useState(null);
  const tableRef = useRef(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return strategyRows.filter((row) => {
      const matchView =
        view === "all" ? true : view === "enabled" ? row.status === "enabled" : row.status !== "enabled";
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
  }, [view, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === "enabled").length;

  // 选项集统一译一次，表格单元格内复用
  const optionDict = {};
  deviceTypeOptions.concat(levelOptions, notifyOptions).forEach((o) => {
    optionDict[o.labelId] = intl.formatMessage({ id: o.labelId, defaultMessage: o.labelId });
  });

  const translator = (id) => intl.formatMessage({ id, defaultMessage: id });

  const columns = [
    {
      title: t("table.col.id"),
      key: "id",
      width: 132,
      render: (value) => <span className="strategy-table__code">{value}</span>,
    },
    {
      title: t("table.col.name"),
      key: "name",
      width: 208,
      render: (_cell, _rowData, _options, row) => {
        const r = row?.rawData;
        const full = dataSource.find((d) => d.id === r?.id) || r;
        return (
          <Button
            status="text"
            className="strategy-table__link"
            onClick={() => onEdit(full)}
            text={displayName(full, lang)}
          />
        );
      },
    },
    {
      title: t("table.col.deviceType"),
      key: "deviceType",
      width: 148,
      render: (value) => (
        <span className="strategy-table__type">
          {labelOf(deviceTypeOptions, value, optionDict)}
        </span>
      ),
    },
    {
      title: t("table.col.interval"),
      key: "intervalSec",
      width: 110,
      align: "right",
      render: (value) => `${value} ${t("table.unit.second")}`,
    },
    {
      title: t("table.col.level"),
      key: "level",
      width: 108,
      render: (value) => <StatusTag labelId={`opt.level.${value}`} tone={levelTone[value]} />,
    },
    {
      title: t("table.col.devices"),
      key: "devices",
      width: 100,
      align: "right",
    },
    {
      title: t("table.col.status"),
      key: "status",
      width: 110,
      render: (value) => (
        <StatusTag labelId={statusMeta[value].labelId} tone={statusMeta[value].tone} />
      ),
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (_cell, _rowData, _options, row) => {
        const r = row?.rawData;
        const full = dataSource.find((d) => d.id === r?.id) || r;
        return displayOwner(full, lang);
      },
    },
    {
      title: t("table.col.updatedAt"),
      key: "updatedAt",
      width: 152,
      render: (value) => <span className="strategy-table__time">{value}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      render: (_cell, _rowData, _options, row) => {
        const r = row?.rawData;
        const full = dataSource.find((d) => d.id === r?.id) || r;
        return (
          <div className="strategy-table__ops">
            <IconButton
              iconName={<Icon name="pencil" size={13} />}
              tipText={t("table.action.edit")}
              tipData={{ direction: "top" }}
              onClick={() => onEdit(full)}
            />
            <IconButton
              iconName={<Icon name="copy" size={13} />}
              tipText={t("table.action.copy")}
              tipData={{ direction: "top" }}
              onClick={() => notify("success", t("toast.copied"))}
            />
            <IconButton
              iconName={
                <Icon name={full?.status === "enabled" ? "pause" : "play"} size={13} />
              }
              tipText={
                full?.status === "enabled"
                  ? t("table.action.disable")
                  : t("table.action.enable")
              }
              tipData={{ direction: "top" }}
              onClick={() =>
                notify(
                  "success",
                  full?.status === "enabled"
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                )
              }
            />
            <IconButton
              iconName={<Icon name="trash-2" size={13} />}
              tipText={t("table.action.delete")}
              tipData={{ direction: "top" }}
              onClick={() => notify("success", t("toast.deleted"))}
            />
          </div>
        );
      },
    },
  ];

  const batch = (action) => {
    if (!checkedIndexes.length) {
      notify("warn", t("toast.selectFirst"));
      return;
    }
    notify(
      "success",
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: checkedIndexes.length }
      )
    );
    setCheckedIndexes([]);
  };

  const viewOptions = [
    { label: t("table.filter.all"), value: "all" },
    { label: t("table.filter.enabled"), value: "enabled" },
    { label: t("table.filter.disabled"), value: "disabled" },
  ];

  return (
    <section className="panel-card strategy-table">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="list-checks" size={16} />
            {t("table.title")}
          </h2>
          <p className="panel-card__desc">
            {intl.formatMessage(
              { id: "table.desc" },
              { total: strategyRows.length, enabled: enabledCount }
            )}
          </p>
        </div>
        {/* Segmented 无对应，手写 app-segmented */}
        <div className="app-segmented">
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`app-segmented-item${view === opt.value ? " active" : ""}`}
              onClick={() => setView(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <div className="strategy-table__toolbar">
        <TextField
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(value) => setKeyword(value)}
        />
        <span className="strategy-table__count">
          {checkedIndexes.length
            ? intl.formatMessage({ id: "table.selected" }, { count: checkedIndexes.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("enable")}
            text={t("table.batch.enable")}
          />
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("disable")}
            text={t("table.batch.disable")}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t("table.refresh")}
            tipData={{ direction: "top" }}
            onClick={() => notify("success", t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        ref={tableRef}
        columns={columns}
        dataset={dataSource.map((d) => ({
          id: d.id,
          name: d.name,
          deviceType: d.deviceType,
          intervalSec: d.intervalSec,
          level: d.level,
          devices: d.devices,
          status: d.status,
          owner: d.owner,
          updatedAt: d.updatedAt,
          actions: null,
        }))}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{
          pageSize: 8,
          pageSizeOptions: [8, 16, 24],
        }}
        enableRowExpand
        onRowExpend={(row) => {
          const r = row?.rawData;
          const full = dataSource.find((d) => d.id === r?.id) || r;
          if (!full) return null;
          return (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{full.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {full.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {full.notify
                    .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {full.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}
