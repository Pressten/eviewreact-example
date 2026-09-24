import { Breadcrumb, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { breadcrumbPath } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 面包屑 + 页面标题 + 页面级操作
export default function PageHead() {
  const items = breadcrumbPath.map((label) => ({ title: label }));

  return (
    <div className="page-head">
      <Breadcrumb items={items} />
      <div className="page-head-main">
        <div className="page-head-text">
          <h1 className="page-head-title">网络规划</h1>
          <p className="page-head-desc">
            按「拓扑规划 → IP规划」的顺序完成整网规划，规划结果可同步至站点与设备配置。
          </p>
        </div>
        <div className="page-head-actions">
          <Button icon={<Icon name="refresh-cw" size={14} />}>重置</Button>
          <Button icon={<Icon name="save" size={14} />}>保存草稿</Button>
          <Button type="primary" icon={<Icon name="play" size={14} />}>
            提交规划
          </Button>
        </div>
      </div>
    </div>
  );
}
