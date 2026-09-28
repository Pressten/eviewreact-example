import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Table from "@nce/eview-react/Table";
import TipBox from "@nce/eview-react/TipBox";
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
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const filteredRows = useMemo(() => {
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

  const findFull = (row) => {
    const r = row?.rawData;
    return filteredRows.find((d) => d.id === r?.id) || r;
  };

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
        const full = findFull(row);
        return (
          <Button
            status="text"
            className="strategy-table__link"
            text={full ? displayName(full, lang) : cell}
            onClick={() => onEdit(full)}
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
        <StatusTag labelId={statusMeta[cell]?.labelId} tone={statusMeta[cell]?.tone} />
      ),
    },
    {
      title: t("table.col.owner"),
      key: "owner",
      width: 104,
      render: (cell, _rowData, _options, row) => {
        const full = findFull(row);
        return full ? displayOwner(full, lang) : cell;
      },
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
        const full = findFull(row);
        if (!full) return null;
        return (
          <div className="strategy-table__ops">
            <TipBox content={t("table.action.edit")} direction="top">
              <Button
                status="text"
                size="small"
                leftIcon={<Icon name="pencil" size={13} />}
                className="strategy-table__icon-btn"
                onClick={() => onEdit(full)}
              />
            </TipBox>
            <TipBox content={t("table.action.copy")} direction="top">
              <Button
                status="text"
                size="small"
                leftIcon={<Icon name="copy" size={13} />}
                className="strategy-table__icon-btn"
                onClick={() => notify("success", t("toast.copied"))}
              />
            </TipBox>
            <TipBox
              content={full.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}
              direction="top"
            >
              <Button
                status="text"
                size="small"
                leftIcon={<Icon name={full.status === "enabled" ? "pause" : "play"} size={13} />}
                className="strategy-table__icon-btn"
                onClick={() =>
                  notify(
                    "success",
                    full.status === "enabled"
                      ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                      : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                  )
                }
              />
            </TipBox>
            <TipBox content={t("table.action.delete")} direction="top">
              <Button
                status="text"
                size="small"
                leftIcon={<Icon name="trash-2" size={13} />}
                className="strategy-table__icon-btn"
                onClick={() => notify("success", t("toast.deleted"))}
              />
            </TipBox>
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

  const expandRow = (row) => {
    const full = findFull(row);
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
        <div className="strategy-table__filter">
          {[
            { label: t("table.filter.all"), value: "all" },
            { label: t("table.filter.enabled"), value: "enabled" },
            { label: t("table.filter.disabled"), value: "disabled" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`strategy-table__filter-btn ${view === opt.value ? "active" : ""}`}
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
        <SearchInput
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(v) => setKeyword(v)}
          onSearch={() => {}}
          onClear={() => setKeyword("")}
        />
        <span className="strategy-table__count">
          {checkedIndexes.length
            ? intl.formatMessage({ id: "table.selected" }, { count: checkedIndexes.length })
            : `${filteredRows.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            text={t("table.batch.enable")}
            disabled={!checkedIndexes.length}
            onClick={() => batch("enable")}
          />
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            text={t("table.batch.disable")}
            disabled={!checkedIndexes.length}
            onClick={() => batch("disable")}
          />
          <TipBox content={t("table.refresh")} direction="top">
            <Button
              status="text"
              leftIcon={<Icon name="refresh-cw" size={14} />}
              className="strategy-table__icon-btn"
              onClick={() => notify("success", t("table.refresh"))}
            />
          </TipBox>
        </div>
      </div>

      <Table
        columns={columns}
        dataset={filteredRows}
        emptyTableMsg={t("table.empty")}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[8, 16, 24]}
        enableRowExpand
        onRowExpend={expandRow}
      />
    </section>
  );
}
