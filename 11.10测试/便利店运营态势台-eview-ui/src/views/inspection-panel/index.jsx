import { useMemo, useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import Carousel from "@cloudsop/eview-ui/Carousel";
import Tag from "@cloudsop/eview-ui/Tag";
import AppBadge from "../../components/app-badge/index.jsx";
// TODO(eview-ui): Badge 无对应，按 handwrite-templates.md §4 手写补位组件 AppBadge（样式用源项目 token CSS 变量）。
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { useToast } from "../../components/toast/index.jsx";
import { INSPECTION_ISSUES, LICENSE_ALERTS } from "../../mock/data.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const SEVERITY_TAG = { 高: "danger", 中: "warning", 低: "default" };
const ISSUE_STATUS_TAG = {
  待整改: "danger",
  整改中: "primary",
  已催办: "warning",
  已整改: "success",
};

export default function InspectionPanel() {
  const { region, stores, setDetailStoreId } = useApp();
  const notify = useToast();
  const [issues, setIssues] = useState(() => INSPECTION_ISSUES.map((it) => ({ ...it })));
  const [sevFilter, setSevFilter] = useState("全部");

  const scopedIssues = useMemo(
    () =>
      issues.filter(
        (it) => (region === "全部" || it.region === region) && (sevFilter === "全部" || it.severity === sevFilter)
      ),
    [issues, region, sevFilter]
  );
  const scopedLicenses = useMemo(
    () => LICENSE_ALERTS.filter((l) => region === "全部" || l.region === region),
    [region]
  );

  const urge = (it) => {
    setIssues((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "已催办" } : x)));
    notify("success", `已向 ${it.storeName} 督导发送催办通知`);
  };

  const openDetail = (storeId) => setDetailStoreId(storeId);
  const storeName = (storeId) => stores.find((s) => s.storeId === storeId)?.storeName || storeId;

  return (
    <SectionCard
      className="ip-card"
      title="巡检与合规"
      icon="clipboard-list"
      extra={
        <div className="ip-extra-wrap">
          <Dropdown
            placement="bottomRight"
            trigger={["hover"]}
            overlay={
              <div className="ip-sev-menu" style={{ minWidth: "8rem" }}>
                {["全部", "高", "中", "低"].map((k) => (
                  <a key={k} onClick={() => setSevFilter(k)} className="ip-sev-item">
                    严重度：{k}
                  </a>
                ))}
              </div>
            }
          >
            <Button size="small">
              严重度：{sevFilter}
              <Icon name="chevron-down" size="0.75rem" style={{ marginLeft: "0.25rem" }} />
            </Button>
          </Dropdown>
          <span className="ip-extra">
            巡检问题 {scopedIssues.length} 条 · 证照提醒 {scopedLicenses.length} 条
          </span>
        </div>
      }
      bodyClassName="ip-body"
    >
      <div className="ip-issues">
        {scopedIssues.length === 0 ? (
          <p className="ip-empty">当前大区暂未收录巡检问题</p>
        ) : (
          scopedIssues.map((it) => (
            <div className="ip-row" key={it.id}>
              <div className="ip-store">
                <a onClick={() => openDetail(it.storeId)} title="查看门店详情">
                  {it.storeName}
                </a>
                <Tag type="message">{it.type}</Tag>
              </div>
              <Tag type="status" color={SEVERITY_TAG[it.severity]}>{it.severity}</Tag>
              <span className="ip-time">{it.occurredAt}</span>
              <Tag type="status" color={ISSUE_STATUS_TAG[it.status]}>{it.status}</Tag>
              <Button
                size="small"
                disabled={it.status !== "待整改"}
                onClick={() => urge(it)}
              >
                催办
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="ip-licenses">
        <div className="ip-lic-head">
          <Icon name="file-text" size="0.875rem" />
          证照到期提醒
          <span className="ip-lic-count">{scopedLicenses.length} 项待处理</span>
        </div>
        {scopedLicenses.length === 0 ? (
          <p className="ip-empty">当前大区暂无证照到期提醒</p>
        ) : (
          <Carousel className="lic-carousel">
            {scopedLicenses.map((l) => {
              const urgent = l.daysLeft < 30;
              return (
                <div key={l.id}>
                  <div className={`lic-slide ${urgent ? "lic-urgent" : ""}`}>
                    <div className="lic-slide-head">
                      <span className="lic-icon">
                        <Icon name="file-text" size="1.25rem" />
                      </span>
                      <span className="lic-title">
                        <b>{l.storeName}</b>
                        <span>{l.licenseType}</span>
                      </span>
                      <Tag type="status" color={urgent ? "danger" : "primary"}>{urgent ? "紧急" : "关注"}</Tag>
                    </div>
                    <div className="lic-slide-info">
                      <span>
                        <Icon name="landmark" size="0.75rem" />
                        受理网点：{l.agency}
                      </span>
                      <span>
                        <Icon name="user-round" size="0.75rem" />
                        责任专员：{l.handler}
                      </span>
                      <span>
                        <Icon name="hourglass" size="0.75rem" />
                        预计办理 {l.estimate}
                      </span>
                    </div>
                    <div className="lic-slide-foot">
                      <span className="lic-date">
                        <Icon name="calendar-days" size="0.75rem" />
                        到期日 {l.expiryDate}
                      </span>
                      <span className="lic-days">
                        <AppBadge count={l.daysLeft} title="剩余天数">
                          <Icon name="calendar-clock" size="1.25rem" />
                        </AppBadge>
                        <b className={urgent ? "lic-days-danger" : ""}>剩余 {l.daysLeft} 天</b>
                      </span>
                      <a onClick={() => openDetail(l.storeId)}>查看门店</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        )}
      </div>
    </SectionCard>
  );
}
