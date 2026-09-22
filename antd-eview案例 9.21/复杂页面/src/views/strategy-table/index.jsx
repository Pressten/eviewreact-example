import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
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

// Layer 4: 策略清单表格 — SelectCard 视图筛选 + 搜索 + 行选择批量操作
// Table: dataSource→dataset / rowKey→keyIndex / columns[].dataIndex→key
// 命令式 toast → 渲染 <DivMessage display type="success">
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => setToast({ key: Date.now(), msg, type });

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
      render: (_, row) => (
        <Button status="text" className="strategy-table__link" onClick={() => onEdit(row)}>
          {displayName(row, lang)}
        </Button>
      ),
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
      render: (_, row) => displayOwner(row, lang),
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
      render: (_, row) => (
        <div className="strategy-table__ops">
          <TipBox content={t("table.action.edit")}>
            <Button
              leftIcon={<Icon name="pencil" size={13} />}
              onClick={() => onEdit(row)}
            />
          </TipBox>
          <TipBox content={t("table.action.copy")}>
            <Button
              leftIcon={<Icon name="copy" size={13} />}
              onClick={() => showToast(t("toast.copied"))}
            />
          </TipBox>
          <TipBox content={row.status === "enabled" ? t("table.action.disable") : t("table.action.enable")}>
            <Button
              leftIcon={<Icon name={row.status === "enabled" ? "pause" : "play"} size={13} />}
              onClick={() =>
                showToast(
                  row.status === "enabled"
                    ? intl.formatMessage({ id: "toast.disabled" }, { count: 1 })
                    : intl.formatMessage({ id: "toast.enabled" }, { count: 1 })
                )
              }
            />
          </TipBox>
          <TipBox content={t("table.action.delete")}>
            <Button
              status="risk"
              leftIcon={<Icon name="trash-2" size={13} />}
              onClick={() => showToast(t("toast.deleted"))}
            />
          </TipBox>
        </div>
      ),
    },
  ];

  const batch = (action) => {
    if (!selectedRowKeys.length) {
      showToast(t("toast.selectFirst"), "warn");
      return;
    }
    showToast(
      intl.formatMessage(
        { id: action === "enable" ? "toast.enabled" : "toast.disabled" },
        { count: selectedRowKeys.length }
      )
    );
    setSelectedRowKeys([]);
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
          data={[
            { text: t("table.filter.all"), value: "all" },
            { text: t("table.filter.enabled"), value: "enabled" },
            { text: t("table.filter.disabled"), value: "disabled" },
          ]}
          onChange={(v) => setView(v)}
        />
      </header>

      <div className="strategy-table__toolbar">
        <TextField
          className="strategy-table__search"
          placeholder={t("table.search.ph")}
          value={keyword}
          onChange={(v) => setKeyword(v)}
        />
        <span className="strategy-table__count">
          {selectedRowKeys.length
            ? intl.formatMessage({ id: "table.selected" }, { count: selectedRowKeys.length })
            : `${dataset.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("enable")}
          >
            {t("table.batch.enable")}
          </Button>
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            disabled={!selectedRowKeys.length}
            onClick={() => batch("disable")}
          >
            {t("table.batch.disable")}
          </Button>
          <TipBox content={t("table.refresh")}>
            <Button
              leftIcon={<Icon name="refresh-cw" size={14} />}
              onClick={() => showToast(t("table.refresh"))}
            />
          </TipBox>
        </div>
      </div>

      <Table
        keyIndex="id"
        columns={columns}
        dataset={dataset}
        scroll={{ x: 1290 }}
        emptyTableMsg={
          <div className="strategy-table__empty">
            <Icon name="file-text" size={24} />
            <strong>{t("table.empty")}</strong>
            <span>{t("table.emptyHint")}</span>
          </div>
        }
        enableCheckBox
        onRowCheck={(keys) => setSelectedRowKeys(keys)}
        enablePagination
        pagingProps={{
          defaultPageSize: 8,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: [8, 16, 24],
        }}
        expandable={{
          expandedRowRender: (row) => (
            <div className="strategy-table__expand">
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.threshold")}</span>
                <span className="strategy-table__expand-v">{row.threshold}%</span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.retry")}</span>
                <span className="strategy-table__expand-v">
                  {row.retry} {t("form.retry.unit")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.notify")}</span>
                <span className="strategy-table__expand-v">
                  {row.notify
                    .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                    .join(" / ")}
                </span>
              </div>
              <div className="strategy-table__expand-item">
                <span className="strategy-table__expand-k">{t("table.expand.flap")}</span>
                <span className="strategy-table__expand-v">
                  {row.flap ? t("table.expand.on") : t("table.expand.off")}
                </span>
              </div>
            </div>
          ),
        }}
      />

      {toast ? (
        <DivMessage key={toast.key} display type={toast.type}>
          {toast.msg}
        </DivMessage>
      ) : null}
    </section>
  );
}
