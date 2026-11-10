// Layer 4: 概述章节 — 版本化标题 + 适用性说明 + 统计 + 基础信息
import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { VERSION_META } from "../../mock/api-registry.js";
import { BASE_INFO } from "../../mock/docs.js";
import "./index.css";

export default function SectionOverview() {
  const { version, versionApis } = useApp();
  const meta = VERSION_META[version];

  const groupCount = new Set(versionApis.map((api) => api.group)).size;

  return (
    <section id="overview" className="doc-section">
      <div className="overview-head">
        <h1 className="overview-title">{meta.pageTitle}</h1>
        <Tag color="processing" className="overview-ver-tag">
          {meta.docTag}
        </Tag>
      </div>

      {/* 适用性说明：随版本切换变化 */}
      <div className={`banner banner-${meta.bannerType}`}>
        <Icon name={meta.bannerIcon} size="1rem" className="banner-icon" />
        <span className="banner-text">{meta.bannerText}</span>
      </div>

      <p className="section-lead">
        OpenCloud 开放平台提供 RESTful 风格的 HTTP 接口，覆盖用户、订单、支付、商品、事件订阅与数据分析六大资源域。所有接口通过
        HTTPS 调用，使用 JSON 作为数据交换格式，并支持 HMAC-SHA256 请求签名以满足金融级安全场景。
      </p>

      <div className="stat-row">
        <div className="stat-item">
          <div className="stat-value">{versionApis.length}</div>
          <div className="stat-label">可用接口</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{groupCount}</div>
          <div className="stat-label">资源分组</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{meta.monthlyChanges}</div>
          <div className="stat-label">30 天内变更</div>
        </div>
      </div>

      <div className="baseinfo-grid">
        {BASE_INFO.map((item) => (
          <div className="baseinfo-item" key={item.label}>
            <div className="baseinfo-label">{item.label}</div>
            <div className={`baseinfo-value${item.mono ? " mono" : ""}`}>
              {item.value.replaceAll("{V}", version)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
