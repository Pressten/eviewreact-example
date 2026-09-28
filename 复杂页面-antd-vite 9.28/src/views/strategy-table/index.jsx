import { useMemo, useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import { useIntl } from "react-intl";
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

// Layer 4: 策略清单表格 — SelectCard 视图筛选 + 搜索 + 行勾选批量操作
// Table 用 onRowCheck 回传行序号数组 checkedRows（不是 rowKey），需整行数据时
// 用 tableRef.current.getCheckedRowsData()。

export default function StrategyTable({ onEdit, onNotify }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const tableRef = useRef(null);

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
      render: (cell) => <span className="strategy-table__code">{cell}</span>,
    },
    {
      title: t("table.col.name"),
      key: "name",
      width: 208,
      render: (cell, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <Button
            status="text"
            className="strategy-table__link"
            text={displayName(r, lang)}
            onClick={() => onEdit(r)}
          />
        );
      },
    },
    {
      title: t("table.col.deviceType"),
      key: "deviceType",
      width: 148,
      render: (cell) => (
        <span className="strategy-table__type">
          {labelOf(deviceTypeOptions, cell, optionDict)}
        </span>
      ),
    },
    {
      title: t("table.col.interval"),
      key: "intervalSec",
      width: 110,
      align: "right",
      render: (cell) => `${cell} ${t("table.unit.second")}`,
    },
    {
      title: t("table.col.level"),
      key: "level",
      width: 108,
      render: (cell) => <StatusTag labelId={`opt.level.${cell}`} tone={levelTone[cell]} />,
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
      render: (cell) => (
        <StatusTag labelId={statusMeta[cell].labelId} tone={statusMeta[cell].tone} />
      ),
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (_cell, _rowData, _options, row) => displayOwner(row?.rawData, lang),
    },
    {
      title: t("table.col.updatedAt"),
      key: "updatedAt",
      width: 152,
      render: (cell) => <span className="strategy-table__time">{cell}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      render: (_cell, _rowData, _options, row) => {
        const r = row?.rawData;
        if (!r) return null;
        const isEnabled = r.status === "enabled";
        return (
          <div className="strategy-table__ops">
            <IconButton
              iconName={<Icon name="pencil" size={13} />}
              tipText={t("table.action.edit")}
              size="small"
              onClick={() => onEdit(r)}
            />
            <IconButton
              iconName={<Icon name="copy" size={13} />}
              tipText={t("table.action.copy")}
              size="small"
              onClick={() => onNotify?.("success", t("toast.copied"))}
            />
            <IconButton
              iconName={<Icon name={isEnabled ? "pause" : "play"} size={13} />}
              tipText={isEnabled ? t("table.action.disable") : t("table.action.enable")}
              size="small"
              onClick={() =>
                onNotify?.(
                  "success",
                  isEnabled
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                )
              }
            />
            <IconButton
              iconName={<Icon name="trash-2" size={13} />}
              tipText={t("table.action.delete")}
              size="small"
              onClick={() => onNotify?.("success", t("toast.deleted"))}
            />
          </div>
        );
      },
    },
  ];

  const batch = (action) => {
    if (!checkedIndexes.length) {
      onNotify?.("warn", t("toast.selectFirst"));
      return;
    }
    onNotify?.(
      "success",
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: checkedIndexes.length }
      )
    );
    setCheckedIndexes([]);
    tableRef.current?.setCheckedRows?.([]);
  };

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
        <SelectCard
          type="small"
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
          value={view}
          onChange={(value) => setView(value)}
        />
      </header>

      <div className="strategy-table__toolbar">
        <SearchInput
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onClear={() => setKeyword("")}
        />
        <span className="strategy-table__count">
          {checkedIndexes.length
            ? intl.formatMessage({ id: "table.selected" }, { count: checkedIndexes.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            text={t("table.batch.enable")}
            leftIcon={<Icon name="play" size={14} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("enable")}
          />
          <Button
            text={t("table.batch.disable")}
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!checkedIndexes.length}
            onClick={() => batch("disable")}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t("table.refresh")}
            onClick={() => onNotify?.("success", t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        ref={tableRef}
        columns={columns}
        dataset={dataSource}
        emptyTableMsg={t("table.empty")}
        showEmptyImage
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[8, 16, 24]}
        enableRowExpand
        onRowExpend={(row) => {
          const r = row?.rawData;
          if (!r) return null;
          return (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{r.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {r.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {r.notify
                    .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {r.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}
