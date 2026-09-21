import Button from "@nce/eview-react/Button";
// TODO_CONTRACT: icon+ 组件名按命名规律推断（ic_public_download / ic_public_plus → IconPlusIcPublic*），未联 icon-plus getIconInfo 服务核验，待骨架/测试 agent 联网确认
import { IconPlusIcPublicDownload, IconPlusIcPublicPlus } from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 页面标题区 — 标题 / 说明 / 指标概览 / 主次操作
export default function PageHeading() {
  const { metrics, openCreate } = useApp();
  const warningCount = metrics.filter((metric) => metric.status === "warning").length;
  const abnormalCount = metrics.filter((metric) => metric.status === "abnormal").length;

  return (
    <div className="page-heading">
      <div className="page-heading__text">
        <h1 className="page-heading__title">数据指标管理</h1>
        <p className="page-heading__desc">
          维护指标定义与统计口径，跟踪目标达成情况并指派责任人与数据来源。
        </p>
        <div className="page-heading__meta">
          <span className="page-heading__meta-item">
            指标总数 <b>{metrics.length}</b>
          </span>
          <span className="page-heading__meta-item page-heading__meta-item--critical">
            需关注 <b>{warningCount}</b>
          </span>
          <span className="page-heading__meta-item page-heading__meta-item--error">
            数据异常 <b>{abnormalCount}</b>
          </span>
        </div>
      </div>
      <div className="page-heading__actions">
        <Button text="导出指标" leftIcon={<IconPlusIcPublicDownload iconSize={14} />} />
        <Button
          status="primary"
          text="新建指标"
          leftIcon={<IconPlusIcPublicPlus iconSize={14} />}
          onClick={openCreate}
        />
      </div>
    </div>
  );
}
