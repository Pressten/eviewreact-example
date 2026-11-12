import { useMemo, useState } from "react";
import { IconPlusIcPublicBuilding, IconPlusIcPublicCalendar, IconPlusIcPublicChevronDown, IconPlusIcPublicClipboard, IconPlusIcPublicDocClock, IconPlusIcPublicHourglass, IconPlusIcPublicPerson, IconPlusIcPublicTxtFileTextured } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import DropDown from "@nce/eview-react/DropDown";
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { message } from "../../components/notice/index.jsx";
import { INSPECTION_ISSUES, LICENSE_ALERTS } from "../../mock/data.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const SEVERITY_TAG = { 高: "error", 中: "warning", 低: "default" };
const ISSUE_STATUS_TAG = {
  待整改: "error",
  整改中: "processing",
  已催办: "warning",
  已整改: "success",
};

// 手写最小可用轮播（antd Carousel 无 eview-react 对应组件，无模板章节）
// 点指示器切换幻灯片，CSS transform/translate + state 切 index
function LicCarousel({ children }) {
  const slides = Array.isArray(children) ? children : [children];
  const [index, setIndex] = useState(0);
  const total = slides.length;
  if (total === 0) return null;
  const go = (i) => setIndex((i + total) % total);
  return (
    <div className="lic-carousel">
      <div className="lic-carousel-viewport">
        <div
          className="lic-carousel-track"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div className="lic-carousel-slide" key={i}>
              {s}
            </div>
          ))}
        </div>
      </div>
      {total > 1 ? (
        <div className="lic-carousel-dots">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`lic-carousel-dot ${i === index ? "is-active" : ""}`}
              onClick={() => go(i)}
              aria-label={`切换到第 ${i + 1} 张`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function InspectionPanel() {
  const { region, stores, setDetailStoreId } = useApp();
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
    message.success(`已向 ${it.storeName} 督导发送催办通知`);
  };

  const openDetail = (storeId) => setDetailStoreId(storeId);
  const storeName = (storeId) => stores.find((s) => s.storeId === storeId)?.storeName || storeId;

  return (
    <SectionCard
      className="ip-card"
      title="巡检与合规"
      icon={<IconPlusIcPublicClipboard iconSize="1rem" iconColor={['currentcolor']} />}
      extra={
        <div className="ip-extra-wrap">
          <DropDown
            position="right"
            popupDirection="bottom"
            data={["全部", "高", "中", "低"].map((k) => ({ value: k, text: `严重度：${k}` }))}
            onItemClick={(item) => setSevFilter(item.value)}
          >
            <Button size="small">
              严重度：{sevFilter}
              <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} style={{ marginLeft: "0.25rem" }} />
            </Button>
          </DropDown>
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
                <Tag>{it.type}</Tag>
              </div>
              <Tag color={SEVERITY_TAG[it.severity]}>{it.severity}</Tag>
              <span className="ip-time">{it.occurredAt}</span>
              <Tag color={ISSUE_STATUS_TAG[it.status]}>{it.status}</Tag>
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
          <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />
          证照到期提醒
          <span className="ip-lic-count">{scopedLicenses.length} 项待处理</span>
        </div>
        {scopedLicenses.length === 0 ? (
          <p className="ip-empty">当前大区暂无证照到期提醒</p>
        ) : (
          <LicCarousel>
            {scopedLicenses.map((l) => {
              const urgent = l.daysLeft < 30;
              return (
                <div key={l.id}>
                  <div className={`lic-slide ${urgent ? "lic-urgent" : ""}`}>
                    <div className="lic-slide-head">
                      <span className="lic-icon">
                        <IconPlusIcPublicTxtFileTextured iconSize="1.25rem" iconColor={['currentcolor']} />
                      </span>
                      <span className="lic-title">
                        <b>{l.storeName}</b>
                        <span>{l.licenseType}</span>
                      </span>
                      <Tag color={urgent ? "error" : "processing"}>{urgent ? "紧急" : "关注"}</Tag>
                    </div>
                    <div className="lic-slide-info">
                      <span>
                        <IconPlusIcPublicBuilding iconSize="0.75rem" iconColor={['currentcolor']} />
                        受理网点：{l.agency}
                      </span>
                      <span>
                        <IconPlusIcPublicPerson iconSize="0.75rem" iconColor={['currentcolor']} />
                        责任专员：{l.handler}
                      </span>
                      <span>
                        <IconPlusIcPublicHourglass iconSize="0.75rem" iconColor={['currentcolor']} />
                        预计办理 {l.estimate}
                      </span>
                    </div>
                    <div className="lic-slide-foot">
                      <span className="lic-date">
                        <IconPlusIcPublicCalendar iconSize="0.75rem" iconColor={['currentcolor']} />
                        到期日 {l.expiryDate}
                      </span>
                      <span className="lic-days">
                        <Badge
                          content={l.daysLeft}
                          title="剩余天数"
                          badgeStyle={urgent ? { backgroundColor: "var(--error)" } : undefined}
                        >
                          <IconPlusIcPublicDocClock iconSize="1.25rem" iconColor={['currentcolor']} />
                        </Badge>
                        <b className={urgent ? "lic-days-danger" : ""}>剩余 {l.daysLeft} 天</b>
                      </span>
                      <a onClick={() => openDetail(l.storeId)}>查看门店</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </LicCarousel>
        )}
      </div>
    </SectionCard>
  );
}
