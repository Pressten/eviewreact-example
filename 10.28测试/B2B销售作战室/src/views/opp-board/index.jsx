import { useState } from "react";
import { Button, Segmented, Select, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../../src/context.jsx";
import { filterOpps } from "../../../src/mock/selectors.js";
import { deptOptions, productLineOptions, timeRangeOptions, stageMap } from "../../../src/mock/stages.js";
import { ownerMap } from "../../../src/mock/salespeople.js";
import { fmtMoney } from "../../../src/mock/format.js";
import Kanban from "./kanban.jsx";
import ListView from "./list-view.jsx";
import NewOppModal from "./new-opp-modal.jsx";
import DetailDrawer from "./detail-drawer.jsx";
import "./index.css";

export default function OppBoard() {
  const {
    team, productLine, setProductLine,
    dept, setDept, timeRange, setTimeRange,
    funnelStage, setFunnelStage,
  } = useApp();

  const [view, setView] = useState("board");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [created, setCreated] = useState([]);

  const baseOpps = filterOpps({ team, productLine, dept });
  const createdFiltered = created.filter((o) => {
    if (o.team !== team) return false;
    if (productLine !== "all" && o.productLine !== productLine) return false;
    if (dept !== "all") {
      const ow = ownerMap[o.owner];
      if (!ow || ow.dept !== dept) return false;
    }
    return true;
  });
  const opps = [...baseOpps, ...createdFiltered];
  const totalAmount = opps.reduce((s, o) => s + o.amount, 0);

  const handleCreated = (newOpp) => {
    setCreated((prev) => [newOpp, ...prev]);
    setModalOpen(false);
  };

  const viewOpts = [
    { label: (<span className="ob__seg"><Icon name="columns-3" size="0.875rem" />看板</span>), value: "board" },
    { label: (<span className="ob__seg"><Icon name="list" size="0.875rem" />列表</span>), value: "list" },
  ];

  return (
    <div className="ob">
      <div className="ob__toolbar">
        <div className="ob__filters">
          <span className="ob__filter-label">
            <Icon name="sliders-horizontal" size="0.875rem" color="var(--on-surface-variant)" />
            筛选
          </span>
          <Select
            size="middle"
            value={dept}
            onChange={setDept}
            options={deptOptions}
            className="ob__sel"
            popupMatchSelectWidth={false}
          />
          <Select
            size="middle"
            value={productLine}
            onChange={setProductLine}
            options={productLineOptions}
            className="ob__sel"
            popupMatchSelectWidth={false}
          />
          <Select
            size="middle"
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
            className="ob__sel ob__sel--sm"
            popupMatchSelectWidth={false}
          />
        </div>

        <div className="ob__actions">
          <span className="ob__count">
            商机 <b>{opps.length}</b> 个 · 合计 <b className="ob__count-amt">{fmtMoney(totalAmount)}</b>
          </span>
          <Segmented value={view} onChange={setView} options={viewOpts} />
          <Button
            type="primary"
            icon={<Icon name="plus" size="0.875rem" color="#FFFFFF" />}
            onClick={() => setModalOpen(true)}
          >
            新建商机
          </Button>
        </div>
      </div>

      {funnelStage && (
        <div className="ob__chips">
          <Tag
            closable
            onClose={(e) => { e.preventDefault(); setFunnelStage(null); }}
            color="primary"
            className="ob__chip"
          >
            阶段筛选：{stageMap[funnelStage].label}
          </Tag>
          <span className="ob__chips-hint">
            <Icon name="mouse-pointer-click" size="0.75rem" color="var(--on-surface-variant)" />
            来自销售漏斗 · 点击对应列或此处 ✕ 取消
          </span>
        </div>
      )}

      <div className="ob__body">
        {view === "board" ? (
          <Kanban opps={opps} funnelStage={funnelStage} onSelect={setSelectedOpp} />
        ) : (
          <ListView opps={opps} onSelect={setSelectedOpp} />
        )}
      </div>

      <NewOppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        team={team}
      />
      <DetailDrawer opp={selectedOpp} onClose={() => setSelectedOpp(null)} />
    </div>
  );
}
