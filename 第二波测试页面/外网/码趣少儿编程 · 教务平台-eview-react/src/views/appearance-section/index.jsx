import { useState } from "react";
import { IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import DragInput from "@nce/eview-react/DragInput";
import RadioGroup from "@nce/eview-react/RadioGroup";
import { THEME_PRESETS } from "../../mock/settings.js";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

// Layer 4: 外观组
// 滑杆与主题色选择实时预览说明；字号单选。
export default function AppearanceSection({ settings, update }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const zoomNote =
    settings.uiZoom === 100
      ? "当前界面缩放 100%（默认）"
      : `当前界面缩放 ${settings.uiZoom}%，将等比缩放界面元素与文字。`;

  const colorNote = `当前主题色 ${settings.themeColor.toUpperCase()}，应用于按钮、链接与选中态。`;

  return (
    <SectionCard
      id="sec-appearance"
      icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />}
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
            precision={0}
            markIndexes={[80, 100, 120]}
            value={[settings.uiZoom]}
            style={{ width: "12rem" }}
            onChange={(value) => update({ uiZoom: value[0] })}
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
        {/* 手写预设色板（替代 antd ColorPicker）：点击展开色卡选色 */}
        <div className="appearance-colorpicker" style={{ position: "relative" }}>
          <button
            type="button"
            className="appearance-colorpicker__btn"
            onClick={() => setPickerOpen((o) => !o)}
            style={{ background: settings.themeColor }}
            title="选择主题色"
          />
          {pickerOpen ? (
            <div className="appearance-colorpicker__panel">
              {THEME_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="appearance-colorpicker__swatch"
                  style={{ background: c }}
                  title={c}
                  onClick={() => { update({ themeColor: c }); setPickerOpen(false); }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <SettingRow
        label="代码编辑器字号"
        description="在线代码编辑器与控制台输出的默认字号。"
        control={
          <RadioGroup
            isControlled
            value={settings.editorFontSize}
            data={[
              { value: "small", text: "小" },
              { value: "medium", text: "中" },
              { value: "large", text: "大" },
            ]}
            onChange={(a, b) => {
              const next = a === settings.editorFontSize ? b : a;
              update({ editorFontSize: next });
            }}
          />
        }
      />
    </SectionCard>
  );
}
