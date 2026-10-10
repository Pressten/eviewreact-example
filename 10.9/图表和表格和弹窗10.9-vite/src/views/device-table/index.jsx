import { useState } from "react";
import { IconPlusIcPublicDownload, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicSearch } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@nce/eview-react/TextField";
import Button from "@nce/eview-react/Button";
import SelectCard from "@nce/eview-react/SelectCard";
import StatusTag from "../../components/status-tag/index.jsx";
import { deviceList } from "../../mock/dashboard.jsx";
import "./index.css";

export default function DeviceTable({ onView }) {
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState("全部");

  const filtered = deviceList.filter((d) => {
    const matchView = view === "全部" || d.status === view;
    const kw = keyword.trim();
    const matchKeyword =
      !kw ||
      d.name.includes(kw) ||
      d.code.toLowerCase().includes(kw.toLowerCase()) ||
      d.ip.includes(kw);
    return matchView && matchKeyword;
  });

  const columns = [
    {
      title: "设备名称",
      key: "name",
      freezeCol: true,
      width: 210,
      render: (cell, rowData, options, row) => {
        const record = filtered.find((d) => d.id === row?.rawData?.id) || row?.rawData;
        return (
          <a className="device-table__link" onClick={() => onView(record)}>
            {cell}
          </a>
        );
      },
    },
    { title: "设备编号", key: "code", width: 120 },
    { title: "所属区域", key: "region", width: 100 },
    { title: "设备类型", key: "type", width: 120 },
    {
      title: "运行状态",
      key: "status",
      width: 110,
      render: (s) => <StatusTag status={s} />,
    },
    {
      title: "负载率",
      key: "load",
      width: 100,
      align: "right",
      render: (v) => `${v}%`,
    },
    {
      title: "温度",
      key: "temp",
      width: 90,
      align: "right",
      render: (v) => `${v}°C`,
    },
    { title: "更新时间", key: "updated", width: 160 },
    {
      title: "操作",
      key: "action",
      width: 90,
      render: (cell, rowData, options, row) => {
        const record = filtered.find((d) => d.id === row?.rawData?.id) || row?.rawData;
        return (
          <div className="device-table__actions">
            <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} />
            <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
          </div>
        );
      },
    },
  ];

  return (
    <section className="device-table">
      <div className="device-table__head">
        <div className="device-table__title-wrap">
          <h3 className="device-table__title">设备运行明细</h3>
          <span className="device-table__count">共 {deviceList.length} 台设备</span>
        </div>
        <div className="device-table__tools">
          <SelectCard
            type="small"
            data={[
              { text: "全部", value: "全部" },
              { text: "运行中", value: "运行中" },
              { text: "待机", value: "待机" },
              { text: "告警", value: "告警" },
              { text: "离线", value: "离线" },
            ]}
            value={view}
            onChange={(value) => setView(value)}
          />
          <TextField
            className="device-table__search"
            placeholder="搜索名称、编号或 IP"
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
            value={keyword}
            onChange={(value) => setKeyword(value)}
          />
          <Button size="small" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出" />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={filtered}
        enablePagination
        enableAutoPaging
        pageSize={8}
        freezeColPosition="left"
      />
    </section>
  );
}
