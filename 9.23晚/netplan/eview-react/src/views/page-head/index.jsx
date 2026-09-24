import Crumbs from "@nce/eview-react/Crumbs";
import Button from "@nce/eview-react/Button";
import { Icon } from "../../shared/icon.jsx";
import { breadcrumbPath } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 面包屑 + 页面标题 + 页面级操作
export default function PageHead() {
  const crumbs = breadcrumbPath.map((label) => ({ title: label }));

  return (
    <div className="page-head">
      <Crumbs data={crumbs} />
      <div className="page-head-main">
        <div className="page-head-text">
          <h1 className="page-head-title">网络规划</h1>
          <p className="page-head-desc">
            按「拓扑规划 → IP规划」的顺序完成整网规划，规划结果可同步至站点与设备配置。
          </p>
        </div>
        <div className="page-head-actions">
          <Button leftIcon={<Icon name="refresh-cw" size={14} />} text="重置" />
          <Button leftIcon={<Icon name="save" size={14} />} text="保存草稿" />
          <Button status="primary" leftIcon={<Icon name="play" size={14} />} text="提交规划" />
        </div>
      </div>
    </div>
  );
}
