import DragInput from "eview-ui/DragInput";
import ColorPicker from "eview-ui/ColorPicker";
import Radio from "eview-ui/Radio";
import { THEME_PRESETS } from "../../mock/settings.js";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

const FONT_SIZE_OPTIONS = [
  { value: "small", text: "小" },
  { value: "medium", text: "中" },
  { value: "large", text: "大" },
];

export default function AppearanceSection({ settings, update }) {
  const zoomNote =
    settings.uiZoom === 100
      ? "当前界面缩放 100%（默认）"
      : `当前界面缩放 ${settings.uiZoom}%，将等比缩放界面元素与文字。`;

  const colorNote = `当前主题色 ${settings.themeColor.toUpperCase()}，应用于按钮、链接与选中态。`;

  return (
    <SectionCard
      id="sec-appearance"
      icon="palette"
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
            markIndexes={[80, 90, 100, 110, 120]}
            onChange={(v) => update({ uiZoom: Array.isArray(v) ? v[0] : v })}
            style={{ width: "12rem" }}
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
        <ColorPicker
          value={settings.themeColor}
          onColorChange={(color) => update({ themeColor: typeof color === "string" ? color : color.toHexString ? color.toHexString() : String(color) })}
        />
      </div>

      <SettingRow
        label="代码编辑器字号"
        description="在线代码编辑器与控制台输出的默认字号。"
        control={
          <Radio
            value={settings.editorFontSize}
            data={FONT_SIZE_OPTIONS}
            onChange={(v) => update({ editorFontSize: v })}
          />
        }
      />
    </SectionCard>
  );
}
