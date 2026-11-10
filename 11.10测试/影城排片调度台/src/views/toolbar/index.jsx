import dayjs from "dayjs";
import { DatePicker, Segmented, Dropdown, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { cinemas } from "../../mock/cinema.js";
import "./index.css";

export default function Toolbar({ selectedCinema, onCinemaChange, selectedDate, onDateChange, onCopyYesterday, onAutoSchedule, onExport }) {
  const cinema = cinemas.find(function (c) { return c.cinemaId === selectedCinema; }) || cinemas[0];

  const cinemaMenu = {
    items: cinemas.map(function (c) {
      return { key: c.cinemaId, label: c.cinemaName };
    }),
    onClick: function (e) { onCinemaChange(e.key); },
  };

  const exportMenu = {
    items: [
      { key: "pdf", label: "导出 PDF", icon: <Icon name="file-text" size="0.875rem" /> },
      { key: "excel", label: "导出 Excel", icon: <Icon name="sheet" size="0.875rem" /> },
    ],
    onClick: function (e) { onExport(e.key); },
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Dropdown menu={cinemaMenu} trigger={["click"]}>
          <div className="cinema-trigger">
            <Icon name="building-2" size="1rem" color="#0067D1" />
            <span>{cinema.cinemaName}</span>
            <Icon name="chevron-down" size="0.875rem" />
          </div>
        </Dropdown>
        <div className="toolbar-divider" />
        <div className="date-nav">
          <span className="date-nav-icon" onClick={function () { onDateChange(dayjs(selectedDate).subtract(1, "day")); }} title="前一日">
            <Icon name="chevron-left" size="1.25rem" />
          </span>
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={function (d) { if (d) onDateChange(d); }}
            allowClear={false}
            style={{ width: "8.5rem" }}
          />
          <span className="date-nav-icon" onClick={function () { onDateChange(dayjs(selectedDate).add(1, "day")); }} title="后一日">
            <Icon name="chevron-right" size="1.25rem" />
          </span>
        </div>
        <Segmented
          options={[
            { label: "日视图", value: "day" },
            { label: "周视图", value: "week" },
          ]}
          defaultValue="day"
          onChange={function () {}}
        />
      </div>
      <div className="toolbar-right">
        <Button onClick={onCopyYesterday}>
          <Icon name="copy" size="0.875rem" />
          <span>复制昨日排片</span>
        </Button>
        <Button type="primary" onClick={onAutoSchedule}>
          <Icon name="wand-sparkles" size="0.875rem" color="#FFFFFF" />
          <span>一键排片</span>
        </Button>
        <Dropdown menu={exportMenu} trigger={["click"]}>
          <Button>
            <Icon name="download" size="0.875rem" />
            <span>导出</span>
            <Icon name="chevron-down" size="0.75rem" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
