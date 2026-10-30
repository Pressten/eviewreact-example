// ⑥ 素材库：8 张图片素材（缩略图/尺寸/被引用次数/替换按钮）
// 引用次数由全部页面楼层实时计算，与楼层引用严格一致
// 点击素材卡选中，替换按钮将素材替换到「当前编辑组件」（表格中点击行选择目标）
import { useMemo, useState } from "react";
import { Button, Popover, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import { MATERIALS } from "../../mock/material.js";
import { IMAGE_FLOOR_TYPES, findType } from "../../mock/decoration.js";
import "./index.css";

export default function MaterialLib() {
  const { state, dispatch, selectedFloor } = useDecoration();
  const [selectedMaterialId, setSelectedMaterialId] = useState("mat-01");

  // 引用次数：扫描所有页面所有楼层的 imageId / imageIds
  const refCounts = useMemo(() => {
    const counts = {};
    MATERIALS.forEach((m) => {
      counts[m.id] = 0;
    });
    Object.values(state.pages).forEach((page) => {
      page.floors.forEach((floor) => {
        const ids = Array.isArray(floor.config.imageIds)
          ? floor.config.imageIds
          : floor.config.imageId
            ? [floor.config.imageId]
            : [];
        ids.forEach((id) => {
          if (counts[id] !== undefined) counts[id] += 1;
        });
      });
    });
    return counts;
  }, [state.pages]);

  const handleReplace = (material) => {
    if (!selectedFloor) {
      message.warning("请先在左侧表格中点击选择目标组件");
      return;
    }
    if (!IMAGE_FLOOR_TYPES.includes(selectedFloor.type)) {
      message.warning(`「${selectedFloor.name}」为${findType(selectedFloor.type).label}，不支持替换图片素材`);
      return;
    }
    dispatch({ type: "REPLACE_IMAGE", floorId: selectedFloor.id, materialId: material.id });
    message.success(`已将「${selectedFloor.name}」配图替换为「${material.name}」，预览已同步`);
  };

  // 悬浮预览大图（Popover）
  const materialPreview = (m) => (
    <div className="material-popover">
      <img src={m.url} alt={m.name} className="material-popover-img" />
      <div className="material-popover-name">{m.name}</div>
      <div className="material-popover-meta">
        {m.width}×{m.height} · 被引用 {refCounts[m.id]} 次
      </div>
    </div>
  );

  return (
    <div className="deco-card material-lib">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <Icon name="image" size="1.25rem" className="card-title-icon" />
          素材库
          <span className="card-title-caption">共 {MATERIALS.length} 张 · 引用次数与楼层实时一致</span>
        </div>
        <span className="material-target">
          {selectedFloor ? (
            <>
              <span className="material-target-label">替换目标</span>
              <Tag color="blue" className="material-target-tag">
                {selectedFloor.name}
              </Tag>
            </>
          ) : (
            <span className="material-target-empty">点击表格行选择目标</span>
          )}
        </span>
      </div>

      <div className="material-grid">
        {/* 上传新素材入口：占位区 + 格式与大小限制说明 */}
        <div
          className="material-upload"
          onClick={() =>
            message.success("已选择「demo-大促素材.jpg」（1125×560 · 286KB），上传成功（演示环境）")
          }
          title="点击上传本地图片素材"
        >
          <Icon name="image-up" size="1.25rem" className="material-upload-icon" />
          <span className="material-upload-text">上传新素材</span>
          <span className="material-upload-limits">JPG / PNG / WebP · 单张 ≤ 5MB · 建议宽 ≥ 750px</span>
        </div>
        {MATERIALS.map((m) => (
          <div
            key={m.id}
            className={`material-item ${selectedMaterialId === m.id ? "material-item-selected" : ""}`}
            onClick={() => setSelectedMaterialId(m.id)}
            title="点击选中素材"
          >
            <Popover content={materialPreview(m)} placement="top" trigger="hover" mouseEnterDelay={0.25}>
              <span className="material-thumb">
                <img src={m.url} alt={m.name} />
              </span>
            </Popover>
            <span className="material-name" title={m.name}>
              {m.name}
            </span>
            <span className="material-meta">
              {m.width}×{m.height} · 被引用 {refCounts[m.id]} 次
            </span>
            <Button
              size="small"
              icon={<Icon name="repeat" size="0.875rem" />}
              onClick={(e) => {
                e.stopPropagation();
                handleReplace(m);
              }}
            >
              替换
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
