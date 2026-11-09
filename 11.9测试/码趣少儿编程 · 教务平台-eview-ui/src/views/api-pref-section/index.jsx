import Toggle from "eview-ui/Toggle";
import Radio from "eview-ui/Radio";
import Icon from "@/shared/Icon";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

const FORMAT_OPTIONS = [
  { value: "json", text: "JSON" },
  { value: "xml", text: "XML" },
];
const PAGE_SIZE_OPTIONS = [
  { value: 10, text: "10" },
  { value: 20, text: "20" },
  { value: 50, text: "50" },
];

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
          <Radio
            value={settings.dataFormat}
            data={FORMAT_OPTIONS}
            onChange={(v) => update({ dataFormat: v })}
          />
        }
      />

      <SettingRow
        label="默认分页大小"
        description="列表类接口在不指定 page_size 时的默认每页条数。"
        control={
          <Radio
            value={settings.pageSize}
            data={PAGE_SIZE_OPTIONS}
            onChange={(v) => update({ pageSize: v })}
          />
        }
      />

      <SettingRow
        label="沙箱环境"
        description="开启后，控制台内的接口调试将默认指向沙箱环境，不影响生产数据。"
        status={settings.sandbox ? "已开启" : "已关闭"}
        statusOn={settings.sandbox}
        control={
          <Toggle
            toggled={settings.sandbox}
            onToggle={(v) => update({ sandbox: v })}
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
