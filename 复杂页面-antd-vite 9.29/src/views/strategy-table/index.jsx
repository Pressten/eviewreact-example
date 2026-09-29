import { useMemo, useState, useRef } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
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
  const tableRef = useRef(null);

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const dataset = useMemo(() => {
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
      render: (cellValue) => <span className="strategy-table__code">{cellValue}</span>,
    },
    {
      title: t("table.col.name"),
      key: "name",
      width: 208,
      render: (cellValue, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <Button status="text" className="strategy-table__link" text={displayName(r, lang)} onClick={() => onEdit(r)} />
        );
      },
    },
    {
      title: t("table.col.deviceType"),
      key: "deviceType",
      width: 148,
      render: (cellValue) => (
        <span className="strategy-table__type">
          {labelOf(deviceTypeOptions, cellValue, optionDict)}
        </span>
      ),
    },
    {
      title: t("table.col.interval"),
      key: "intervalSec",
      width: 110,
      align: "right",
      render: (cellValue) => `${cellValue} ${t("table.unit.second")}`,
    },
    {
      title: t("table.col.level"),
      key: "level",
      width: 108,
      render: (cellValue) => <StatusTag labelId={`opt.level.${cellValue}`} tone={levelTone[cellValue]} />,
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
      render: (cellValue) => (
        <StatusTag labelId={statusMeta[cellValue].labelId} tone={statusMeta[cellValue].tone} />
      ),
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (_cellValue, _rowData, _options, row) => displayOwner(row?.rawData, lang),
    },
    {
      title: t("table.col.updatedAt"),
      key: "updatedAt",
      width: 152,
      render: (cellValue) => <span className="strategy-table__time">{cellValue}</span>,
    },
    {
      title: t("table.col.actions"),
      key: "actions",
      width: 176,
      align: "center",
      allowSort: false,
      render: (_cellValue, _rowData, _options, row) => {
        const r = row?.rawData;
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
              iconName={<Icon name={r?.status === "enabled" ? "pause" : "play"} size={13} />}
              tipText={r?.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
              size="small"
              onClick={() =>
                notify(
                  "success",
                  r?.status === "enabled"
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
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
    if (!selectedRows.length) {
      notify("warn", t("toast.selectFirst"));
      return;
    }
    notify(
      "success",
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: selectedRows.length }
      )
    );
    setSelectedRows([]);
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
          value={view}
          onChange={(value) => setView(value)}
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
        />
      </header>

      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
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
          {selectedRows.length
            ? intl.formatMessage({ id: "table.selected" }, { count: selectedRows.length })
            : `${dataset.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            text={t("table.batch.enable")}
            leftIcon={<Icon name="play" size={14} />}
            disabled={!selectedRows.length}
            onClick={() => batch("enable")}
          />
          <Button
            text={t("table.batch.disable")}
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!selectedRows.length}
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
        dataset={dataset}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRows}
        onRowCheck={(row, checkedRows) => setSelectedRows(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRows(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[8, 16, 24]}
        emptyTableMsg={t("table.empty")}
        enableRowExpand
        onRowExpend={(row) => {
          const r = row?.rawData;
          return (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{r?.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {r?.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {r?.notify
                    ?.map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {r?.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}
