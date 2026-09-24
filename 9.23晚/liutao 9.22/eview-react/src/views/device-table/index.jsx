import { useState } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import Drawer from "@nce/eview-react/Drawer";
import Select from "@nce/eview-react/Select";
import DivMessage from "@nce/eview-react/DivMessage";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { useApp } from "../../context.jsx";
import { Icon } from "../../shared/icon.jsx";
import { deviceList, DEVICE_STATUS, DEVICE_TYPES } from "../../mock/device.js";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

// Layer 4: 设备管理视图 — 搜索 + 操作按钮 + 可勾选表格
// 表格内设备名称为链接,点击跳转告警页签;操作列纯图标按钮跳转配置页签。

function findTypeName(type) {
  const t = DEVICE_TYPES.find((d) => d.value === type);
  return t ? t.text : type;
}

export default function DeviceTable() {
  const { selectedRowKeys, setSelectedRowKeys, jumpToTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [advType, setAdvType] = useState(undefined);
  const [advStatus, setAdvStatus] = useState(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const filteredData = deviceList.filter((d) => {
    const kw = keyword.trim().toLowerCase();
    const kwMatch =
      !kw ||
      d.name.toLowerCase().includes(kw) ||
      d.id.toLowerCase().includes(kw) ||
      d.ip.includes(kw);
    const typeMatch = !advType || d.type === advType;
    const statusMatch = !advStatus || d.status === advStatus;
    return kwMatch && typeMatch && statusMatch;
  });

  const columns = [
    {
      title: "设备名称",
      key: "name",
      allowSort: false,
      render: (cell, _rd, _opts, row) => (
        <Button
          status="text"
          text={cell}
          className="device-name-link"
          onClick={() => jumpToTab("alarm", row)}
        />
      ),
    },
    { title: "设备ID", key: "id", width: 120, allowSort: false },
    {
      title: "设备类型",
      key: "type",
      width: 110,
      allowSort: false,
      render: (cell) => findTypeName(cell),
    },
    { title: "IP地址", key: "ip", width: 130, allowSort: false },
    { title: "机房位置", key: "room", width: 120, allowSort: false },
    {
      title: "状态",
      key: "status",
      width: 100,
      allowSort: false,
      render: (cell) => {
        const s = DEVICE_STATUS[cell];
        return <StatusTag text={s.text} tone={s.tone} />;
      },
    },
    { title: "告警数", key: "alarmCount", width: 90, align: "right" },
    {
      title: "CPU",
      key: "cpu",
      width: 80,
      align: "right",
      render: (cell) => (cell > 0 ? `${cell}%` : "—"),
    },
    { title: "最后在线时间", key: "lastTime", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 90,
      align: "center",
      allowSort: false,
      render: (_cell, _rd, _opts, row) => (
        <div className="device-action-group">
          <IconButton
            iconName={<Icon name="bell" size={14} />}
            tipText="查看告警"
            size="small"
            onClick={() => jumpToTab("alarm", row)}
          />
          <IconButton
            iconName={<Icon name="settings" size={14} />}
            tipText="配置管理"
            size="small"
            onClick={() => jumpToTab("config", row)}
          />
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      notify("warn", "请先选择要删除的设备");
      return;
    }
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    notify("success", `已删除 ${selectedRowKeys.length} 台设备`);
    setSelectedRowKeys([]);
    setConfirmOpen(false);
  };

  const handleExport = () => {
    notify("success", `已导出 ${filteredData.length} 条设备数据`);
  };

  const handleAdvSearch = () => {
    setDrawerOpen(false);
    notify("success", "高级搜索条件已应用");
  };

  const handleAdvReset = () => {
    setAdvType(undefined);
    setAdvStatus(undefined);
  };

  return (
    <div className="device-table-view">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
        />
      ) : null}

      <div className="table-toolbar">
        <div className="table-toolbar__search">
          <SearchInput
            placeholder="搜索设备名称、ID 或 IP"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onClear={() => setKeyword("")}
          />
        </div>
        <div className="table-toolbar__actions">
          <Button
            leftIcon={<Icon name="sliders-horizontal" size={14} />}
            text="高级搜索"
            onClick={() => setDrawerOpen(true)}
          />
          <Button
            status="risk"
            leftIcon={<Icon name="trash-2" size={14} />}
            text="删除"
            onClick={handleDelete}
          />
          <Button
            status="primary"
            leftIcon={<Icon name="download" size={14} />}
            text="导出"
            onClick={handleExport}
          />
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <div className="table-selected-bar">
          <Icon name="circle-check-big" size={14} color="var(--primary)" />
          已选择 <strong>{selectedRowKeys.length}</strong> 项
          <Button
            status="text"
            text="取消选择"
            size="small"
            onClick={() => setSelectedRowKeys([])}
          />
        </div>
      )}

      <Table
        columns={columns}
        dataset={filteredData}
        keyIndex={1}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        emptyTableMsg="暂无设备数据"
      />

      <Drawer
        title="高级搜索"
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={380}
      >
        <div className="adv-search-form">
          <div className="adv-search-form__item">
            <label>设备类型</label>
            <Select
              defaultLabel="请选择设备类型"
              value={advType}
              enableClear
              onChange={(value) => setAdvType(value)}
              options={DEVICE_TYPES.map((t) => ({ text: t.text, value: t.value }))}
            />
          </div>
          <div className="adv-search-form__item">
            <label>运行状态</label>
            <Select
              defaultLabel="请选择运行状态"
              value={advStatus}
              enableClear
              onChange={(value) => setAdvStatus(value)}
              options={Object.entries(DEVICE_STATUS).map(([k, v]) => ({
                text: v.text,
                value: k,
              }))}
            />
          </div>
        </div>
        <div className="drawer-footer-actions">
          <Button text="重置" onClick={handleAdvReset} />
          <Button status="primary" text="查询" onClick={handleAdvSearch} />
        </div>
      </Drawer>

      <MessageDialog
        type="confirm"
        isOpen={confirmOpen}
        iconLocation="title"
        content={`确定要删除选中的 ${selectedRowKeys.length} 台设备吗?此操作不可撤销。`}
        onClose={() => setConfirmOpen(false)}
        buttons={{
          cancel: { text: "取消", onClick: () => setConfirmOpen(false) },
          ok: {
            text: "删除",
            focused: true,
            onClick: handleDeleteConfirm,
          },
        }}
      />
    </div>
  );
}
