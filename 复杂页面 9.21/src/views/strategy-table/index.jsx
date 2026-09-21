import { useMemo, useState } from 'react';
import Table from '@nce/eview-react/Table';
import Button from '@nce/eview-react/Button';
import SelectCard from '@nce/eview-react/SelectCard';
import SearchInput from '@nce/eview-react/SearchInput';
import IconButton from '@nce/eview-react/IconButton';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useToast } from '../../shared/toast.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
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
} from '../../mock/strategy.js';
import { useApp } from '../../context.jsx';
import './index.css';

// Layer 4: 策略清单表格 — SelectCard 视图筛选 + 搜索 + 行勾选批量操作 + 行展开
export default function StrategyTable({ onEdit }) {
  const { lang } = useApp();
  const intl = useIntl();
  const { notify } = useToast();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [view, setView] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const dataset = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return strategyRows.filter((row) => {
      const matchView =
        view === 'all' ? true : view === 'enabled' ? row.status === 'enabled' : row.status !== 'enabled';
      const matchKw =
        !kw ||
        row.id.toLowerCase().includes(kw) ||
        row.name.toLowerCase().includes(kw) ||
        row.nameEn.toLowerCase().includes(kw);
      return matchView && matchKw;
    });
  }, [view, keyword]);

  const enabledCount = strategyRows.filter((r) => r.status === 'enabled').length;

  // 选项集统一译一次，表格单元格内复用
  const optionDict = {};
  deviceTypeOptions.concat(levelOptions, notifyOptions).forEach((o) => {
    optionDict[o.labelId] = intl.formatMessage({ id: o.labelId, defaultMessage: o.labelId });
  });
  const translator = (id) => intl.formatMessage({ id, defaultMessage: id });

  const columns = [
    { title: t('table.col.id'), key: 'id', width: 132, render: (cell) => <span className="strategy-table__code">{cell}</span> },
    {
      title: t('table.col.name'),
      key: 'name',
      width: 208,
      render: (cell, row) => (
        <Button status="text" text={displayName(row, lang)} className="strategy-table__link" onClick={() => onEdit(row)} />
      ),
    },
    {
      title: t('table.col.deviceType'),
      key: 'deviceType',
      width: 148,
      render: (cell) => <span className="strategy-table__type">{labelOf(deviceTypeOptions, cell, optionDict)}</span>,
    },
    {
      title: t('table.col.interval'),
      key: 'intervalSec',
      width: 110,
      align: 'right',
      render: (cell) => `${cell} ${t('table.unit.second')}`,
    },
    {
      title: t('table.col.level'),
      key: 'level',
      width: 108,
      allowSort: false,
      render: (cell) => <StatusTag labelId={`opt.level.${cell}`} fallback={cell} tone={levelTone[cell]} />,
    },
    { title: t('table.col.devices'), key: 'devices', width: 100, align: 'right', render: (cell) => `${cell} ${t('table.unit.device')}` },
    {
      title: t('table.col.status'),
      key: 'status',
      width: 110,
      allowSort: false,
      render: (cell) => <StatusTag labelId={statusMeta[cell].labelId} fallback={cell} tone={statusMeta[cell].tone} />,
    },
    { title: t('table.col.owner'), key: 'owner', width: 104, render: (cell, row) => displayOwner(row, lang) },
    { title: t('table.col.updatedAt'), key: 'updatedAt', width: 152, render: (cell) => <span className="strategy-table__time">{cell}</span> },
    {
      title: t('table.col.actions'),
      key: 'op',
      width: 176,
      align: 'center',
      allowSort: false,
      render: (cell, row) => (
        <div className="strategy-table__ops">
          <IconButton
            iconName={<Icon name="pencil" size={13} />}
            tipText={t('table.action.edit')}
            onClick={() => onEdit(row)}
          />
          <IconButton
            iconName={<Icon name="copy" size={13} />}
            tipText={t('table.action.copy')}
            onClick={() => notify('success', t('toast.copied'))}
          />
          <IconButton
            iconName={<Icon name={row.status === 'enabled' ? 'pause' : 'play'} size={13} />}
            tipText={row.status === 'enabled' ? t('table.action.disable') : t('table.action.enable')}
            onClick={() =>
              notify(
                'success',
                row.status === 'enabled'
                  ? intl.formatMessage({ id: 'toast.disabled' }, { count: 1 })
                  : intl.formatMessage({ id: 'toast.enabled' }, { count: 1 }),
              )
            }
          />
          <IconButton
            iconName={<Icon name="trash-2" size={13} />}
            tipText={t('table.action.delete')}
            onClick={() => notify('success', t('toast.deleted'))}
          />
        </div>
      ),
    },
  ];

  const viewData = [
    { value: 'all', text: t('table.filter.all') },
    { value: 'enabled', text: t('table.filter.enabled') },
    { value: 'disabled', text: t('table.filter.disabled') },
  ];

  const batch = (action) => {
    if (!selectedIds.length) {
      notify('warn', t('toast.selectFirst'));
      return;
    }
    notify(
      'success',
      intl.formatMessage(
        { id: action === 'enable' ? 'toast.enabled' : 'toast.disabled' },
        { count: selectedIds.length },
      ),
    );
    setSelectedIds([]);
  };

  return (
    <section className="panel-card strategy-table">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="list-checks" size={16} />
            {t('table.title')}
          </h2>
          <p className="panel-card__desc">
            {intl.formatMessage({ id: 'table.desc' }, { total: strategyRows.length, enabled: enabledCount })}
          </p>
        </div>
        <SelectCard data={viewData} value={view} onChange={(v) => setView(v)} />
      </header>

      <div className="strategy-table__toolbar">
        <SearchInput
          className="strategy-table__search"
          placeholder={t('table.search.ph')}
          value={keyword}
          onChange={(v) => setKeyword(v)}
          onSearch={(v) => setKeyword(v)}
          onClear={() => setKeyword('')}
        />
        <span className="strategy-table__count">
          {selectedIds.length
            ? intl.formatMessage({ id: 'table.selected' }, { count: selectedIds.length })
            : `${dataset.length} / ${strategyRows.length}`}
        </span>
        <div className="strategy-table__toolbar-ops">
          <Button
            leftIcon={<Icon name="play" size={14} />}
            text={t('table.batch.enable')}
            disabled={!selectedIds.length}
            onClick={() => batch('enable')}
          />
          <Button
            leftIcon={<Icon name="pause" size={14} />}
            text={t('table.batch.disable')}
            disabled={!selectedIds.length}
            onClick={() => batch('disable')}
          />
          <IconButton
            iconName={<Icon name="refresh-cw" size={14} />}
            tipText={t('table.refresh')}
            onClick={() => notify('success', t('table.refresh'))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={dataset}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        checkedRows={selectedIds}
        onRowCheck={(row, checkedRows) => setSelectedIds(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIds(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 8, pageSizeOptions: [8, 16, 24] }}
        emptyTableMsg={t('table.empty')}
        showEmptyImage
        enableRowExpand
        onRowExpend={(row) => (
          <div className="strategy-table__expand">
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.threshold')}</span>
              <span className="strategy-table__expand-v">{row.threshold}%</span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.retry')}</span>
              <span className="strategy-table__expand-v">{row.retry}</span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.notify')}</span>
              <span className="strategy-table__expand-v">
                {row.notify
                  .map((n) => translator(notifyOptions.find((o) => o.value === n).labelId))
                  .join(' / ')}
              </span>
            </div>
            <div className="strategy-table__expand-item">
              <span className="strategy-table__expand-k">{t('table.expand.flap')}</span>
              <span className="strategy-table__expand-v">{row.flap ? t('table.expand.on') : t('table.expand.off')}</span>
            </div>
          </div>
        )}
        maxHeight={560}
      />
    </section>
  );
}
