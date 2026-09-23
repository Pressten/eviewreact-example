import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import Table from "@nce/eview-react/Table";
import { Icon } from "../../shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { DEVICES, REGIONS, STATUS_LIST, DEVICE_TYPE_MAP } from "../../mock/device.js";
import "./index.css";

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={"filter-chip" + (active ? " is-active" : "")}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 设备列表:筛选条件与上方 KPI 卡片/图表双向联动;点击行联动趋势折线图
export default function DeviceTable() {
  const {
    regionFilter,
    statusFilter,
    setRegionFilter,
    setStatusFilter,
    toggleRegionFilter,
    toggleStatusFilter,
    selectedDeviceCode,
    setSelectedDeviceCode,
    clearFilters
  } = useApp();

  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return DEVICES.filter((d) => {
      if (regionFilter && d.region !== regionFilter) return false;
      if (statusFilter && d.status !== statusFilter) return false;
      if (
        kw &&
        d.deviceName.toLowerCase().indexOf(kw) === -1 &&
        d.deviceCode.toLowerCase().indexOf(kw) === -1 &&
        d.owner.toLowerCase().indexOf(kw) === -1
      ) {
        return false;
      }
      return true;
    });
  }, [keyword, regionFilter, statusFilter]);

  // TODO(eview-react) eview-react Table 无 rowClassName，选中行高亮改由 selectedRowIndex 受控承接，视觉样式待真机验证
  const selectedRowIndex = useMemo(() => {
    const index = filtered.findIndex((d) => d.deviceCode === selectedDeviceCode);
    return index >= 0 ? index : undefined;
  }, [filtered, selectedDeviceCode]);

  const columns = useMemo(
    () => [
      {
        title: "设备编号",
        key: "deviceCode",
        width: 110,
        render: (code) => (
          <Button
            status="text"
            size="small"
            className="cell-link"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedDeviceCode(code);
            }}
          >
            {code}
          </Button>
        )
      },
      { title: "设备名称", key: "deviceName", width: 200 },
      { title: "所属区域", key: "region", width: 90 },
      {
        title: "设备类型",
        key: "deviceType",
        width: 140,
        render: (type) => {
          const meta = DEVICE_TYPE_MAP[type];
          return (
            <span className="cell-type">
              <Icon name={meta.icon} size={14} />
              {meta.label}
            </span>
          );
        }
      },
      {
        title: "运行状态",
        key: "status",
        width: 100,
        render: (status) => <StatusTag status={status} />
      },
      {
        title: "负载率",
        key: "loadRate",
        width: 90,
        align: "right",
        render: (v) => (
          <span className={v > 85 ? "num-danger" : ""}>{v.toFixed(1)}%</span>
        )
      },
      {
        title: "当日告警",
        key: "alarmCount",
        width: 90,
        align: "right",
        render: (v) => (v > 0 ? <span className="num-danger">{v}</span> : v)
      },
      { title: "负责人", key: "owner", width: 90 },
      {
        title: "最后维护",
        key: "lastMaintain",
        width: 110,
        render: (v) => <span className="cell-muted">{v}</span>
      },
      {
        title: "操作",
        key: "action",
        width: 96,
        render: (cell, rowData) => (
          <div className="cell-actions">
            <IconButton
              iconName={<Icon name="eye" size={14} />}
              tipText="查看趋势"
              size={24}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedDeviceCode(rowData.deviceCode);
              }}
            />
            <IconButton
              iconName={<Icon name="settings" size={14} />}
              tipText="设备设置"
              size={24}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )
      }
    ],
    [setSelectedDeviceCode]
  );

  const hasSelection = selectedRowKeys.length > 0;

  return (
    <section className="panel-card device-table" aria-label="设备列表">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">设备列表</h3>
          <p className="panel-hint">
            <Icon name="mouse-pointer-click" size={12} />
            点击行联动右侧趋势图 · 筛选条件与上方图表双向同步 · 当前匹配 {filtered.length} 台
          </p>
        </div>
        <div className="table-head-actions">
          <Button
            size="small"
            text="重置"
            leftIcon={<Icon name="rotate-ccw" size={14} />}
            onClick={() => {
              clearFilters();
              setKeyword("");
              setSelectedRowKeys([]);
            }}
          />
          <Button
            size="small"
            status="primary"
            text="导出报表"
            leftIcon={<Icon name="download" size={14} />}
          />
        </div>
      </div>

      <div className="table-toolbar">
        <SearchInput
          className="table-search"
          placeholder="搜索设备名称、编号或负责人"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onClear={() => setKeyword("")}
          inputProps={{
            onKeyDown: (event) => {
              if (event.key === "Enter") setSelectedRowKeys([]);
            }
          }}
        />
        <div className="chip-group" role="group" aria-label="区域筛选">
          <span className="chip-label">区域</span>
          <FilterChip active={!regionFilter} onClick={() => setRegionFilter(null)}>
            全部
          </FilterChip>
          {REGIONS.map((region) => (
            <FilterChip
              key={region}
              active={regionFilter === region}
              onClick={() => toggleRegionFilter(region)}
            >
              {region}
            </FilterChip>
          ))}
        </div>
        <div className="chip-group" role="group" aria-label="状态筛选">
          <span className="chip-label">状态</span>
          <FilterChip active={!statusFilter} onClick={() => setStatusFilter(null)}>
            全部
          </FilterChip>
          {STATUS_LIST.map((item) => (
            <FilterChip
              key={item.key}
              active={statusFilter === item.key}
              onClick={() => toggleStatusFilter(item.key)}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {hasSelection ? (
        <div className="table-selection-bar">
          <span className="selection-text">已选 {selectedRowKeys.length} 项</span>
          <Button size="small" text="导出所选" leftIcon={<Icon name="download" size={12} />} />
          <Button size="small" text="下发指令" leftIcon={<Icon name="send" size={12} />} />
        </div>
      ) : null}

      <div className="table-wrap">
        <Table
          columns={columns}
          dataset={filtered}
          keyIndex={0}
          enableSort={false}
          enableZebraCrossing={false}
          emptyTableMsg="暂无数据"
          enableCheckBox
          checkType="multi"
          preserveCheckedRows
          checkedRows={selectedRowKeys}
          onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
          onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
          selectedRowIndex={selectedRowIndex}
          onRowClick={(row, event) => {
            const target = event && event.target;
            if (
              target &&
              target.closest &&
              target.closest("button, input, label, a, .cell-actions, .cell-link")
            ) {
              return;
            }
            setSelectedDeviceCode(row.deviceCode);
          }}
          enablePagination
          enableAutoPaging
          pagingProps={{
            pageSize: 8,
            pageSizeOptions: [8],
            recordCountDisp: "共 " + filtered.length + " 条",
            enableGoInput: false
          }}
        />
      </div>
    </section>
  );
}
