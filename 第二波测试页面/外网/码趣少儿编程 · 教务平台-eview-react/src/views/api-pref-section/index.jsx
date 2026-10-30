import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcPublicCode, IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import RadioGroup from "@nce/eview-react/RadioGroup";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

// Layer 4: API 偏好组
// 数据格式 / 分页大小单选；沙箱开关开启时显示附加说明区块。
export default function ApiPrefSection({ settings, update }) {
  return (
    <SectionCard
      id="sec-api-pref"
      icon={<IconPlusIcPublicCode iconSize="1.25rem" iconColor={['currentcolor']} />}
      title="API 偏好"
      description="配置默认的数据交互格式、分页与沙箱环境。"
    >
      <SettingRow
        label="默认数据格式"
        description="平台 API 请求与响应的默认序列化格式。"
        control={
          <RadioGroup
            isControlled
            value={settings.dataFormat}
            data={[
              { value: "json", text: "JSON" },
              { value: "xml", text: "XML" },
            ]}
            onChange={(a, b) => {
              const next = a === settings.dataFormat ? b : a;
              update({ dataFormat: next });
            }}
          />
        }
      />

      <SettingRow
        label="默认分页大小"
        description="列表类接口在不指定 page_size 时的默认每页条数。"
        control={
          <RadioGroup
            isControlled
            value={settings.pageSize}
            data={[
              { value: 10, text: "10" },
              { value: 20, text: "20" },
              { value: 50, text: "50" },
            ]}
            onChange={(a, b) => {
              const next = a === settings.pageSize ? b : a;
              update({ pageSize: next });
            }}
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
            data={[false, true]}
          />
        }
      />

      {settings.sandbox && (
        <div className="sandbox-note" role="status">
          <IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />
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
