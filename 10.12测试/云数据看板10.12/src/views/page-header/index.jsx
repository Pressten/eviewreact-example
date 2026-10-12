import { DatePicker, Segmented, Button, Dropdown } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const exportMenu = {
  items: [
    { key: "excel", icon: <Icon name="file-spreadsheet" size="0.875rem" />, label: "导出 Excel" },
    { key: "pdf", icon: <Icon name="file-text" size="0.875rem" />, label: "导出 PDF" },
    { key: "image", icon: <Icon name="image" size="0.875rem" />, label: "导出图片" },
  ],
};

export default function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header__info">
        <nav className="page-header__crumbs">
          <span>云平台运营中心</span>
          <Icon name="chevron-right" size="0.75rem" />
          <span className="is-current">总览看板</span>
        </nav>
        <h1 className="page-header__title">运营总览看板</h1>
        <p className="page-header__desc">实时汇总资源规模、请求负载与告警态势，数据每 5 分钟自动刷新</p>
      </div>

      <div className="page-header__actions">
        <Segmented
          size="small"
          defaultValue="7d"
          options={[
            { label: "今日", value: "1d" },
            { label: "近 7 天", value: "7d" },
            { label: "近 30 天", value: "30d" },
          ]}
        />
        <DatePicker.RangePicker size="small" placeholder={["开始日期", "结束日期"]} />
        <span className="page-header__icon-btn">
          <Icon name="refresh-cw" size="1rem" title="刷新数据" />
        </span>
        <Dropdown menu={exportMenu} placement="bottomRight" trigger={["click"]}>
          <Button size="small" icon={<Icon name="download" size="0.875rem" />}>
            导出
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
