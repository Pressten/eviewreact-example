// 页面楼层结构（替代原买家端手机预览）：按排序号实时镜像当前页面的楼层排布
// 与表格严格联动：排序/启停/定时/新增高亮同步
// 选中改为 Checkbox 勾选：勾选 = 选中组件（联动表格选中行与素材替换目标），取消勾选 = 取消选中
import Checkbox from "@nce/eview-react/Checkbox";
import { IconPlusIcDigitalPowerPvPanel, IconPlusIcPublicAlarmClock, IconPlusIcPublicInfo } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { useDecoration } from "../../context.jsx";
import { findType } from "../../mock/decoration.jsx";
import "./index.css";

// 类型图标底色 tone 映射（与表格口径一致）
const TYPE_TONES = {
  carousel: "tone-info",
  seckill: "tone-error",
  recommend: "tone-success",
  imageText: "tone-purple",
  video: "tone-cyan",
  coupon: "tone-alert",
  searchBar: "tone-indigo",
  notice: "tone-warning",
  navGrid: "tone-mint",
  floatService: "tone-pink",
  countdownBanner: "tone-orange",
  memberRights: "tone-geekblue",
};

export default function FloorCanvas() {
  const { state, dispatch, activePage, activePageFloors } = useDecoration();

  const enabledCount = activePageFloors.filter((f) => f.status).length;

  return (
    <div className="deco-card floor-canvas">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <IconPlusIcDigitalPowerPvPanel iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          页面楼层结构
          <span className="card-title-caption">
            {activePage.title} · 启用 {enabledCount}/{activePageFloors.length} · 按排序号实时镜像
          </span>
        </div>
        <Tag color="green" bordered={false}>
          实时镜像
        </Tag>
      </div>

      <div className="canvas-list">
        {activePageFloors.length === 0 ? (
          <span className="canvas-empty">暂无楼层，可在上方表格添加组件</span>
        ) : (
          activePageFloors.map((floor) => {
            const type = findType(floor.type);
            const selected = floor.id === state.selectedFloorId;
            const flashing = floor.id === state.highlightFloorId;
            const hovered = floor.id === state.hoveredFloorId;
            const cls = [
              "canvas-block",
              selected ? "canvas-block-selected" : "",
              flashing ? "canvas-block-flash" : "",
              hovered ? "canvas-block-hover" : "",
              floor.status ? "" : "canvas-block-disabled",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={floor.id}
                className={cls}
                onClick={() => dispatch({ type: "SELECT_FLOOR", floorId: floor.id })}
                onDoubleClick={() => dispatch({ type: "OPEN_EDIT", floorId: floor.id })}
                onMouseEnter={() => dispatch({ type: "HOVER_FLOOR", floorId: floor.id })}
                onMouseLeave={() => dispatch({ type: "HOVER_FLOOR", floorId: null })}
                title={`${type.label} · 排序号 ${floor.sort} · 勾选或点击选中 · 双击编辑配置`}
              >
                <span
                  className="canvas-check"
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selected}
                    onChange={(_value, checked) =>
                      dispatch({
                        type: "SELECT_FLOOR",
                        floorId: checked ? floor.id : null,
                      })
                    }
                  />
                </span>
                <span className={`canvas-type-icon ${TYPE_TONES[floor.type] || "tone-info"}`}>
                  {type.icon}
                </span>
                <span className="canvas-name">{floor.name}</span>
                {floor.scheduledAt && (
                  <span className="canvas-schedule" title={`定时 ${floor.scheduledAt} 自动上线`}>
                    <IconPlusIcPublicAlarmClock iconSize="0.75rem" iconColor={['currentcolor']} />
                    {floor.scheduledAt.slice(5)}
                  </span>
                )}
                <span className="canvas-tail">
                  {floor.status ? (
                    <span className="canvas-uv" title="近 7 天 UV 占比">
                      {floor.uvShare > 0 ? `${floor.uvShare.toFixed(1)}%` : "新"}
                    </span>
                  ) : (
                    <span className="canvas-off">停用</span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      <span className="canvas-hint">
        <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['currentcolor']} />
        勾选楼层块选中（联动表格选中行与素材替换目标）· 点击块亦可选 · 双击打开配置。
      </span>
    </div>
  );
}
