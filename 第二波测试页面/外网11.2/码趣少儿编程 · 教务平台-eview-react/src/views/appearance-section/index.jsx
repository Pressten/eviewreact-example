import DragInput from "@nce/eview-react/DragInput";
import { IconPlusIcPublicColorPalette } from '@hui/icon-plus';
import RadioGroup from "@nce/eview-react/RadioGroup";
import { THEME_PRESETS } from "../../mock/settings.js";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

// Layer 4: 外观组
// 滑杆与主题色选择实时预览说明；字号单选。
export default function AppearanceSection({ settings, update }) {
  const zoomNote =
    settings.uiZoom === 100
      ? "当前界面缩放 100%（默认）"
      : `当前界面缩放 ${settings.uiZoom}%，将等比缩放界面元素与文字。`;

  const colorNote = `当前主题色 ${settings.themeColor.toUpperCase()}，应用于按钮、链接与选中态。`;

  return (
    <SectionCard
      id="sec-appearance"
      icon={<IconPlusIcPublicColorPalette iconSize="1.25rem" iconColor={['currentcolor']} />}
      title="外观"
      description="个性化界面缩放、主题色与代码编辑器字号。"
    >
      <div className="setting-row">
        <div className="setting-row__info">
          <label className="setting-row__label">界面缩放</label>
          <p className="setting-row__desc">{zoomNote}</p>
        </div>
        <div className="appearance-slider">
          <span className="appearance-slider__edge">80%</span>
          <DragInput
            min={80}
            max={120}
            step={5}
            value={[settings.uiZoom]}
            style={{ width: "12rem" }}
            onChange={(v) => update({ uiZoom: v[0] })}
          />
          <span className="appearance-slider__edge">120%</span>
        </div>
      </div>

      <div className="setting-row">
        <div className="setting-row__info">
          <label className="setting-row__label">主题色</label>
          <p className="setting-row__desc">{colorNote}</p>
          <span className="appearance-swatch" style={{ background: settings.themeColor }} />
        </div>
        <div className="color-picker-simple">
          <input type="color" value={settings.themeColor} onChange={(e) => update({ themeColor: e.target.value })} style={{ width: '2rem', height: '2rem', border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer' }} />
          <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace' }}>{settings.themeColor.toUpperCase()}</span>
          <div style={{ display: 'flex', gap: '4px', marginLeft: '0.5rem' }}>
            {THEME_PRESETS.map((c) => (
              <button key={c} type="button" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', border: '1px solid #e0e0e0', background: c, cursor: 'pointer' }} onClick={() => update({ themeColor: c })} title={c} />
            ))}
          </div>
        </div>
      </div>

      <SettingRow
        label="代码编辑器字号"
        description="在线代码编辑器与控制台输出的默认字号。"
        control={
          <RadioGroup
            data={[{ text: "小", value: "small" }, { text: "中", value: "medium" }, { text: "大", value: "large" }]}
            value={settings.editorFontSize}
            isControlled
            onChange={(value) => update({ editorFontSize: value })}
          />
        }
      />
    </SectionCard>
  );
}
