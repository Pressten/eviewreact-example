import { useMemo, useState, useRef } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import IconButton from "@nce/eview-react/IconButton";
import DivMessage from "@nce/eview-react/DivMessage";
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

export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [notice, setNotice] = useState(null);
  const tableRef = useRef(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const list = strategyRows.filter((row) => {
      const matchView =
        view === "all" ? true : view === "enabled" ? row.status === "enabled" : row.status !== "enabled";
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
    return list;
  }, [view, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === "enabled").length;

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
        if (!r) return null;
        return (
          <Button status="text" text={displayName(r, lang)} onClick={() => onEdit(r)} />
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
      allowSort: false,
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
      allowSort: false,
      render: (value) => (
        <StatusTag labelId={statusMeta[value].labelId} tone={statusMeta[value].tone} />
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
      render: (value) => <span className="strategy-table__time">{value}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      allowSort: false,
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
              onClick={() => notify("success", t("toast.copied"))}
            />
            <IconButton
              iconName={<Icon name={isEnabled ? "pause" : "play"} size={13} />}
              tipText={isEnabled ? t("table.action.disable") : t("table.action.enable")}
              size="small"
              onClick={() =>
                notify(
                  "success",
                  intl.formatMessage(
                    { id: isEnabled ? "toast.disabled" : "toast.enabled" },
                    { count: 1 }
                  )
                )
              }
            />
            <IconButton
              iconName={<Icon name="trash-2" size={13} />}
              tipText={t("table.action.delete")}
              size="small"
              onClick={() => notify("success", t("toast.deleted"))}
            />
          </div>
        );
      },
    },
  ];

  const batch = (action) => {
    if (!selectedIndexes.length) {
      notify("warn", t("toast.selectFirst"));
      return;
    }
    notify(
      "success",
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: selectedIndexes.length }
      )
    );
    setSelectedIndexes([]);
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
            { value: "all", text: t("table.filter.all") },
            { value: "enabled", text: t("table.filter.enabled") },
            { value: "disabled", text: t("table.filter.disabled") },
          ]}
          value={view}
          onChange={(v) => {
            setView(v);
            setSelectedIndexes([]);
          }}
        />
      </header>

      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          enableDisposeTimeOut={notice.type !== "error"}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <div className="strategy-table__toolbar">
        <SearchInput
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(v) => {
            setKeyword(v);
            setSelectedIndexes([]);
          }}
          onClear={() => {
            setKeyword("");
            setSelectedIndexes([]);
          }}
          inputStyle={{ width: 260 }}
        />
        <span className="strategy-table__count">
          {selectedIndexes.length
            ? intl.formatMessage({ id: "table.selected" }, { count: selectedIndexes.length })
            : `${dataSource.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            text={t("table.batch.enable")}
            leftIcon={<Icon name="play" size={14} />}
            disabled={!selectedIndexes.length}
            onClick={() => batch("enable")}
          />
          <Button
            text={t("table.batch.disable")}
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!selectedIndexes.length}
            onClick={() => batch("disable")}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t("table.refresh")}
            onClick={() => notify("success", t("table.refresh"))}
          />
        </div>
      </div>

      <Table
        ref={tableRef}
        columns={columns}
        dataset={dataSource}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedIndexes}
        onRowCheck={(_row, checkedRows) => setSelectedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
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
