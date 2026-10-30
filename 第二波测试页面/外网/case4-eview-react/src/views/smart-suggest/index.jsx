// 智能优化建议：根据当前装修状态实时派生建议（停用楼层/高复用素材/秒杀核对/定时核对/楼层过多）
// 每条建议带一键操作，执行真实 reducer 动作；建议随状态变化自动增减
import { useMemo } from "react";
import { IconPlusIcCarLayers, IconPlusIcPublicAlarmClock, IconPlusIcPublicAlert, IconPlusIcPublicFlash, IconPlusIcPublicImage, IconPlusIcPublicStar, IconPlusIcPublicSuccess } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Tag from "@/shared/Tag";
import { toast } from "@/shared/AppToast";
import { useDecoration } from "../../context.jsx";
import { MATERIALS } from "../../mock/material.js";
import "./index.css";

export default function SmartSuggest() {
  const { state, dispatch, activePage, activePageFloors } = useDecoration();

  const suggestions = useMemo(() => {
    const list = [];

    // 统计全部页面素材引用（与素材库口径一致）
    const refCounts = {};
    MATERIALS.forEach((m) => {
      refCounts[m.id] = 0;
    });
    Object.values(state.pages).forEach((page) => {
      page.floors.forEach((floor) => {
        const ids = Array.isArray(floor.config.imageIds)
          ? floor.config.imageIds
          : floor.config.imageId
            ? [floor.config.imageId]
            : [];
        ids.forEach((id) => {
          if (refCounts[id] !== undefined) refCounts[id] += 1;
        });
      });
    });

    // 1. 停用楼层 → 一键启用
    const disabled = activePageFloors.filter((f) => !f.status);
    if (disabled.length > 0) {
      const names = disabled.slice(0, 2).map((f) => f.name).join("」「");
      list.push({
        key: "disabled",
        tone: "sug-warning",
        icon: <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />,
        title: `${disabled.length} 个楼层处于停用状态`,
        desc: `「${names}」等已停用，大促期间可能错失曝光位，建议启用或删除以精简配置。`,
        actionText: "一键启用",
        onAction: () => {
          dispatch({ type: "BATCH_TOGGLE", floorIds: disabled.map((f) => f.id), status: true });
          toast.success(`已启用 ${disabled.length} 个停用楼层，预览已同步`);
        },
      });
    }

    // 2. 高复用素材 → 一键换图（替换为未被引用的素材）
    const hotMaterialId = Object.keys(refCounts)
      .filter((id) => refCounts[id] >= 3)
      .sort((a, b) => refCounts[b] - refCounts[a])[0];
    if (hotMaterialId) {
      const hot = MATERIALS.find((m) => m.id === hotMaterialId);
      const idle = MATERIALS.find((m) => refCounts[m.id] === 0) || MATERIALS[6];
      const holder = Object.values(state.pages)
        .flatMap((p) => p.floors)
        .find(
          (f) =>
            f.status &&
            (f.config.imageId === hotMaterialId ||
              (Array.isArray(f.config.imageIds) && f.config.imageIds[0] === hotMaterialId))
        );
      if (holder && idle) {
        list.push({
          key: "reuse",
          tone: "sug-info",
          icon: <IconPlusIcPublicImage iconSize="0.875rem" iconColor={['currentcolor']} />,
          title: `素材「${hot.name}」被 ${refCounts[hotMaterialId]} 个楼层复用`,
          desc: "多楼层复用同一素材会降低页面新鲜度，建议为「" + holder.name + "」更换未被引用的素材。",
          actionText: "一键换图",
          onAction: () => {
            dispatch({ type: "REPLACE_IMAGE", floorId: holder.id, materialId: idle.id });
            toast.success(`已将「${holder.name}」配图更换为「${idle.name}」，预览已同步`);
          },
        });
      }
    }

    // 3. 秒杀楼层核对 → 打开编辑
    const seckill = activePageFloors
      .filter((f) => f.type === "seckill")
      .sort((a, b) => b.uvShare - a.uvShare)[0];
    if (seckill) {
      list.push({
        key: "seckill",
        tone: "sug-critical",
        icon: <IconPlusIcPublicFlash iconSize="0.875rem" iconColor={['currentcolor']} />,
        title: `「${seckill.name}」UV 占比 ${seckill.uvShare.toFixed(1)}% 居前列`,
        desc: "大促流量入口楼层，建议核对秒杀坑位库存与到手价，避免超卖与资损。",
        actionText: "查看组件",
        onAction: () => dispatch({ type: "OPEN_EDIT", floorId: seckill.id }),
      });
    }

    // 4. 定时上线核对 → 打开编辑
    const scheduled = activePageFloors.find((f) => f.scheduledAt);
    if (scheduled) {
      list.push({
        key: "schedule",
        tone: "sug-info",
        icon: <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} />,
        title: `「${scheduled.name}」将于 ${scheduled.scheduledAt} 自动上线`,
        desc: "请确认该楼层的素材、价格与跳转链接已就绪，上线后将自动生效。",
        actionText: "查看组件",
        onAction: () => dispatch({ type: "OPEN_EDIT", floorId: scheduled.id }),
      });
    }

    // 5. 楼层过多 → 定位 UV 最低楼层
    if (activePageFloors.length > 10) {
      const lowest = [...activePageFloors]
        .filter((f) => f.uvShare > 0)
        .sort((a, b) => a.uvShare - b.uvShare)[0];
      list.push({
        key: "crowded",
        tone: "sug-warning",
        icon: <IconPlusIcCarLayers iconSize="0.875rem" iconColor={['currentcolor']} />,
        title: `${activePage.title}楼层 ${activePageFloors.length} 个，超出最优区间`,
        desc: "行业最优 8-10 个：楼层过多会稀释 UV。已为你定位占比最低的「" + (lowest ? lowest.name : "") + "」。",
        actionText: "定位楼层",
        onAction: () => {
          if (lowest) {
            dispatch({ type: "SELECT_FLOOR", floorId: lowest.id });
            toast.info(`已定位「${lowest.name}」（UV 占比 ${lowest.uvShare.toFixed(1)}%），可在预览中查看`);
          } else {
            toast.info("可在表格中按「近 7 天 UV 占比」排序后处理低效楼层");
          }
        },
      });
    }

    return list;
  }, [state.pages, activePageFloors, activePage.title, dispatch]);

  return (
    <div className="deco-card smart-suggest">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <IconPlusIcPublicStar iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          智能优化建议
          <span className="card-title-caption">基于实时装修状态生成 · 处理后自动刷新</span>
        </div>
        <Tag color={suggestions.length > 0 ? "orange" : "green"} bordered={false}>
          {suggestions.length > 0 ? `${suggestions.length} 项待优化` : "配置健康"}
        </Tag>
      </div>

      {suggestions.length === 0 ? (
        <div className="sug-empty">
          <IconPlusIcPublicSuccess iconSize="1.25rem" iconColor={['currentcolor']} />
          暂无优化建议，当前页面配置健康，可放心发布。
        </div>
      ) : (
        <div className="sug-list">
          {suggestions.map((sug, idx) => (
            <div className="sug-item" key={sug.key}>
              <span className={`sug-icon ${sug.tone}`}>
                {sug.icon}
              </span>
              <div className="sug-body">
                <div className="sug-title">
                  {sug.title}
                  <span className="sug-index">建议 {idx + 1}</span>
                </div>
                <div className="sug-desc">{sug.desc}</div>
              </div>
              <Button size="small" status="primary" text={sug.actionText} onClick={sug.onAction} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
