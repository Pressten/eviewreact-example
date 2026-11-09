import { Switch, Radio } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

// Layer 4: API 偏好组
// 数据格式 / 分页大小单选；沙箱开关开启时显示附加说明区块。
export default function ApiPrefSection({ settings, update }) {
  return (
    <SectionCard
      id="sec-api-pref"
      icon="code"
      title="API 偏好"
      description="配置默认的数据交互格式、分页与沙箱环境。"
    >
      <SettingRow
        label="默认数据格式"
        description="平台 API 请求与响应的默认序列化格式。"
        control={
          <Radio.Group
            value={settings.dataFormat}
            onChange={(e) => update({ dataFormat: e.target.value })}
          >
            <Radio value="json">JSON</Radio>
            <Radio value="xml">XML</Radio>
          </Radio.Group>
        }
      />

      <SettingRow
        label="默认分页大小"
        description="列表类接口在不指定 page_size 时的默认每页条数。"
        control={
          <Radio.Group
            value={settings.pageSize}
            onChange={(e) => update({ pageSize: e.target.value })}
          >
            <Radio value={10}>10</Radio>
            <Radio value={20}>20</Radio>
            <Radio value={50}>50</Radio>
          </Radio.Group>
        }
      />

      <SettingRow
        label="沙箱环境"
        description="开启后，控制台内的接口调试将默认指向沙箱环境，不影响生产数据。"
        status={settings.sandbox ? "已开启" : "已关闭"}
        statusOn={settings.sandbox}
        control={
          <Switch
            checked={settings.sandbox}
            onChange={(v) => update({ sandbox: v })}
          />
        }
      />

      {settings.sandbox && (
        <div className="sandbox-note" role="status">
          <Icon name="flask-conical" size="1rem" />
          <div className="sandbox-note__body">
            <span className="sandbox-note__title">沙箱域名</span>
            <p className="sandbox-note__text">
              当前沙箱接入域名：<code>sandbox-api.dev-platform.com</code>。
              该环境数据每日自动重置，请勿用于生产联调；生产域名
              <code>api.dev-platform.com</code> 不受此开关影响。
            </p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
