import DatePicker from "@nce/eview-react/DatePicker";
import { IconPlusIcDigitalPowerDpExcelFile, IconPlusIcPublicDownload, IconPlusIcPublicImage, IconPlusIcPublicPdfFile, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicRightArrow } from '@nce/icon-plus';
import SelectCard from "@nce/eview-react/SelectCard";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import "./index.css";

const exportItems = [
  { key: "excel", icon: <IconPlusIcDigitalPowerDpExcelFile iconSize="0.875rem" iconColor={['currentcolor']} />, label: "导出 Excel" },
  { key: "pdf", icon: <IconPlusIcPublicPdfFile iconSize="0.875rem" iconColor={['currentcolor']} />, label: "导出 PDF" },
  { key: "image", icon: <IconPlusIcPublicImage iconSize="0.875rem" iconColor={['currentcolor']} />, label: "导出图片" },
];

export default function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header__info">
        <nav className="page-header__crumbs">
          <span>云平台运营中心</span>
          <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['currentcolor']} />
          <span className="is-current">总览看板</span>
        </nav>
        <h1 className="page-header__title">运营总览看板</h1>
        <p className="page-header__desc">实时汇总资源规模、请求负载与告警态势，数据每 5 分钟自动刷新</p>
      </div>

      <div className="page-header__actions">
        <SelectCard
          type="small"
          value="7d"
          data={[
            { text: "今日", value: "1d" },
            { text: "近 7 天", value: "7d" },
            { text: "近 30 天", value: "30d" },
          ]}
        />
        <DatePicker type="date" range={[]} placeholder="开始日期" />
        <span className="page-header__icon-btn">
          <IconPlusIcPublicRefreshClockwise title="刷新数据" iconSize="1rem" iconColor={['currentcolor']} />
        </span>
        <TipBox
          trigger="click"
          direction="bottomRight"
          type="simple"
          content={
            <div className="app-dropdown-menu">
              {exportItems.map((item) => (
                <button key={item.key} type="button" className="app-dropdown-item">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          }
        >
          <Button size="small" text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </TipBox>
      </div>
    </div>
  );
}
